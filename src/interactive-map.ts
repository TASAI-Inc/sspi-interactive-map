import * as d3 from 'd3';
import { IndicatorFilter } from './indicator-filter.ts';
import { IColorScale, ICountryDataEntry, IGeoJsonDataFeature, Nullable } from './models/models.ts';
import { buildScale, COLOR_SCALES, MAP_COLORS } from './scale.ts';

export class InteractiveMap {
  private svg;
  private geoGenerator: any
  private indicatorFilter: IndicatorFilter;
  private geoJsonData: any;
  private countriesScores: ICountryDataEntry[] = [];

  private readonly SVG_WIDTH: number = 700;
  private readonly SVG_HEIGHT: number = 700;
  private tooltip: any;

  constructor (svgElement: HTMLElement) {
    this.svg = d3.select(svgElement);
    this.indicatorFilter = new IndicatorFilter({
      changeCallback: () => {
        this.onChangeIndicator()
      }
    });
  }

  public async init (): Promise<void> {
    this.geoJsonData = await this.loadGeoJson();
    this.countriesScores = await this.loadCountriesScore();
    buildScale();
    this.setCurrentCountriesIndicators();
    this.generateMap();
    this.createTooltip();
  }

  setCurrentCountriesIndicators (): void {
    this.geoJsonData.features = this.geoJsonData.features.map((feature: IGeoJsonDataFeature) => {
      const matchingCountry: ICountryDataEntry | undefined = this.countriesScores.find(country => country.code === feature.properties.code);
      const newValue: number | null = matchingCountry?.scores[this.getSelectedIndicator()] ?? null;
      feature.properties.score = newValue;
      return feature;
    });
  }

  private onChangeIndicator (): void {
    this.setCurrentCountriesIndicators();
    this.svg
      .select('g')
      .selectAll('g')
      .select('path')
      .transition()
      .duration(400)
      .style('fill', (d: any) => {
        return this.getScaleColorFromValue(d.properties.score);
      })
  }

  private async loadGeoJson (): Promise<any> {
    return d3.json('output/africaWithScore.geojson');
  }

  private async loadCountriesScore (): Promise<any> {
    return d3.json('output/countries-data.json');
  }

  private getScaleColorFromValue (countryValue: Nullable<number>): string {
    if (countryValue == null) {
      return MAP_COLORS.NO_RESPONSE;
    }

    const scale: IColorScale | undefined = COLOR_SCALES.find(scale => {
      // @ts-ignore
      return countryValue >= scale.equalOrHigherThan && (('lessThan' in scale && countryValue < scale.lessThan) || ('max' in scale && countryValue <= scale.max));
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
      .attr('fill', (d: any) => {
        return this.getScaleColorFromValue(d.properties.score);
      })
      .attr('d', this.geoGenerator)
      .style('stroke', '#000')
      .on('mouseover', (e, d) => {
        this.handleMouseOver(e, d);
      })
      .on('mousemove', (e) => {
        this.handleMouseMove(e);
      })
      .on('mouseout', () => {
        this.handleMouseOut();
      })
  }

  createTooltip (): void {
    this.tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', '#fff')
      .style('color', 'black')
      .style('z-index', '10')
      .style('border', 'solid')
      .style('border-color', '#000')
      .style('border-width', '0px')
      .style('padding', '10px')
      .style('box-shadow', '0px 0px 4px #000')
      .attr('id', 'tooltip');
  }

  handleMouseOver (event: any, d: any) {
    d3.select(event.currentTarget).attr('stroke', 'black');
    this.tooltip
      .style('visibility', 'visible')
      // .style('top', (event.pageY) - 40 + 'px').style('left', (event.pageX) + 10 + 'px')
      .html(`
          <h4 class="t-c-tooltip__label">${d.properties.name}</h4>
          <span class="t-c-tooltip__score">${d.properties.score != null ? d.properties.score.toFixed(1) : 'MD'}</span>`);
  };

  handleMouseMove (event: any): void {
    let x_hover = 0;
    let y_hover = 0;

    let tooltipWidth = parseInt(this.tooltip.style('width'));
    let tooltipHeight = parseInt(this.tooltip.style('height'));
    let classed, notClassed;

    if (event.pageX > document.body.clientWidth / 2) {
      x_hover = tooltipWidth + 30;
      classed = 'right';
      notClassed = 'left';
    } else {
      x_hover = -30;
      classed = 'left';
      notClassed = 'right';
    }

    y_hover = (document.body.clientHeight - event.pageY < (tooltipHeight + 4)) ? event.pageY - (tooltipHeight + 4) : event.pageY - tooltipHeight / 2;

    return this.tooltip
      .classed(classed, true)
      .classed(notClassed, false)
      .style('visibility', 'visible')
      .style('top', y_hover + 'px')
      .style('left', (event.pageX - x_hover) + 'px');
  }

  handleMouseOut (/*event: any, d: any*/) {
    // d3.select(this).attr('stroke', 'none');
    this.tooltip.style('visibility', 'hidden');
  };

  private getSelectedIndicator (): string {
    return this.indicatorFilter.selectedIndicator;
  }
}
