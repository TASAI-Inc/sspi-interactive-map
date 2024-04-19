export interface IIndicator {
  code: string;
  label: string;
  originalLabel: string;
  averageValue: number;
}

export type Nullable<T> = T | null;
