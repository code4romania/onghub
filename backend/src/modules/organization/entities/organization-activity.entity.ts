import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { City, Domain } from 'src/shared/entities';
import { Area } from '../enums/organization-area.enum';
import { Region } from 'src/shared/entities/region.entity';
import { Federation } from 'src/shared/entities/federation.entity';
import { Coalition } from 'src/shared/entities/coalition.entity';

@Entity()
export class OrganizationActivity extends BaseEntity {
  @Column({ type: 'enum', enum: Area, name: 'area' })
  area: Area;

  @Column({ type: 'boolean', name: 'is_part_of_federation', default: false })
  isPartOfFederation: boolean;

  @ManyToMany(() => Federation, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'activity_to_federations',
    joinColumn: {
      name: 'organization_activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'federation_id', referencedColumnName: 'id' },
  })
  federations: Federation[];

  @Column({ type: 'boolean', name: 'is_part_of_coalition', default: false })
  isPartOfCoalition: boolean;

  @ManyToMany(() => Coalition, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'activity_to_coalitions',
    joinColumn: {
      name: 'organization_activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'coalition_id', referencedColumnName: 'id' },
  })
  coalitions: Coalition[];

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

  @OneToOne(
    () => Organization,
    (organization) => organization.organizationGeneral,
  )
  organization: Organization;

  @ManyToMany(() => Region, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'activity_to_region',
    joinColumn: {
      name: 'organization_activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'region_id', referencedColumnName: 'id' },
  })
  regions: Region[];

  @ManyToMany(() => City, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'activity_to_city',
    joinColumn: {
      name: 'organization_activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'city_id', referencedColumnName: 'id' },
  })
  cities: City[];

  @ManyToMany(() => Domain, { cascade: true, onDelete: 'CASCADE' })
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
