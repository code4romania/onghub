import { Process, Processor } from '@nestjs/bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import { Job } from 'bull';
import { OrganizationFinancialService } from './organization-financial.service';

@Processor(QUEUES.FINANCIAL)
export class MailProcessor {
  constructor(
    private readonly organizationFinancialService: OrganizationFinancialService,
  ) {}

  @Process()
  public async processor(job: Job<any>) {}
}
