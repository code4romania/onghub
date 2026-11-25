import { DataSource, IsNull, LessThan } from 'typeorm';
import { OidcPayloadEntity } from 'src/modules/authentication/entities/oidc-payload.entity';
import { toProviderRealm } from '../oidc-provider.loader';
import { OidcClientService } from './oidc-client.service';

type Payload = Record<string, any>;

/** The adapter contract oidc-provider calls. */
export interface OidcAdapter {
  upsert(id: string, payload: Payload, expiresIn?: number): Promise<void>;
  find(id: string): Promise<Payload | undefined>;
  findByUid(uid: string): Promise<Payload | undefined>;
  findByUserCode(userCode: string): Promise<Payload | undefined>;
  consume(id: string): Promise<void>;
  destroy(id: string): Promise<void>;
  revokeByGrantId(grantId: string): Promise<void>;
}

/**
 * oidc-provider storage in Postgres (oidc_payload), one row per (kind, id).
 * - `find` never returns expired rows (it does not rely on the cleanup job)
 *   and reports `consumed` from consumed_at;
 * - `consume` is atomic; `revokeByGrantId` removes the whole grant;
 * - the `Client` kind is read from oidc_client through OidcClientService.
 * Returned objects are re-created in the provider's realm (see loader).
 */
export function createPgAdapter(
  dataSource: DataSource,
  clients: OidcClientService,
): (kind: string) => OidcAdapter {
  const repo = () => dataSource.getRepository(OidcPayloadEntity);

  class PgAdapter implements OidcAdapter {
    constructor(private readonly kind: string) {}

    async upsert(
      id: string,
      payload: Payload,
      expiresIn?: number,
    ): Promise<void> {
      if (this.kind === 'Client') return; // registration is disabled
      await repo().upsert(
        {
          kind: this.kind,
          id,
          payload: JSON.parse(JSON.stringify(payload)),
          grantId: payload.grantId ?? null,
          uid: payload.uid ?? null,
          userCode: payload.userCode ?? null,
          accountId:
            payload.accountId != null ? String(payload.accountId) : null,
          expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null,
          consumedAt: null,
        },
        ['kind', 'id'],
      );
    }

    async find(id: string): Promise<Payload | undefined> {
      if (this.kind === 'Client') {
        const metadata = await clients.findMetadata(id);
        return metadata ? toProviderRealm(metadata) : undefined;
      }
      return this.findBy({ id });
    }

    async findByUid(uid: string): Promise<Payload | undefined> {
      return this.findBy({ uid });
    }

    async findByUserCode(userCode: string): Promise<Payload | undefined> {
      return this.findBy({ userCode });
    }

    async consume(id: string): Promise<void> {
      await repo().update({ kind: this.kind, id, consumedAt: IsNull() }, {
        consumedAt: () => 'now()',
      } as any);
    }

    async destroy(id: string): Promise<void> {
      await repo().delete({ kind: this.kind, id });
    }

    async revokeByGrantId(grantId: string): Promise<void> {
      if (!grantId) return;
      await repo().delete({ grantId });
    }

    private async findBy(where: {
      id?: string;
      uid?: string;
      userCode?: string;
    }) {
      const key = Object.values(where)[0];
      if (!key) return undefined;
      const row = await repo().findOne({
        where: { kind: this.kind, ...where },
      });
      if (!row) return undefined;
      if (row.expiresAt && row.expiresAt.getTime() <= Date.now())
        return undefined;
      return toProviderRealm({
        ...row.payload,
        ...(row.consumedAt
          ? { consumed: Math.floor(row.consumedAt.getTime() / 1000) }
          : {}),
      });
    }
  }

  // A factory, not the class: the library tells classes from factories by
  // inspecting the function, which fails across realms under Jest.
  return (kind: string) => new PgAdapter(kind);
}

/** Deletes expired rows; run periodically (O13 schedules it). */
export async function deleteExpiredOidcPayloads(
  dataSource: DataSource,
): Promise<number> {
  const result = await dataSource
    .getRepository(OidcPayloadEntity)
    .delete({ expiresAt: LessThan(new Date()) });
  return result.affected ?? 0;
}
