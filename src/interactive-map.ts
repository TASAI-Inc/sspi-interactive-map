import * as d3 from 'd3';
import { IndicatorFilter } from './indicator-filter.ts';
import { IColorScale, ICountryDataEntry, IGeoJsonDataFeature } from './models/models.ts';
import { buildScale, COLOR_SCALES, MAP_COLORS } from './scale.ts';

export class InteractiveMap {
  private svg;
  private geoGenerator: any
  private indicatorFilter: IndicatorFilter;
  private geoJsonData: any;

  private readonly SVG_WIDTH: number = 700;
  private readonly SVG_HEIGHT: number = 700;

  constructor (svgElement: HTMLElement) {
    this.svg = d3.select(svgElement);
    this.indicatorFilter = new IndicatorFilter({
      changeCallback: this.onChangeIndicator
    });
  }

  public async init (): Promise<void> {
    this.geoJsonData = await this.loadGeoJson();
    buildScale();
    this.generateMap();
  }

  private onChangeIndicator (): void {

  }

  private async loadGeoJson (): Promise<any> {
    return d3.json('output/africaWithScore.geojson');
  }

  private getScaleColorFromValue (countryEntry: IGeoJsonDataFeature): string {
    const countryValue: number | null | undefined = countryEntry.properties.scores?.[this.getSelectedIndicator()];
    if (!countryValue) {
      return MAP_COLORS.NO_RESPONSE;
    }

    const scale: IColorScale | undefined = COLOR_SCALES.find(scale => {
      // @ts-ignore
      return countryValue > scale.equalOrHigherThan && (('lessThan' in scale && countryValue < scale.lessThan) || ('max' in scale && countryValue <= scale.max));
    });

    return scale ? scale.color : MAP_COLORS.NO_RESPONSE;
  }

  private generateMap (): void {
    let projection: d3.GeoProjection = d3
      .geoMercator()
      .fitExtent([[0, 0], [this.SVG_WIDTH, this.SVG_HEIGHT]], this.geoJsonData);
    this.geoGenerator = d3.geoPath().projection(projection);

    this.svg
      .append('g')
      .selectAll('path')
      .data(this.geoJsonData.features)
      .enter()
      .append('g')
      .attr('class', function (d: any) {
        return d.properties.name;
      })
      .append('path')
      .attr('fill', (d) => {
        return this.getScaleColorFromValue(d);
      })
      .attr('d', this.geoGenerator)
      .style('stroke', '#fff')
      .on('mouseover', (e, d) => {
        this.handleMouseOver(e, d);
      })
      .on('mouseout', function (d: any, i: any) {
        // d3.select(this).transition().duration(300).attr('fill', '#69b3a2');
        d3.selectAll('text')
          .transition()
          .delay(function (d: any, i: number): number {
            return 100;
          })
          .text('');
      });
  }

  handleMouseOver (e: any, d: any): void {
    let centroid = this.geoGenerator.centroid(d);

    this.svg
      .append('text')
      .text(d.properties.name)
      .style('font-size', 30)
      .style('font-weight', 'bold')
      .style('display', 'inline')
      .attr('transform', 'translate(' + centroid + ')')
      .style('fill', 'black')
      .transition()
      .delay(function (d: any, i: number): number {
        return 100;
      });

    d3.select(this).transition().duration(300).attr('fill', 'yellow');
  }

  private getSelectedIndicator (): string {
    return this.indicatorFilter.selectedIndicator;
  }
}
