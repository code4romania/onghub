import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Income } from '../dto/income.dto';
import { Expense } from '../dto/expense.dto';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

@Entity()
export class OrganizationFinancial extends BaseEntity {
  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationFinancial,
  )
  organization: Organization;

  @Column({ type: 'enum', enum: FinancialType, name: 'financial_type' })
  type: FinancialType;

  @Column({ type: 'integer', name: 'number_of_employees', default: 0 })
  numberOfEmployees: number;

  @Column({ type: 'integer', name: 'year' })
  year: number;

  @Column({ type: 'integer', name: 'total' })
  total: number;

  @Column({
    type: 'enum',
    enum: CompletionStatus,
    name: 'completion_status',
    default: CompletionStatus.NOT_COMPLETED,
  })
  status: CompletionStatus;

  @Column({ type: 'jsonb', name: 'data', nullable: true })
  data: Income | Expense;
}
