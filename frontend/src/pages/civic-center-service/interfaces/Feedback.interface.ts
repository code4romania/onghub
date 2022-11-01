import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export interface IFeedback extends BaseEntity {
  id: number;
  fullName: string;
  interactionDate: string;
  message: string;
  rating: number;
  civicCenterService: {
    name: string;
  };
}
