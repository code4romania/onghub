import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
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
    unique: true,
  })
  title: string;

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

  @Column({ type: 'integer', name: 'min_working_hours' })
  minWorkingHours: number;

  @Column({ type: 'integer', name: 'max_working_hours', nullable: true })
  maxWorkingHours: number;

  @Column({
    type: 'varchar',
    name: 'link',
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
    name: 'practive_program_to_domain',
    joinColumn: {
      name: 'practice_program_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'domain_id', referencedColumnName: 'id' },
  })
  domains: Domain[];

  @ManyToMany(() => Domain, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'practive_program_to_faculty',
    joinColumn: {
      name: 'practice_program_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'faculty_id', referencedColumnName: 'id' },
  })
  faculties: Faculty[];

  @ManyToMany(() => Domain, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'practive_program_to_skill',
    joinColumn: {
      name: 'practice_program_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];
}
