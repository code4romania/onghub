import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { CompletionStatus } from '../enums/CompletionStatus.enum';

export interface Investor extends BaseEntity {
  year: number;
  numberOfInvestors: number | null;
  status: CompletionStatus;
  link: string | null;
}
