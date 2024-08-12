import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ILike } from 'typeorm';
import { CitySearchDto } from '../dto/city-search.dto';
import { FacultySearchDto } from '../dto/faculty-search.dto';
import { NomenclaturesService } from '../services';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Public()
@UseInterceptors(ClassSerializerInterceptor, CacheInterceptor)
@Controller('nomenclatures')
export class NomenclaturesController {
  constructor(private nomenclaturesService: NomenclaturesService) {}

  @Get('cities')
  getCities(@Query() citySearchDto: CitySearchDto) {
    return this.nomenclaturesService.getCitiesSearch(citySearchDto);
  }

  @Get('counties')
  getCounties() {
    return this.nomenclaturesService.getCounties({});
  }

  @Get('domains')
  getDomains() {
    return this.nomenclaturesService.getDomains({});
  }

  @Get('regions')
  getRegions() {
    return this.nomenclaturesService.getRegions({});
  }

  @Get('federations')
  getFederations() {
    return this.nomenclaturesService.getFederations({});
  }

  @Get('coalitions')
  getCoalitions() {
    return this.nomenclaturesService.getCoalitions({});
  }

  @Get('faculties')
  getFaculties(@Query() { search }: FacultySearchDto) {
    const options = search ? { where: { name: ILike(`%${search}%`) } } : {};
    return this.nomenclaturesService.getFaculties(options);
  }

  @Get('skills')
  getSkills() {
    return this.nomenclaturesService.getSkills({});
  }

  @Get('practice-domains')
  getPracticeDomains() {
    return this.nomenclaturesService.getPracticeDomains({});
  }

  @Get('service-domains')
  getServiceDomains() {
    return this.nomenclaturesService.getServiceDomains({});
  }

  @Get('beneficiaries')
  getBeneficiaries() {
    return this.nomenclaturesService.getBeneficiaries({});
  }

  @Get('issuers')
  getIssuers() {
    return this.nomenclaturesService.getIssuers({});
  }

  @Get('application-labels')
  getApplicationLabels() {
    return this.nomenclaturesService.getApplicationLabels({});
  }
}
