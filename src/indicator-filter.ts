import indicatorsJson from '../output/indicators.json';
import { Nullable } from './models/models.ts';

export class IndicatorFilter {
  private readonly HTML_ELEMENT_ID: string = 'js-indicator-filter';
  private element: Nullable<HTMLElement>;

  constructor () {
    this.element = this.getElement();

    if (this.element) {
      this.fillOptions();
      this.setChangeCallback();
    }
  }

  private getElement (): Nullable<HTMLElement> {
    return document.querySelector(`#${this.HTML_ELEMENT_ID}`);
  }

  private fillOptions (): void {
    indicatorsJson.forEach(indicator => {
      const option: HTMLElement = document.createElement('option');
      option.setAttribute('value', indicator.code);
      option.innerHTML = indicator.label;
      // @ts-ignore
      this.element.append(option)
    })
  }

  private setChangeCallback (): void {
    // @ts-ignore
    this.element.addEventListener('change', event => {
      console.log('event', event);
    })
  }
}
