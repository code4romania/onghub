import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { CompletionStatus } from '../enums/CompletionStatus.enum';

export interface Report extends BaseEntity {
  report: string | null;
  numberOfVolunteers: number | null;
  numberOfContractors: number | null;
  year: number;
  status: CompletionStatus;
}
