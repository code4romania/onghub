import { CivicCenterService } from '../entities/civic-center-service.entity';

export interface CivicCenterServiceFlat extends CivicCenterService {
  organizationId: number;
  organizationName: string;
  logo: string;
}
