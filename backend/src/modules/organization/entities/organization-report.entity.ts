import { BaseEntity } from 'src/common/base/base-entity.class';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Investor } from './investor.entity';
import { Organization } from './organization.entity';
import { Partner } from './partner.entity';
import { Report } from './report.entity';

@Entity()
export class OrganizationReport extends BaseEntity {
  @OneToOne(
    () => Organization,
    (organization) => organization.organizationReport,
  )
  organization: Organization;

  @OneToMany(() => Report, (report) => report.organizationReport, {
    cascade: true,
  })
  @JoinColumn({ name: 'report_id' })
  reports: Report[];

  @OneToMany(() => Partner, (partner) => partner.organizationReport, {
    cascade: true,
  })
  @JoinColumn({ name: 'partner_id' })
  partners: Partner[];

  @OneToMany(() => Investor, (investor) => investor.organizationReport, {
    cascade: true,
  })
  @JoinColumn({ name: 'investor_id' })
  investors: Investor[];
}
