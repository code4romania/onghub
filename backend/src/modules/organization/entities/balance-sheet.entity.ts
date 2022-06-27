import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrganizationFinancial } from './organization-financial.entity';

@Entity()
export class BalanceSheet extends BaseEntity {
  @Column({ type: 'integer', name: 'year' })
  year: number;

  @Column({ type: 'float', name: 'total_income', default: 0 })
  totalIncome: number;

  @Column({ type: 'float', name: 'total_expenses', default: 0 })
  totalExpenses: number;

  @Column({
    type: 'float',
    name: 'total_income_no_patrimonial_purpuse',
    default: 0,
  })
  totalIncomeNoPatrimonialPurpuse: number;

  @Column({
    type: 'float',
    name: 'total_expenses_no_patrimonial_purpuse',
    default: 0,
  })
  totalExpensesNoPatrimonialPurpuse: number;

  @Column({
    type: 'float',
    name: 'total_income_special_destination',
    default: 0,
  })
  totalIncomeSpecialDestination: number;

  @Column({
    type: 'float',
    name: 'total_expenses_special_destination',
    default: 0,
  })
  totalExpensesSpecialDestination: number;

  @Column({ type: 'float', name: 'total_income_economic_activity', default: 0 })
  totalIncomeEconomicActivity: number;

  @Column({
    type: 'float',
    name: 'total_expenses_economic_activity',
    default: 0,
  })
  totalExpensesEconomicActivity: number;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'organization_financial_id',
  })
  organizationFinancialId: number;

  @ManyToOne(() => OrganizationFinancial)
  @JoinColumn({ name: 'organization_financial_id' })
  organizationFinancial: OrganizationFinancial;
}
