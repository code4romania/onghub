import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ANAF_URL } from 'src/common/constants/anaf.constants';
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface FinancialInformation {
  numberOfEmployees: number;
  totalIncome: number;
  totalExpense: number;
}

@Injectable()
export class AnafService {
  private readonly logger = new Logger(AnafService.name);
  constructor(private readonly httpService: HttpService) {}

  public async getAnafData(companyCUI: string, year: number): Promise<any> {
    if (!companyCUI || companyCUI.length < 6) {
      return null;
    }

    companyCUI = companyCUI.replace('RO', '');

    console.log(`${ANAF_URL}?an=${year}&cui=${companyCUI}`);

    const company = this.httpService
      .get(ANAF_URL + `?an=${year}&cui=${companyCUI}`)
      .pipe(
        map((res) => res.data.i),
        catchError((err) => {
          this.logger.error('ANAF error', err);
          return of(null);
        }),
      );

    return lastValueFrom(company);
  }

  // TODO: move in organization.service something. No business logic allowed here.
  public async getFinancialInformation(
    cui: string,
    year: number,
  ): Promise<FinancialInformation> {
    const anafData = await this.getAnafData(cui, year);

    if (!anafData || (anafData && anafData.length === 0)) {
      return null;
    }

    const income = anafData.find((obj) => {
      return obj.indicator === 'I38';
    });
    const expense = anafData.find((obj) => {
      return obj.indicator === 'I40';
    });
    const employees = anafData.find((obj) => {
      return obj.indicator === 'I46';
    });

    return {
      numberOfEmployees: employees?.val_indicator,
      totalExpense: expense?.val_indicator,
      totalIncome: income?.val_indicator,
    };
  }
}
