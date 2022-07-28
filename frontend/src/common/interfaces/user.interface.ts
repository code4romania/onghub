import { BaseEntity } from './base-entity.interface';

export interface User extends BaseEntity {
  cognitoId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  organization: any;
}
