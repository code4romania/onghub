import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Person } from 'src/modules/organization/dto/person.dto';
import { Contact } from './contact.entity';

@Entity()
export class OrganizationLegal extends BaseEntity {
  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'legal_reprezentative_id' })
  legalReprezentativeId: number;

  @Column({ type: 'jsonb', name: 'legal_representative' })
  legalReprezentative: Contact;

  @OneToOne(
    () => Organization,
    (organization) => organization.organizationLegal,
  )
  organization: Organization;

  @OneToMany(() => Contact, (contact) => contact.organizationLegal, {
    cascade: true,
  })
  directors: Contact[];

  @Column({ type: 'jsonb', name: 'others', nullable: true })
  others: Person[];

  @Column({ type: 'varchar', name: 'organization_statute', nullable: true })
  organizationStatute: string;
}
