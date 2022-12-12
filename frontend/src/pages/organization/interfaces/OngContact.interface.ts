import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export interface OngContact extends BaseEntity {
  name: string;
  email: string;
  phone: string;
}
