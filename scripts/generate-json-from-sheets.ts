import xlsx from "xlsx";
import fs from 'fs';
import { IIndicator } from '../src/models/models';

const XLSX_STATIC_COLUMNS: { [key: string]: string } = {
  countries: 'Countries',
  countryCode: 'Country Code',
  overallCountryScore: 'Overall country score'
}

function getXlsxData (filePath: string, withHeaders: boolean = false): unknown {
  const fileData: xlsx.WorkBook = xlsx.readFile(filePath);
  return xlsx.utils.sheet_to_json(fileData.Sheets[fileData.SheetNames[0]], withHeaders ? { header: 1 } : {});
}

function removeListIndent (value: string): string {
  return value.replace(/\d+\.\s/, '');
}

function generateIndicatorCode (value: string): string {
  const regexFirstChar: RegExp = /\B\w+\W*/g;
  return removeListIndent(value).replace(regexFirstChar, '').toLowerCase();
}

function generateIndicators (): void {
  const dataWithHeaders: any = getXlsxData('scripts/data/sspi-datatable-matthieu.xlsx', true);
  let headerColumns: string[] = dataWithHeaders[0].slice(3);

  const allData: any = getXlsxData('scripts/data/sspi-datatable-matthieu.xlsx');
  const averageRow = allData.find((entry: any) => entry.Countries === 'Average');

  const columnsObject: IIndicator[] = headerColumns.map(header => {
    return {
      code: generateIndicatorCode(header),
      label: removeListIndent(header),
      originalLabel: header,
      averageValue: averageRow[header]
    };
  });

  columnsObject.splice(0, 0, {
    code: 'overall',
    label: 'Overall',
    originalLabel: 'Overall',
    averageValue: averageRow[XLSX_STATIC_COLUMNS.overallCountryScore]
  })

  writeJson('indicators', columnsObject);
}

function writeJson (fileName: string, data: any): void {
  fs.writeFileSync(`output/${fileName}.json`, JSON.stringify(data));
}

function trimNonIndicatorsKeys (object: { [key: string]: string }): { [key: string]: string } {
  Object.keys(XLSX_STATIC_COLUMNS).forEach((key: string) => {
    delete object[XLSX_STATIC_COLUMNS[key]];
  })
  return object;
}

function extractIndicatorsValues (rawData: { [key: string]: string }): { [key: string]: string } {
  const onlyFilterValues: { [key: string]: string } = trimNonIndicatorsKeys(rawData);
  return Object.keys(onlyFilterValues).reduce((obj: any, entry: any) => {
    obj[generateIndicatorCode(entry)] = rawData[entry] === 'MD' ? null : rawData[entry];
    return obj;
  }, {});
}

function generateCountriesData (): void {
  const allData: any = getXlsxData('scripts/data/sspi-datatable-matthieu.xlsx');

  const reformattedData = allData
    .filter((data: any) => !!data['Country Code'])
    .map((data: any) => {
      return {
        name: data.Countries,
        code: data['Country Code'],
        scores: {
          overall: data['Overall country score'],
          ...extractIndicatorsValues(data)
        }
      }
    });

    writeJson('countries-data', reformattedData);
}

generateIndicators();
generateCountriesData();
