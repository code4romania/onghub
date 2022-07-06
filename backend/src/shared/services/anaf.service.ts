import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ANAF_URL } from 'src/common/constants/anaf.constants';
import { lastValueFrom, of } from 'rxjs';
import { map, catchError, find } from 'rxjs/operators';

@Injectable()
export class AnafService {
  private readonly logger = new Logger(AnafService.name);
  constructor(private readonly httpService: HttpService) {
    this.check();
  }

  public async checkCompany(companyCUI: string, year: number): Promise<any> {
    if (!companyCUI || companyCUI.length < 6) {
      return null;
    }

    companyCUI = companyCUI.replace('RO', '');

    //const currentDate: string = new Date().toISOString().split('T')[0];

    const companyData = {
      income: '',
      expense: '',
      employees: '',
    };

    const company = this.httpService
      .get(ANAF_URL + `?an=${year}&cui=${companyCUI}`)
      .pipe(
        map((res) =>
          res.data?.i.find((obj) => {
            obj.indicator === 'I38';
            obj.indicator === 'I40';
            obj.indicator === 'I46';
          }),
        ),
        catchError((err) => {
          this.logger.error('ANAF error');
          return of(null);
        }),
      );

    //companyData.income = company.

    // check if either the company or its name is empty string (due to invalid CUI)
    if (!company) {
      return null;
    } else {
      return lastValueFrom(company);
    }
  }

  async check() {
    console.log(await this.checkCompany('36528296', 2021));
  }
}
