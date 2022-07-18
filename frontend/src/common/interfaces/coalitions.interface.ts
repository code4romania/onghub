import { BaseEntity } from './base-entity.interface';

export interface Coalition extends BaseEntity {
  name: string;
  abbreviation: string;
}
