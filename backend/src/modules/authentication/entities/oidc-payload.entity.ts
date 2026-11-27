import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

/**
 * Storage for every oidc-provider model (Session, Interaction, AuthorizationCode,
 * AccessToken, Grant, ...), one row per (kind, id). Adapter in O10.
 */
@Entity({ name: 'oidc_payload' })
export class OidcPayloadEntity {
  @PrimaryColumn({ type: 'text', name: 'kind' })
  kind: string;

  @PrimaryColumn({ type: 'text', name: 'id' })
  id: string;

  @Column({ type: 'jsonb', name: 'payload' })
  payload: Record<string, unknown>;

  @Index('oidc_payload_grant_id')
  @Column({ type: 'text', name: 'grant_id', nullable: true })
  grantId: string;

  @Index('oidc_payload_uid')
  @Column({ type: 'text', name: 'uid', nullable: true })
  uid: string;

  @Column({ type: 'text', name: 'user_code', nullable: true })
  userCode: string;

  @Index('oidc_payload_account_id')
  @Column({ type: 'text', name: 'account_id', nullable: true })
  accountId: string;

  @Index('oidc_payload_expires_at')
  @Column({ type: 'timestamptz', name: 'expires_at', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamptz', name: 'consumed_at', nullable: true })
  consumedAt: Date;
}
