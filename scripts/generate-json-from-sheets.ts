// Generate list of Score Types
import xlsx from "xlsx";
import fs from 'fs';

const STATIC_COLUMNS: { [key: string]: string } = {
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

function generateFilterCode (value: string): string {
  const regexFirstChar: RegExp = /\B\w+\W*/g;
  return removeListIndent(value).replace(regexFirstChar, '').toLowerCase();
}

function generateFilterValues (): void {
  const dataWithHeaders: any = getXlsxData('scripts/data/sspi-datatable-matthieu.xlsx', true);
  let headerColumns: string[] = dataWithHeaders[0].slice(3);

  const allData: any = getXlsxData('scripts/data/sspi-datatable-matthieu.xlsx');
  const averageRow = allData.find((entry: any) => entry.Countries === 'Average');

  const columnsObject = headerColumns.map(header => {
    return {
      code: generateFilterCode(header),
      label: removeListIndent(header),
      originalLabel: header,
      averageValue: averageRow[header]
    };
  });

  columnsObject.splice(0, 0, {
    code: 'all',
    label: 'All',
    originalLabel: 'All',
    averageValue: averageRow[STATIC_COLUMNS.overallCountryScore]
  })

  writeJson('filterValues', columnsObject);
}

function writeJson (fileName: string, data: any): void {
  fs.writeFileSync(`output/${fileName}.json`, JSON.stringify(data));
}

// Generate list of countries with their data
function trimNonFiltersKeys (object: { [key: string]: string }): { [key: string]: string } {
  Object.keys(STATIC_COLUMNS).forEach((key: string) => {
    delete object[STATIC_COLUMNS[key]];
  })
  return object;
}

function extractFilteredValues (rawData: { [key: string]: string }): { [key: string]: string } {
  const onlyFilterValues: { [key: string]: string } = trimNonFiltersKeys(rawData);
  return Object.keys(onlyFilterValues).reduce((obj: any, entry: any) => {
    obj[generateFilterCode(entry)] = rawData[entry];
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
          ...extractFilteredValues(data)
        }
      }
    });

    writeJson('countries-data', reformattedData);
}

generateFilterValues();
generateCountriesData();
