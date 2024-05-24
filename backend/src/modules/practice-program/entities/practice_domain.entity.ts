import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('_domains_practice_programs')
export class PracticeDomain {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'group',
    nullable: true,
  })
  group: string;
}
