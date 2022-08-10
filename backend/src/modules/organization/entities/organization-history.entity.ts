import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { OrganizationStatus } from '../enums/organization-status.enum';

@Entity()
export class OrganizationHistory
  extends BaseEntity
  implements HistoryEntityInterface
{
  @HistoryOriginalIdColumn({ name: 'history_original_id' })
  originalID: number;

  @HistoryActionColumn({ name: 'history_action' })
  action: HistoryActionType;

  /*
   =============================================================
    Inherited properties

    WARNING: Make sure to keep the properties in sync between
    the parent entity (Organization) and the History table
   =============================================================
   */

  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_activity_id',
  })
  organizationActivityId: number;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_legal_id',
  })
  organizationLegalId: number;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_report_id',
  })
  organizationReportId: number;
}
