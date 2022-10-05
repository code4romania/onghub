import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class PublicKeys extends BaseEntity {
  @Column({ type: 'varchar', name: 'api_key' })
  apiKey: string;

  @Column({ type: 'varchar', name: 'secret_key' })
  secretKey: string;

  @Column({ type: 'varchar', name: 'issued_by' })
  issuedBy: string;
}
