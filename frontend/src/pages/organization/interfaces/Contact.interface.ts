import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export interface Contact extends BaseEntity {
  fullName: string;
  email: string;
  phone: string;
  role: string;
}
