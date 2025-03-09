import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-scatter-viz',
  templateUrl: './scatter-viz.component.html',
  styleUrls: ['./scatter-viz.component.scss']
})
export class ScatterVizComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;
  @ViewChild('details') detailsContainer!: ElementRef;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    // Load data using the data service
    const data = await this.dataService.loadCareerData();
    this.renderChart(data);
  }

  renderChart(data: any[]): void {
    // Map CSV data to a dataset using High_School_GPA and Starting_Salary
    const dataset = data.map(d => ({
      hsGpa: +d.High_School_GPA,
      startingSalary: +d.Starting_Salary
    }));

    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create scales based on the data extent
    const xMin = d3.min(dataset, d => d.hsGpa) || 0;
    const xMax = d3.max(dataset, d => d.hsGpa) || 4;
    const yMin = d3.min(dataset, d => d.startingSalary) || 0;
    const yMax = d3.max(dataset, d => d.startingSalary) || 100000;

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice();

    // Draw X and Y axes
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('High School GPA');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .text('Starting Salary');

    // Add tooltip
    const tooltip = d3.select(element)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('display', 'none');

    // Plot the data points as circles
    const circles = svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.hsGpa))
      .attr('cy', d => yScale(d.startingSalary))
      .attr('r', 4)
      .attr('fill', 'teal')
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .html(`GPA: ${d.hsGpa}<br>Salary: $${d.startingSalary}`);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      })
      .on('click', (event, d) => {
        this.showDetails(d);
      });

    // Add brushing functionality
    const brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on('brush end', (event) => {
        const selection = event.selection;
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;
          circles.classed('selected', d => 
            x0 <= xScale(d.hsGpa) && xScale(d.hsGpa) <= x1 &&
            y0 <= yScale(d.startingSalary) && yScale(d.startingSalary) <= y1
          );
        }
      });

    svg.append('g')
      .call(brush);

    // Add zoom and pan functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .translateExtent([[-100, -100], [width + 100, height + 100]])
      .on('zoom', (event) => {
        svg.attr('transform', event.transform);
      });

    d3.select(element).select<SVGSVGElement>('svg').call(zoom);
  }

  showDetails(data: any): void {
    const details = this.detailsContainer.nativeElement;
    d3.select(details).html(`
      <h3>Details</h3>
      <p>GPA: ${data.hsGpa}</p>
      <p>Starting Salary: $${data.startingSalary}</p>
    `);
  }
}