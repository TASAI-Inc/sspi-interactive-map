export interface IIndicator {
  code: string;
  label: string;
  originalLabel: string;
  averageValue: number;
}

export type Nullable<T> = T | null;

export interface ICountryDataEntry {
  name: string;
  code: string;
  scores: { [indicator: string]: number | null}
}

export interface IGeoJsonDataFeatures {
  type: string;
  properties: {
    name: string;
    cartodb_id: string;
    scores: { [indicator: string]: number | null}
  },
  geometry: any;
}
export interface IGeoJsonData {
  type: 'string',
  features: IGeoJsonDataFeatures[];
}
