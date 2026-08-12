import { IColorScale } from './models/models.ts';

const ELEMENT_ID: string = 'js-scale-container';

export const MAP_COLORS: { [key: string]: string } = {
  NO_RESPONSE: '#D1D3D4',
  EXTREMELY_POOR: '#FF0000',
  POOR: '#FFA700',
  FAIR: '#FFF400',
  GOOD: '#A3FF00',
  EXCELLENT: '#2CBA00'
};

export const COLOR_SCALES: IColorScale[] = [
  {equalOrHigherThan: 0, lessThan: 2, color: MAP_COLORS.EXTREMELY_POOR, label: 'Extremely Poor'},
  {equalOrHigherThan: 2, lessThan: 4, color: MAP_COLORS.POOR, label: 'Poor'},
  {equalOrHigherThan: 4, lessThan: 6, color: MAP_COLORS.FAIR, label: 'Fair'},
  {equalOrHigherThan: 6, lessThan: 8, color: MAP_COLORS.GOOD, label: 'Good'},
  {equalOrHigherThan: 8, max: 10, color: MAP_COLORS.EXCELLENT, label: 'Excellent'},
  {color: MAP_COLORS.NO_RESPONSE, label: 'No Response'}
];

export function buildScale (): void {
  const container = document.querySelector(`#${ELEMENT_ID}`);

  COLOR_SCALES.forEach(colorScaleEntry => {
    const colorScaleEntryElement = document.createElement('div');
    colorScaleEntryElement.setAttribute('class', 't-c-scale');

    const colorElement = document.createElement('div');
    colorElement.setAttribute('class', 't-c-scale-color');

    if (typeof colorScaleEntry.equalOrHigherThan !== 'undefined')  {
      const minValue: string = `${colorScaleEntry.equalOrHigherThan}`;
      const maxValue: string = colorScaleEntry.lessThan ? `<${colorScaleEntry.lessThan}` : `${colorScaleEntry.max}`;
      colorElement.innerText = `${minValue} to ${maxValue}`;
    }
    colorElement.style.backgroundColor = colorScaleEntry.color;

    const labelElement = document.createElement('span');
    labelElement.setAttribute('class', 't-c-scale-label');
    labelElement.innerText = colorScaleEntry.label;

    colorScaleEntryElement.append(colorElement, labelElement);
    // @ts-ignore
    container.append(colorScaleEntryElement);
  });
}
