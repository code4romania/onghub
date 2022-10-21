import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { City, Domain, Skill } from 'src/shared/entities';
import { Faculty } from 'src/shared/entities/faculty.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class PracticeProgram extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'title',
  })
  title: string;

  @Column({ type: 'boolean', name: 'active', default: true })
  active: boolean;

  @Column({
    name: 'deadline',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deadline: Date;

  @Column({
    type: 'varchar',
    name: 'description',
  })
  description: string;

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

  @Column({ type: 'integer', name: 'min_working_hours' })
  minWorkingHours: number;

  @Column({ type: 'integer', name: 'max_working_hours', nullable: true })
  maxWorkingHours: number;

  @Column({
    type: 'varchar',
    name: 'link',
    nullable: true,
  })
  link: string;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'location_id' })
  locationId: number;

  @ManyToOne((type) => City)
  @JoinColumn({ name: 'location_id' })
  location: City;

  @ManyToMany(() => Domain, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'practice_program_to_domain',
    joinColumn: {
      name: 'practice_program_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'domain_id', referencedColumnName: 'id' },
  })
  domains: Domain[];

  @ManyToMany(() => Domain, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'practice_program_to_faculty',
    joinColumn: {
      name: 'practice_program_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'faculty_id', referencedColumnName: 'id' },
  })
  faculties: Faculty[];

  @ManyToMany(() => Domain, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'practice_program_to_skill',
    joinColumn: {
      name: 'practice_program_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @Exclude()
  @Column({ type: 'integer', name: 'organization_id' })
  organizationId: number;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
