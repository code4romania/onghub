import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ANAF_URL } from 'src/common/constants/anaf.constants';
import { firstValueFrom, lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

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

    const company = await this.httpService
      .get(ANAF_URL + `?an=${year}&cui=${companyCUI}`)
      .pipe(
        map((res) => res.data.i),
        catchError((err) => {
          this.logger.error('ANAF error', err);
          Sentry.captureException(err, {
            extra: {
              companyCUI,
              year,
            },
          });
          return of(null);
        }),
      )
      .toPromise();

    return company;
  }
}
