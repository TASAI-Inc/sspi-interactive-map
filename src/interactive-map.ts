import * as d3 from 'd3';
import { IndicatorFilter } from './indicator-filter.ts';

export class InteractiveMap {
  private svg;
  private geoGenerator: any
  private indicatorFilter: IndicatorFilter;
  private geoJsonData: any;

  private readonly SVG_WIDTH: number = 600;
  private readonly SVG_HEIGHT: number = 800;
  private readonly MAP_COLORS: { [key: string]: string } = {
    NO_RESPONSE: '#D1D3D4',
    EXTREMELY_POOR: '#FF0000',
    POOR: '#FFA700',
    FAIR: '#FFF400',
    GOOD: '#A3FF00',
    EXCELLENT: '#2CBA00'
  };

  constructor (svgElement: HTMLElement) {
    this.svg = d3.select(svgElement);
    this.indicatorFilter = new IndicatorFilter({
      changeCallback: this.onChangeIndicator
    });
  }

  public async init (): Promise<void> {
    this.geoJsonData = await this.loadGeoJson();
    this.generateMap();
  }

  private onChangeIndicator (): void {

  }

  private async loadGeoJson (): Promise<any> {
    return d3.json('scripts/data/africa.geojson');
  }

  private getScaleColorFromValue (countryEntry: any): string {
    console.log('entry',countryEntry)
    return '';
  }

  private generateMap (): void {
    let projection: d3.GeoProjection = d3
      .geoMercator()
      .fitExtent([[0, 0], [this.SVG_WIDTH, this.SVG_HEIGHT]], this.geoJsonData);
    this.geoGenerator = d3.geoPath().projection(projection);

    this.indicator = this.getSelectedIndicator();

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
      .attr('fill', this.getScaleColorFromValue)
      .attr('d', this.geoGenerator)
      .style('stroke', '#fff')
      .on('mouseover', (e, d) => {
        this.handleMouseOver(e, d);
      })
      .on('mouseout', function (d: any, i: any) {
        d3.select(this).transition().duration(300).attr('fill', '#69b3a2');
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
