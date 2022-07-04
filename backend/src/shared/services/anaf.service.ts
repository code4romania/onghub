import {
  IAnafCompany,
  IAnafHttpResponse,
  IAnafRequest,
} from '../interfaces/anaf.interface';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ANAF_URL } from 'src/common/constants/anaf.constants';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AnafService {
  private readonly logger = new Logger(AnafService.name);
  constructor(private readonly httpService: HttpService) {}

  public async checkCompany(companyCUI: string): Promise<IAnafCompany> {
    if (!companyCUI || companyCUI.length < 6) {
      return null;
    }

    companyCUI = companyCUI.replace('RO', '');

    const currentDate: string = new Date().toISOString().split('T')[0];

    const payload: IAnafRequest = {
      cui: companyCUI,
      data: currentDate,
    };

    const company: IAnafCompany | null = await this.httpService
      .post<IAnafHttpResponse>(ANAF_URL, [payload])
      .pipe(
        map((res) => res.data?.found[0]),
        catchError((err) => {
          this.logger.error('ANAF error');
          return of(null);
        }),
      )
      .toPromise();

    // check if either the company or its name is empty string (due to invalid CUI)
    if (!company || !company.denumire.length) {
      return null;
    } else {
      return company;
    }
  }
}
