import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-sankey-viz',
  templateUrl: './sankey-viz.component.html',
  styleUrls: ['./sankey-viz.component.scss']
})
export class SankeyVizComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    // Load the CSV data using the data service
    const data = await this.dataService.loadCareerData();
    this.renderChart(data);
  }

  renderChart(data: any[]): void {
    // Group data by Field_of_Study and sum up Starting_Salary
    const grouped = d3.group(data, d => d.Field_of_Study);
    let totalSalary = 0;
    const flows: { field: string, sumSalary: number }[] = [];
    grouped.forEach((values, field) => {
      const sumSalary = d3.sum(values, d => +d.Starting_Salary);
      totalSalary += sumSalary;
      flows.push({ field, sumSalary });
    });

    // Set up SVG dimensions and margins
    const element = this.chartContainer.nativeElement;
    const width = 600;
    const height = 400;
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const leftX = 50;
    const rightX = 450;
    const availableHeight = 300;
    const topMargin = 50;

    let leftOffset = topMargin;
    let rightOffset = topMargin;

    flows.forEach(flow => {
      const rectHeight = (flow.sumSalary / totalSalary) * availableHeight;
      // Draw left rectangle for the field
      svg.append('rect')
         .attr('x', leftX)
         .attr('y', leftOffset)
         .attr('width', 50)
         .attr('height', rectHeight)
         .attr('fill', 'steelblue');

      // Draw corresponding rectangle on the right side
      svg.append('rect')
         .attr('x', rightX)
         .attr('y', rightOffset)
         .attr('width', 50)
         .attr('height', rectHeight)
         .attr('fill', 'orange');

      // Draw a curved path connecting the two rectangles
      const leftYMid = leftOffset + rectHeight / 2;
      const rightYMid = rightOffset + rectHeight / 2;
      svg.append('path')
         .attr('d', `M${leftX + 50},${leftYMid} C${(leftX + 50 + rightX) / 2},${leftYMid} ${(leftX + 50 + rightX) / 2},${rightYMid} ${rightX},${rightYMid}`)
         .attr('stroke', '#999')
         .attr('stroke-width', Math.max(1, rectHeight / 10))
         .attr('fill', 'none');

      // Add field labels to the left side
      svg.append('text')
         .attr('x', leftX - 10)
         .attr('y', leftYMid)
         .attr('text-anchor', 'end')
         .attr('alignment-baseline', 'middle')
         .text(flow.field);

      leftOffset += rectHeight;
      rightOffset += rectHeight;
    });
  }
}
