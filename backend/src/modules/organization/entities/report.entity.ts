import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { OrganizationReport } from './organization-report.entity';

@Entity('_report')
export class Report extends BaseEntity {
  @Column({ type: 'text', name: 'report' })
  report: string;

  @Column({ type: 'integer', name: 'number_of_volunteers' })
  numberOfVolunteers: number;

  @Column({ type: 'integer', name: 'number_of_contractors' })
  numberOfContractors: number;

  @Column({ type: 'integer', name: 'year' })
  year: number;

  @Column({
    type: 'enum',
    enum: CompletionStatus,
    name: 'status',
    default: CompletionStatus.NOT_COMPLETED,
  })
  status: CompletionStatus;

  @ManyToOne(
    () => OrganizationReport,
    (organizationReport) => organizationReport.reports,
  )
  organizationReport: OrganizationReport;
}
