declare module "json2csv" {
  export class Parser {
    constructor(options?: any);
    parse(data: any): string;
  }
}

// In case the TypeScript definition for ExcelJS is missing or has issues
declare module "exceljs" {
  export type Cell = any;
  export type Row = any;

  export class Workbook {
    addWorksheet(name: string): Worksheet;
    xlsx: {
      writeBuffer(): Promise<Uint8Array>;
    };
  }

  export class Worksheet {
    columns: {
      header: string;
      key: string;
      width: number;
    }[];

    addRows(rows: any[]): void;
  }
}
