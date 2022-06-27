import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Person } from 'src/modules/organization/dto/person.dto';
import { Contact } from './contact.entity';

@Entity()
export class OrganizationLegal extends BaseEntity {
  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'legal_reprezentative_id' })
  legalReprezentativeId: number;

  @OneToOne((type) => Contact, { cascade: true })
  @JoinColumn({ name: 'legal_reprezentative_id' })
  legalReprezentative: Contact;

  @OneToOne(
    () => Organization,
    (organization) => organization.organizationLegal,
  )
  organization: Organization;

  @ManyToMany(() => Contact, { cascade: true })
  @JoinTable({
    name: 'legal_to_contacts',
    joinColumn: {
      name: 'organization_legal_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'contact_id', referencedColumnName: 'id' },
  })
  directors: Contact[];

  @Column({ type: 'jsonb', name: 'others', nullable: true })
  others: Person[];

  @Column({ type: 'varchar', name: 'organization_statute', nullable: true })
  organizationStatute: string;
}
