import { Exclude } from 'class-transformer';
import {
  OrganizationActivity,
  OrganizationGeneral,
} from 'src/modules/organization/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { County } from './county.entity';

@Entity({ name: '_city' })
export class City {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({
    type: 'integer',
    nullable: true,
    name: 'county_id',
  })
  countyId: number;

  @ManyToOne(() => County, (county) => county.cities, { cascade: true })
  @JoinColumn({ name: 'county_id' })
  @Index()
  county: County;

  @ManyToMany(
    (type) => OrganizationActivity,
    (organizationActivity) => organizationActivity.cities,
  )
  organizationActivities: OrganizationActivity[];

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_on',
    type: 'timestamp with time zone',
    select: false,
  })
  deletedOn: Date;

  @Index()
  @CreateDateColumn({ name: 'created_on', type: 'timestamp with time zone' })
  createdOn: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_on',
    type: 'timestamp with time zone',
    select: false,
  })
  updatedOn: Date;

  @OneToMany(
    () => OrganizationGeneral,
    (organizationGeneral) => organizationGeneral.city,
    { onDelete: 'SET NULL' },
  )
  organizationGeneral: OrganizationGeneral;
}
