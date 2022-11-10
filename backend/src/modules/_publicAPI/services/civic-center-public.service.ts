import { Injectable } from '@nestjs/common';
import { CivicCenterServiceSearchFilterDto } from 'src/modules/civic-center-service/dto/civic-center-service-search-filter.dto';
import { CivicCenterServiceService } from 'src/modules/civic-center-service/services/civic-center.service';

@Injectable()
export class CivicCenterPublicService {
  constructor(private readonly civicCenterService: CivicCenterServiceService) {}

  public async search(
    civicCenterServiceFilterDto: CivicCenterServiceSearchFilterDto,
  ) {
    return this.civicCenterService.searchCivicCenterServices(
      civicCenterServiceFilterDto,
    );
  }

  public async get(id: number) {
    return this.civicCenterService.findWithOrganization(id);
  }
}
