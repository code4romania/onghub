import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Income } from '../dto/income.dto';
import { Expense } from '../dto/expense.dto';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class OrganizationFinancial extends BaseEntity {
  @Exclude()
  @Column({
    type: 'integer',
    nullable: false,
    name: 'organizationId',
  })
  organizationId: number;

  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationFinancial,
    { onDelete: 'CASCADE' },
  )
  organization: Organization;

  @Column({ type: 'enum', enum: FinancialType, name: 'financial_type' })
  type: FinancialType;

  @Column({
    type: 'integer',
    name: 'number_of_employees',
    default: 0,
  })
  numberOfEmployees: number;

  @Column({ type: 'integer', name: 'year' })
  year: number;

  @Column({ type: 'integer', name: 'total', default: 0 })
  total: number;

  @Column({
    type: 'enum',
    enum: CompletionStatus,
    name: 'completion_status',
    default: CompletionStatus.NOT_COMPLETED,
  })
  status: CompletionStatus;

  @Column({
    type: 'boolean',
    name: 'synched_anaf',
    default: false,
  })
  synched_anaf: boolean;

  @Column({ type: 'jsonb', name: 'data', nullable: true })
  data?: Income | Expense;
}
