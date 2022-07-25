import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { OrganizationReport } from './organization-report.entity';

@Entity('_investor')
export class Investor extends BaseEntity {
  @Column({ type: 'integer', name: 'year' })
  year: number;

  @Column({ type: 'integer', name: 'number_of_investors', nullable: true })
  numberOfInvestors: number;

  @Column({
    type: 'enum',
    enum: CompletionStatus,
    name: 'status',
    default: CompletionStatus.NOT_COMPLETED,
  })
  status: CompletionStatus;

  @ManyToOne(
    () => OrganizationReport,
    (organizationReport) => organizationReport.investors,
  )
  organizationReport: OrganizationReport;
}
