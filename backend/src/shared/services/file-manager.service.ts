import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class FileManagerService {
  private readonly logger = new Logger(FileManagerService.name);

  constructor() {}

  jsonToExcelBuffer(jsonData: any, outputFileName: string) {
    /**
     *  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',)
     *  @Header('Content-Disposition', 'attachment; filename="Utilizatori.xlsx"')
     */
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(jsonData);

    XLSX.utils.book_append_sheet(wb, ws, outputFileName);

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  jsonToCSV(jsonData: any, outputFileName: string): string {
    /**
     *  @Header('Content-Type', 'text/csv')
     *  @Header('Content-Disposition', 'attachment; filename="Utilizatori.csv"')
     */
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(jsonData);

    XLSX.utils.book_append_sheet(wb, ws, outputFileName);

    return XLSX.utils.sheet_to_csv(ws);
  }
}
