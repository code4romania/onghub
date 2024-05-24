import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('_beneficiary')
export class Beneficiary {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;
}
