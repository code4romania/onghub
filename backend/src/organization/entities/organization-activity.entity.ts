import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Area } from 'src/common/entities/area.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Organization } from './organization.entity';
import { City, Domain } from 'src/common/entities';

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

  @Column({ type: 'jsonb', name: 'branches', nullable: true })
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

  @ManyToMany(() => City, { cascade: true })
  @JoinTable({
    name: 'activity_to_city',
    joinColumn: {
      name: 'organization_activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'city_id', referencedColumnName: 'id' },
  })
  cities: City[];

  @ManyToMany(() => Domain, { cascade: true })
  @JoinTable({
    name: 'activity_to_domain',
    joinColumn: {
      name: 'organization_activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'domain_id', referencedColumnName: 'id' },
  })
  domains: Domain[];
}
