import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Area } from 'src/common/entities/area.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ActivityToDomain } from './activity-to-domain.entity';
import { ActivityToCity } from './activity-to-city.entity';
import { Organization } from './organization.entity';

@Entity()
export class OrganizationActivity extends BaseEntity {
  @Column({ type: 'boolean', name: 'is_part_of_federation', default: false })
  isPartOfFederation: boolean;

  @Column({ type: 'jsonb', name: 'federations' })
  federations: string[];

  @Column({
    type: 'boolean',
    name: 'is_part_of_international_organization',
  })
  isPartOfInternationalOrganization: boolean;

  @Column({ type: 'varchar', name: 'international_organization_name' })
  internationalOrganizationName: string;

  @Column({ type: 'boolean', name: 'is_social_service_viable' })
  isSocialServiceViable: boolean;

  @Column({ type: 'boolean', name: 'offers_grants' })
  offersGrants: boolean;

  @Column({
    type: 'boolean',
    name: 'is_public_intrest_organization',
  })
  isPublicIntrestOrganization: boolean;

  @Column({ type: 'boolean', name: 'has_branches' })
  hasBranches: boolean;

  @Column({ type: 'jsonb', name: 'branches' })
  branches: number[];

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'area_id' })
  areaId: number;

  @ManyToOne((type) => Area)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @OneToOne(
    () => Organization,
    (organization) => organization.organizationGeneral,
  )
  organization: Organization;

  @OneToMany(
    () => ActivityToCity,
    (activityToCity) => activityToCity.oragnizationActivity,
    { cascade: true },
  )
  public activityToCities: ActivityToCity[];

  @OneToMany(
    () => ActivityToDomain,
    (activityToDomain) => activityToDomain.oragnizationActivity,
    { cascade: true },
  )
  public activityToDomains: ActivityToDomain[];
}
