import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City, County, Domain } from 'src/shared/entities';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CitySearchDto } from '../dto/city-search.dto';
import { ApplicationType } from '../entities/application-type.entity';

@Injectable()
export class NomenclaturesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
    @InjectRepository(County)
    private readonly countiesRepository: Repository<County>,
    @InjectRepository(Domain)
    private readonly domainsRepository: Repository<Domain>,
    @InjectRepository(ApplicationType)
    private readonly applicationTypeRepository: Repository<ApplicationType>,
  ) {}

  public getCities(conditions: FindManyOptions<City>) {
    return this.citiesRepository.find(conditions);
  }

  public async getCitiesFiltered(
    citySearchDto: CitySearchDto,
  ): Promise<City[]> {
    // const query = this.citiesRepository
    //   .createQueryBuilder('city')
    //   .select([
    //     `city.id AS "id"`,
    //     `city.name AS "name"`,
    //     `city.deletedOn AS "deletedOn"`,
    //     `city.createdOn AS "createdOn"`,
    //     `city.updatedOn AS "updatedOn"`,
    //   ])
    //   .leftJoinAndSelect('city.county', 'county');

    // const parsedSearch = citySearchDto.search.trim().split("'").join('');
    // let searchString = '';
    // searchString += `LOWER(city.name) like LOWER('%${parsedSearch}')`;

    // const response = query.getMany();
    // return response;

    //const searchString = citySearchDto.search + '%';
    // const query = this.citiesRepository.query(
    //   `SELECT * FROM _city LEFT JOIN _county ON county_id = _county.id WHERE _city.name ILIKE 'bucu%' LIMIT 5`,
    // );

    // return query;

    return this.citiesRepository
      .createQueryBuilder('city')
      .innerJoinAndSelect('city.county', 'county', 'county.id=city.county_id')
      .where(`city.name ILIKE :search`, { search: citySearchDto.search })
      .getMany();
  }

  public getCounties(conditions: FindManyOptions<County>) {
    return this.countiesRepository.find(conditions);
  }

  public getDomains(conditions: FindManyOptions<Domain>) {
    return this.domainsRepository.find(conditions);
  }

  public getAppType(conditions: FindOneOptions<ApplicationType>) {
    return this.applicationTypeRepository.findOne(conditions);
  }
}
