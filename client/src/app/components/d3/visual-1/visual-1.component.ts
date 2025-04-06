import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';

interface BoxPlotStatistics {
  jobLevel: string;
  q1: number;
  median: number;
  q3: number;
  min: number;
  max: number;
  outliers: number[];
  values: number[];
}

@Component({
  standalone: true,
  selector: 'app-visual-1',
  templateUrl: './visual-1.component.html',
  styleUrls: ['./visual-1.component.scss']
})
export class Visual1Component implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;

  constructor(private dataService: DataService) {}
  
  ngAfterViewInit(): void {
    this.dataService.loadCareerData().then(data => {
      const processedData = this.processData(data);
      this.renderChart(data, processedData);
    });
  }

  processData(data: any[]): BoxPlotStatistics[] {
    // Group the data by job level
    const groupedData : Record<string, number[]> = {};
    data.forEach(item => {
      const jobLevel = item.Current_Job_Level;
      const gpa = item.University_GPA;
      
      if (!groupedData[jobLevel]) {
        groupedData[jobLevel] = [];
      }
      groupedData[jobLevel].push(gpa);
    });

    // Convert to the format needed for the box plot
    const processedData = Object.keys(groupedData).map(jobLevel => ({
      jobLevel: jobLevel,
      values: groupedData[jobLevel]
    }));

    // Sort the job levels
    processedData.sort((a, b) => b.values.length - a.values.length);

    processedData.forEach(d => {
      d.values = d.values.map(v => +v); // Convert GPA values to numbers
      d.values.sort(d3.ascending); // Sort the values for each job level
    });

    return processedData.map(d => {
      const q1 = d3.quantile(d.values, 0.25) as number;
      const median = d3.quantile(d.values, 0.5) as number;
      const q3 = d3.quantile(d.values, 0.75) as number;
      const iqr = q3 - q1;
      const min = Math.max(d.values[0], q1 - 1.5 * iqr);
      const max = Math.min(d.values[d.values.length - 1], q3 + 1.5 * iqr);
      
      const outliers = d.values.filter(v => v < min || v > max);
      
      return {
          jobLevel: d.jobLevel,
          q1,
          median,
          q3,
          min,
          max,
          outliers,
          values: d.values
      };
    });
  }

  renderChart(data: any[], boxPlotData: BoxPlotStatistics[]): void {
    // Set up dimensions
    const margin = {top: 50, right: 30, bottom: 50, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg.append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", -20)
      .text("University GPA Distribution by Job Level");

    // X scale - job levels
    const jobLevels = boxPlotData.map(d => d.jobLevel);
    const xScale = d3.scaleBand()
      .domain(jobLevels)
      .range([0, width])
      .padding(0.2);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(jobLevels)
      .range([
        "#FFEEEE",  // Very light red (Entry)
        "#FFAAAA",  // Light coral (Mid)
        "#FF6B6B",  // Medium coral (Senior)
        "#E31937"   // Rich crimson (Executive)
      ]);

    // Y scale - GPA
    const maxGPA = d3.max(data, d => +d.University_GPA) as number;
    const yScale = d3.scaleLinear()
      .domain([0, maxGPA])
      .range([height, 0])
      .nice();

    // Draw boxes
    svg.selectAll(".box")
      .data(boxPlotData)
      .enter()
      .append("rect")
      .attr("class", "box")
      .attr("x", d => xScale(d.jobLevel) ?? 0)
      .attr("y", d => yScale(d.q3))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(d.q1) - yScale(d.q3))
      .attr("rx", 2)
      .attr("ry", 2)
      .attr('fill', d => colorScale(d.jobLevel))

    // Draw median lines
    svg.selectAll(".median")
        .data(boxPlotData)
        .enter()
        .append("line")
        .attr("class", "median")
        .attr("x1", d => xScale(d.jobLevel) ?? 0)
        .attr("x2", d => (xScale(d.jobLevel) ?? 0) + xScale.bandwidth())
        .attr("y1", d => yScale(d.median))
        .attr("y2", d => yScale(d.median))

    // Draw whiskers
    svg.selectAll(".whisker")
        .data(boxPlotData)
        .enter()
        .each(function(d) {
            const centerX = (xScale(d.jobLevel) ?? 0) + xScale.bandwidth() / 2;
            
            // Bottom whisker
            d3.select(this)
                .append("line")
                .attr("class", "whisker")
                .attr("x1", centerX)
                .attr("x2", centerX)
                .attr("y1", yScale(d.max))
                .attr("y2", yScale(d.q3))
            
            // Top whisker
            d3.select(this)
                .append("line")
                .attr("class", "whisker")
                .attr("x1", centerX)
                .attr("x2", centerX)
                .attr("y1", yScale(d.q1))
                .attr("y2", yScale(d.min))
            
            // Bottom cap
            d3.select(this)
                .append("line")
                .attr("class", "whisker")
                .attr("x1", centerX - 5)
                .attr("x2", centerX + 5)
                .attr("y1", yScale(d.max))
                .attr("y2", yScale(d.max))
            
            // Top cap
            d3.select(this)
                .append("line")
                .attr("class", "whisker")
                .attr("x1", centerX - 5)
                .attr("x2", centerX + 5)
                .attr("y1", yScale(d.min))
                .attr("y2", yScale(d.min))
        });

    // Draw outliers
    // svg.selectAll(".outlier")
    //     .data(boxPlotData.flatMap(d => 
    //         d.outliers.map(v => ({ jobLevel: d.jobLevel, value: v }))
    //     ))
    //     .enter()
    //     .append("circle")
    //     .attr("class", "outlier")
    //     .attr("cx", d => (xScale(d.jobLevel) || 0) + xScale.bandwidth() / 2)
    //     .attr("cy", d => yScale(d.value))
    //     .attr("r", 3);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", 35)
        .text("Current Job Level");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .text("University GPA");
    }
}
