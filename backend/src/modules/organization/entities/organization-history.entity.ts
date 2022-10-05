import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OrganizationStatus } from '../enums/organization-status.enum';
import { OrganizationActivity } from './organization-activity.entity';
import { OrganizationFinancial } from './organization-financial.entity';
import { OrganizationGeneral } from './organization-general.entity';
import { OrganizationLegal } from './organization-legal.entity';
import { OrganizationReport } from './organization-report.entity';
import { OrganizationRequest } from './organization-request.entity';

@Entity()
export class OrganizationHistory
  extends BaseEntity
  implements HistoryEntityInterface
{
  @HistoryOriginalIdColumn({ name: 'history_original_id' })
  originalID: number;

  @HistoryActionColumn({ name: 'history_action' })
  action: HistoryActionType;

  /**
   =============================================================
    Inherited properties
    WARNING: Make sure to keep the properties in sync between
    the parent entity (Organization) and the History table
   =============================================================
   */

  @Column({
    type: 'timestamp with time zone',
    name: 'synced_on',
    default: new Date(),
  })
  syncedOn: Date;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    name: 'status',
    default: OrganizationStatus.PENDING,
  })
  status: OrganizationStatus;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_general_id',
  })
  organizationGeneralId: number;

  @OneToOne(
    () => OrganizationGeneral,
    (organizationGeneral) => organizationGeneral.organization,
    { cascade: true },
  )
  @JoinColumn({ name: 'organization_general_id' })
  organizationGeneral: OrganizationGeneral;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_activity_id',
  })
  organizationActivityId: number;

  @OneToOne(
    () => OrganizationActivity,
    (organizationActivity) => organizationActivity.organization,
    { cascade: true },
  )
  @JoinColumn({ name: 'organization_activity_id' })
  organizationActivity: OrganizationActivity;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_legal_id',
  })
  organizationLegalId: number;

  @OneToOne(
    () => OrganizationLegal,
    (organizationLegal) => organizationLegal.organization,
    { cascade: true },
  )
  @JoinColumn({ name: 'organization_legal_id' })
  organizationLegal: OrganizationLegal;

  @OneToMany(
    () => OrganizationFinancial,
    (organizationFinancial) => organizationFinancial.organization,
    { cascade: true },
  )
  @JoinColumn({ name: 'organization_financial_id' })
  organizationFinancial: OrganizationFinancial[];

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_report_id',
  })
  organizationReportId: number;

  @OneToOne(
    () => OrganizationReport,
    (organizationReport) => organizationReport.organization,
    { cascade: true },
  )
  @JoinColumn({ name: 'organization_report_id' })
  organizationReport: OrganizationReport;

  @OneToMany((type) => User, (user) => user.organization)
  users: User[];

  @OneToMany((type) => OrganizationRequest, (request) => request.organization)
  requests: OrganizationRequest[];
}
