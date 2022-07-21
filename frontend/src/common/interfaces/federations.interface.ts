import { BaseEntity } from './base-entity.interface';

export interface Federation extends BaseEntity {
  name: string;
  abbreviation: string;
}
