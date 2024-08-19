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
@UseInterceptors(ClassSerializerInterceptor)
@Controller('nomenclatures')
export class NomenclaturesController {
  constructor(private nomenclaturesService: NomenclaturesService) {}

  @Get('cities')
  @UseInterceptors(CacheInterceptor)
  getCities(@Query() citySearchDto: CitySearchDto) {
    return this.nomenclaturesService.getCitiesSearch(citySearchDto);
  }

  @Get('counties')
  @UseInterceptors(CacheInterceptor)
  getCounties() {
    return this.nomenclaturesService.getCounties({});
  }

  @Get('domains')
  @UseInterceptors(CacheInterceptor)
  getDomains() {
    return this.nomenclaturesService.getDomains({});
  }

  @Get('regions')
  @UseInterceptors(CacheInterceptor)
  getRegions() {
    return this.nomenclaturesService.getRegions({});
  }

  @Get('federations')
  @UseInterceptors(CacheInterceptor)
  getFederations() {
    return this.nomenclaturesService.getFederations({});
  }

  @Get('coalitions')
  @UseInterceptors(CacheInterceptor)
  getCoalitions() {
    return this.nomenclaturesService.getCoalitions({});
  }

  @Get('faculties')
  @UseInterceptors(CacheInterceptor)
  getFaculties(@Query() { search }: FacultySearchDto) {
    const options = search ? { where: { name: ILike(`%${search}%`) } } : {};
    return this.nomenclaturesService.getFaculties(options);
  }

  @Get('skills')
  @UseInterceptors(CacheInterceptor)
  getSkills() {
    return this.nomenclaturesService.getSkills({});
  }

  @Get('practice-domains')
  @UseInterceptors(CacheInterceptor)
  getPracticeDomains() {
    return this.nomenclaturesService.getPracticeDomains({});
  }

  @Get('service-domains')
  @UseInterceptors(CacheInterceptor)
  getServiceDomains() {
    return this.nomenclaturesService.getServiceDomains({});
  }

  @Get('beneficiaries')
  @UseInterceptors(CacheInterceptor)
  getBeneficiaries() {
    return this.nomenclaturesService.getBeneficiaries({});
  }

  @Get('issuers')
  @UseInterceptors(CacheInterceptor)
  getIssuers() {
    return this.nomenclaturesService.getIssuers({});
  }

  @Get('application-labels')
  getApplicationLabels() {
    return this.nomenclaturesService.getApplicationLabels({});
  }
}
