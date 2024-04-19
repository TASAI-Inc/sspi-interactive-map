import indicatorsJson from '../output/indicators.json';
import { Nullable } from './models/models.ts';

export interface IIndicatorOptions {
  changeCallback: () => void
}

export class IndicatorFilter {
  private readonly HTML_ELEMENT_ID: string = 'js-indicator-filter';
  private element: Nullable<HTMLInputElement>;
  public selectedIndicator: string;

  constructor (options: IIndicatorOptions) {
    this.element = this.getElement();

    if (this.element) {
      this.fillOptions();
      this.setDefaultIndicator();
      this.setChangeCallback(options.changeCallback);
    }
  }

  private getElement (): Nullable<HTMLInputElement> {
    return document.querySelector(`#${this.HTML_ELEMENT_ID}`);
  }

  private fillOptions (): void {
    indicatorsJson.forEach(indicator => {
      const option: HTMLOptionElement = document.createElement('option');
      option.setAttribute('value', indicator.code);
      option.innerHTML = indicator.label;
      // @ts-ignore
      this.element.append(option)
    })
  }

  private setDefaultIndicator (): void {
    this.setSelectedIndicator(indicatorsJson[0].code);
  }

  private setSelectedIndicator (indicator: string): void {
    if (indicator) {
      this.selectedIndicator = indicator;
    }
  }

  private setChangeCallback (callbackFn: () => void): void {
    // @ts-ignore
    this.element.addEventListener('change', event => {
      if (callbackFn) {
        this.setSelectedIndicator(this.element?.value ?? '');
        // @ts-ignore
        callbackFn();
      }
    })
  }
}
