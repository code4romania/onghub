import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BalanceSheet } from './balance-sheet.entity';
import { Organization } from './organization.entity';

@Entity()
export class OrganizationFinancial extends BaseEntity {
  @OneToOne(
    () => Organization,
    (organization) => organization.organizationFinancial,
  )
  organization: Organization;

  @Column({ type: 'integer', name: 'number_of_employees', default: 0 })
  numberOfEmployees: number;

  @Column({ type: 'float', name: 'total_income', default: 0 })
  totalIncome: number;

  @Column({ type: 'float', name: 'total_expenses', default: 0 })
  totalExpenses: number;

  @OneToMany(
    (type) => BalanceSheet,
    (balanceSheet) => balanceSheet.organizationFinancial,
  )
  balanceSheets: BalanceSheet[];
}
