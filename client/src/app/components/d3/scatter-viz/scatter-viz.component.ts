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
    const width = 800 - margin.left - margin.right;
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

    // Plot the data points as circles
    svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.hsGpa))
      .attr('cy', d => yScale(d.startingSalary))
      .attr('r', 4)
      .attr('fill', 'teal');
  }
}
