import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ANAF_URL } from 'src/common/constants/anaf.constants';
import { lastValueFrom, of } from 'rxjs';
import { map, catchError, find } from 'rxjs/operators';

@Injectable()
export class AnafService {
  private readonly logger = new Logger(AnafService.name);
  constructor(private readonly httpService: HttpService) {}

  public async getAnafData(companyCUI: string, year: number): Promise<any> {
    if (!companyCUI || companyCUI.length < 6) {
      return null;
    }

    companyCUI = companyCUI.replace('RO', '');

    //const currentDate = new Date().getFullYear();

    const company = this.httpService
      .get(ANAF_URL + `?an=${year}&cui=${companyCUI}`)
      .pipe(
        map((res) => res.data.i),
        catchError((err) => {
          this.logger.error('ANAF error');
          return of(null);
        }),
      );

    return lastValueFrom(company);
  }

  public async processAnafData(cui: string, year: number) {
    const anafData = await this.getAnafData(cui, year);
    if (anafData.length === 0) {
      return null;
    }

    let companyData = {
      income: null,
      expense: null,
      employees: null,
    };

    const income = anafData.find((obj) => {
      return obj.indicator === 'I38';
    });
    companyData.income = income['val_indicator'];

    const expense = anafData.find((obj) => {
      return obj.indicator === 'I40';
    });
    companyData.expense = expense['val_indicator'];

    const employees = anafData.find((obj) => {
      return obj.indicator === 'I46';
    });
    companyData.employees = employees['val_indicator'];

    return companyData;
  }
}
