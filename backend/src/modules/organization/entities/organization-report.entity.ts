import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, OneToOne } from 'typeorm';
import { IInvestor } from '../interfaces/inverstors.interface';
import { IReport } from '../interfaces/report.interface';
import { Organization } from './organization.entity';

@Entity()
export class OrganizationReport extends BaseEntity {
  @Column({ type: 'integer', name: 'number_of_volunteers', default: 0 })
  numberOfVolunteers: number;

  @Column({ type: 'integer', name: 'number_of_contractors', default: 0 })
  numberOfContractors: number;

  @Column({ type: 'jsonb', name: 'reports', nullable: true })
  reports: IReport[];

  @Column({ type: 'jsonb', name: 'donors', nullable: true })
  donors: IInvestor[];

  @Column({ type: 'jsonb', name: 'partners', nullable: true })
  partners: IInvestor[];

  @OneToOne(
    () => Organization,
    (organization) => organization.organizationReport,
  )
  organization: Organization;
}
