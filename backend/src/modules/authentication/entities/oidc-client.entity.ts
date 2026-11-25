import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from 'src/modules/application/entities/application.entity';
import { OidcClientStatus } from '../enums/auth.enums';
import { AuthTimestamps } from './auth-timestamps';

/** A client application of the NGO Hub OIDC provider (VIC first). Read by the provider's findClient (O10). */
@Entity({ name: 'oidc_client' })
export class OidcClientEntity extends AuthTimestamps {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', name: 'application_id', nullable: true }) // unique via the OneToOne
  applicationId: number;

  @OneToOne(() => Application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ type: 'text', name: 'client_id', unique: true })
  clientId: string;

  /** Sealed (secret-box), never hashed: the library compares it in clear. */
  @Column({
    type: 'text',
    name: 'client_secret_enc',
    nullable: true,
    select: false,
  })
  clientSecretEnc: string;

  @Column({ type: 'text', name: 'redirect_uris', array: true, default: '{}' })
  redirectUris: string[];

  @Column({
    type: 'text',
    name: 'post_logout_redirect_uris',
    array: true,
    default: '{}',
  })
  postLogoutRedirectUris: string[];

  @Column({
    type: 'text',
    name: 'allowed_scopes',
    array: true,
    default: '{openid}',
  })
  allowedScopes: string[];

  @Column({
    type: 'text',
    name: 'token_endpoint_auth_method',
    default: 'client_secret_basic',
  })
  tokenEndpointAuthMethod: string;

  @Column({ type: 'boolean', name: 'first_party', default: false })
  firstParty: boolean;

  @Column({
    type: 'enum',
    enum: OidcClientStatus,

    name: 'status',
    default: OidcClientStatus.ACTIVE,
  })
  status: OidcClientStatus;

  @Column({ type: 'integer', name: 'created_by', nullable: true })
  createdById: number;

  @Column({ type: 'integer', name: 'updated_by', nullable: true })
  updatedById: number;
}
