import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { FormsModule } from '@angular/forms';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-visual-3',
  templateUrl: './visual-3.component.html',
  imports: [FormsModule],
  styleUrls: ['./visual-3.component.scss']
})
export class Visual3Component implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;

  leftVariable: string = 'High_School_GPA';  // Default left variable
  rightVariable: string = 'Years_to_Promotion';  // Default right variable

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    const data = await this.dataService.loadCareerData();
    console.log("Loaded Data:", data);  // Debugging: See the raw data in the console
    this.renderChart(data);
  }
  renderChart(data: any[]): void {
    const leftVariable = this.leftVariable;
    const rightVariable = this.rightVariable;

    // Group the data by the selected left variable (e.g., High_School_GPA)
    const grouped = d3.group(data, d => d[leftVariable]);

    // Debugging: Check grouped data structure
    console.log("Grouped Data:", grouped);

    let total = 0;
    const flows: { leftValue: string, sumRightValue: number }[] = [];

    // Process each group and summarize the right variable
    grouped.forEach((values, leftValue) => {
      let sumRightValue = 0;

      // If the right variable is numerical (e.g., Years_to_Promotion)
      if (typeof values[0][rightVariable] === 'number') {
        sumRightValue = d3.sum(values, d => +d[rightVariable]);
      } else {
        // If it's categorical (e.g., Current_Job_Level), count occurrences
        const groupedByJobLevel = d3.rollup(values, v => v.length, d => d[rightVariable]);
        sumRightValue = groupedByJobLevel.size;
      }

      total += sumRightValue;
      flows.push({ leftValue, sumRightValue });
    });

    // Debugging: Check the summarized flow data
    console.log("Summarized Flows:", flows);

    // Set up SVG dimensions and margins
    const element = this.chartContainer.nativeElement;
    const width = 600;
    const height = 400;
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const rectWidth = 50;
    const leftX = (width / 2) - rectWidth - 50; // Center the left rectangles
    const rightX = (width / 2) + 50; // Center the right rectangles
    const availableHeight = 300;
    const topMargin = 50;

    let leftOffset = topMargin;
    let rightOffset = topMargin;

    // Iterate through the flows and draw the chart
    flows.forEach(flow => {
      const rectHeight = (flow.sumRightValue / total) * availableHeight;

      // Draw left rectangle for the left axis (e.g., GPA)
      svg.append('rect')
        .attr('x', leftX)
        .attr('y', leftOffset)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', 'steelblue');

      // Draw corresponding rectangle on the right side (e.g., Years to Promotion)
      svg.append('rect')
        .attr('x', rightX)
        .attr('y', rightOffset)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', 'orange');

      // Draw a curved path connecting the two rectangles
      const leftYMid = leftOffset + rectHeight / 2;
      const rightYMid = rightOffset + rectHeight / 2;
      svg.append('path')
        .attr('d', `M${leftX + rectWidth},${leftYMid} C${(leftX + rectWidth + rightX) / 2},${leftYMid} ${(leftX + rectWidth + rightX) / 2},${rightYMid} ${rightX},${rightYMid}`)
        .attr('stroke', '#999')
        .attr('stroke-width', Math.max(1, rectHeight / 10))
        .attr('fill', 'none');

      // Add left field labels (e.g., GPA, SAT score, etc.)
      svg.append('text')
        .attr('x', leftX - 10)
        .attr('y', leftYMid)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .text(flow.leftValue);

      // Add right field labels (sum of the right variable, e.g., Years to Promotion or count of Job Levels)
      svg.append('text')
        .attr('x', rightX + rectWidth + 10)
        .attr('y', rightYMid)
        .attr('alignment-baseline', 'middle')
        .text(flow.sumRightValue);

      leftOffset += rectHeight;
      rightOffset += rectHeight;
    });
}

}
