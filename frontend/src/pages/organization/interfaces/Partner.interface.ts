import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { CompletionStatus } from '../enums/CompletionStatus.enum';

export interface Partner extends BaseEntity {
  year: number;
  numberOfPartners: number | null;
  status: CompletionStatus;
  link: string | null;
}
