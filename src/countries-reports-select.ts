import { ICountryDataEntry, Nullable } from './models/models.ts';
import * as d3 from 'd3';

export class CountriesReportsSelect {
  private selectbox: Nullable<HTMLInputElement>;
  private readonly ASSETS_DIR: string = './assets/map/data';

  constructor (elementId: string) {
    this.selectbox = this.getElement(elementId);
  }

  private getElement (elementId: string): Nullable<HTMLInputElement> {
    return document.querySelector(`#${elementId}`);
  }

  public async init (): Promise<void> {
    const countriesScores: ICountryDataEntry[] = await this.loadCountriesScore();

    if (this.selectbox) {
      this.fillOptions(countriesScores);
      this.setChangeCallback();
    }
  }

  private async loadCountriesScore (): Promise<any> {
    return d3.json(`${this.ASSETS_DIR}/countries-data.json`);
  }

  private fillOptions (countries: ICountryDataEntry[]): void {
    this.addOptionToSelectbox('', 'Select a country');

    countries.forEach(country => {
      this.addOptionToSelectbox(country.code, country.name);
    })
  }

  private addOptionToSelectbox (code: string, label: string): void {
    const option: HTMLOptionElement = document.createElement('option');
    option.setAttribute('value', code);
    option.innerHTML = label;
    // @ts-ignore
    this.selectbox.append(option)
  }

  private setChangeCallback (): void {
    // @ts-ignore
    this.selectbox.addEventListener('change', event => {
      this.openCountryPdf(this.selectbox?.value ?? '');
    })
  }

  private openCountryPdf (countryCode: string): void {
    window.open(`https://wp.tasai.org/wp-content/uploads/CB_${countryCode}.pdf`, '_blank');
  }
}
