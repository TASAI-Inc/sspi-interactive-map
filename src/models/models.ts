export interface IIndicator {
  code: string;
  label: string;
  originalLabel: string;
  averageValue: number;
}

export type Nullable<T> = T | null;

export type ICountryScores = { [indicator: string]: number | null};

export interface ICountryDataEntry {
  name: string;
  code: string;
  scores: ICountryScores
}

export interface IGeoJsonDataFeature {
  type: string;
  properties: {
    name: string;
    code: string;
    cartodb_id: string;
    score: number | null;
  },
  geometry: any;
}
export interface IGeoJsonData {
  type: 'string',
  features: IGeoJsonDataFeature[];
}

export interface IColorScale {
  equalOrHigherThan?: number;
  lessThan?: number;
  max?: number;
  color: string;
  label: string;
}
