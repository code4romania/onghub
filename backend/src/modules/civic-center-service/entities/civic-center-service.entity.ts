import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { City, Domain } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AgeCategory } from '../../practice-program/enums/age-category.enum';
import { CivicCenterFeedback } from './civic-center-feedback.entity';

@Entity()
export class CivicCenterService extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'location_id' })
  locationId: number;

  @ManyToOne((type) => City)
  @JoinColumn({ name: 'location_id' })
  location: City;

  @Column({
    name: 'start_date',
    type: 'timestamp with time zone',
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  endDate: Date;

  @Column({ type: 'boolean', name: 'is_period_not_determined', default: false })
  isPeriodNotDetermined: boolean;

  @Column({
    type: 'varchar',
    name: 'short_description',
  })
  shortDescription: string;

  @Column({
    type: 'varchar',
    name: 'long_description',
  })
  longDescription: string;

  @ManyToMany(() => Domain, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'civic_center_service_to_domain',
    joinColumn: {
      name: 'civic_center_service_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'domain_id', referencedColumnName: 'id' },
  })
  domains: Domain[];

  @Column({ type: 'simple-array', name: 'age_categories' })
  ageCategories: AgeCategory[];

  @Column({ type: 'boolean', name: 'has_online_access', default: false })
  hasOnlineAccess: boolean;

  @Column({
    type: 'varchar',
    name: 'online_access_link',
    nullable: true,
  })
  onlineAccessLink: string;

  @Column({
    type: 'varchar',
    name: 'online_access_description',
    nullable: true,
  })
  onlineAccessDescription: string;

  @Column({ type: 'boolean', name: 'has_email_phone_access', default: false })
  hasEmailPhoneAccess: boolean;

  @Column({
    type: 'varchar',
    name: 'email_access',
    nullable: true,
  })
  emailAccess: string;

  @Column({
    type: 'varchar',
    name: 'phone_access',
    nullable: true,
  })
  phoneAccess: string;

  @Column({
    type: 'varchar',
    name: 'email_phone_access_description',
    nullable: true,
  })
  emailPhoneAccessDescription: string;

  @Column({ type: 'boolean', name: 'has_physical_access', default: false })
  hasPhysicalAccess: boolean;

  @Column({
    type: 'varchar',
    name: 'physical_access_address',
    nullable: true,
  })
  physicalAccessAddress: string;

  @Column({
    type: 'varchar',
    name: 'physical_access_description',
    nullable: true,
  })
  physicalAccessDescription: string;

  @Column({ type: 'boolean', name: 'active', default: true })
  active: boolean;

  @Column({ type: 'integer', name: 'organization_id' })
  organizationId: number;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  @OneToMany(
    (type) => CivicCenterFeedback,
    (civicCenterFeedback) => civicCenterFeedback.civicCenterService,
  )
  civicCenterFeedback: CivicCenterFeedback[];
}
