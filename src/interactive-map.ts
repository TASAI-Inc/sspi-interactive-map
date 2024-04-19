import * as d3 from 'd3';

export class InteractiveMap {
  private svg;
  private geoGenerator: any;

  constructor (svgElement: HTMLElement) {
    this.svg = d3.select(svgElement);
  }

  async generateMap (): Promise<void> {
    const width: number = 600;
    const height: number = 800;
    let projection;

    const data: any = await d3.json('scripts/data/africa.geojson');

    projection = d3
      .geoMercator()
      .fitExtent([[0, 0], [width, height]], data);
    this.geoGenerator = d3.geoPath().projection(projection);

    this.svg
      .append('g')
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('g')
      .attr('class', function (d: any) {
        return d.properties.name;
      })
      .append('path')
      .attr('fill', '#69b3a2')
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
}
