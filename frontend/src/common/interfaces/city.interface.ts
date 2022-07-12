import { County } from './county.interface';

export interface City {
  id: number;
  name: string;
  countyId: number;
  county: County;
}
