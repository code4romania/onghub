import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OrganizationStatus } from '../enums/organization-status.enum';
import { OrganizationActivity } from './organization-activity.entity';
import { OrganizationFinancial } from './organization-financial.entity';
import { OrganizationGeneral } from './organization-general.entity';
import { OrganizationLegal } from './organization-legal.entity';
import { OrganizationReport } from './organization-report.entity';

@Entity()
export class Organization extends BaseEntity {
  @Column({
    type: 'timestamp with time zone',
    name: 'synced_on',
    default: new Date(), // TODO: this is not working as expected. It will be the addToDatabase date not the insert date
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
    { cascade: true, onDelete: 'CASCADE' },
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
    { cascade: true, onDelete: 'CASCADE' },
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
    { cascade: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organization_legal_id' })
  organizationLegal: OrganizationLegal;

  @OneToMany(
    () => OrganizationFinancial,
    (organizationFinancial) => organizationFinancial.organization,
    { cascade: true, onDelete: 'CASCADE' },
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
    { cascade: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organization_report_id' })
  organizationReport: OrganizationReport;
}
