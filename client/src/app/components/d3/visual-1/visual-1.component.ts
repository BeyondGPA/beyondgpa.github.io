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
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const boundedWidth = width - margin.left - margin.right;
    const boundedHeight = height - margin.top - margin.bottom;
  
    const container = d3.select(this.chartContainer.nativeElement);
    const svg = container.append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("width", width)
      .attr("height", height)
      .style('display', 'block')
      .style('max-width', '100%')
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const tooltip = d3.select("body")
      .append('div')
      .attr('class', 'tooltip-boxplot')
      .style('display', 'None')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.75)')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-size', '13px')
      .style('opacity', 0);
  
    const jobLevels = boxPlotData.map(d => d.jobLevel);
    const x = d3.scaleBand()
      .domain(jobLevels)
      .range([0, boundedWidth])
      .padding(0.3);
  
    const maxGPA = d3.max(data, d => +d.University_GPA) || 4;
    const y = d3.scaleLinear()
      .domain([0, maxGPA])
      .range([boundedHeight, 0])
      .nice();
  
    // Axes
    svg.append("g")
      .attr("transform", `translate(0, ${boundedHeight})`)
      .call(d3.axisBottom(x));
  
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Draw each box
    const boxWidth = x.bandwidth() * 0.5;
  
    const colorScale = d3.scaleOrdinal<string>()
      .domain(jobLevels)
      .range([
        "#FFEEEE",  // Entry
        "#FFAAAA",  // Mid
        "#FF6B6B",  // Senior
        "#E31937"   // Executive
      ]);

    boxPlotData.forEach((d, i) => {
      const centerX = x(d.jobLevel)! + x.bandwidth() / 2;
  
      // Vertical line (whisker)
      svg.append("line")
        .attr("class", "whisker")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", y(d.q3))
        .attr("y2", y(d.q3))
        .transition()
        .delay(i * 100)
        .duration(400)
        .attr("y1", y(d.min))
        .attr("y2", y(d.max));
  
      // Box
      const box = svg.append("rect")
        .attr("class", "box")
        .attr("fill", colorScale(d.jobLevel))
        .attr("x", centerX - boxWidth / 2)
        .attr("width", boxWidth)
        .attr("y", y(d.q3))
        .attr("height", 0)
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX + 12}px`)
            .style("top", `${event.pageY - 28}px`)
            .style("opacity", 1)
            .style("display", "block")
            .html(`
              <strong>${d.jobLevel}</strong><br>
              Q1: ${d.q1.toFixed(2)}<br>
              Median: ${d.median.toFixed(2)}<br>
              Q3: ${d.q3.toFixed(2)}<br>
              Min: ${d.min.toFixed(2)}<br>
              Max: ${d.max.toFixed(2)}
            `);
        })
        .on("mouseleave", () => {
          tooltip.style("opacity", 0);
        })
        .on("click", function () {
          d3.selectAll(".box").classed("highlighted", false);
          d3.select(this).classed("highlighted", true);
        });
  
      box.transition()
        .delay(i * 100)
        .duration(500)
        .attr("height", y(d.q1) - y(d.q3));
  
      // Median
      svg.append("line")
        .attr("class", "median-line")
        .attr("x1", centerX - boxWidth / 2)
        .attr("x2", centerX + boxWidth / 2)
        .attr("y1", y(d.median))
        .attr("y2", y(d.median))
        .style("opacity", 0)
        .transition()
        .delay(i * 100 + 400)
        .duration(300)
        .style("opacity", 1);
  
      // Min whisker cap
      svg.append("line")
        .attr("class", "whisker")
        .attr("x1", centerX - boxWidth / 4)
        .attr("x2", centerX + boxWidth / 4)
        .attr("y1", y(d.min))
        .attr("y2", y(d.min));
  
      // Max whisker cap
      svg.append("line")
        .attr("class", "whisker")
        .attr("x1", centerX - boxWidth / 4)
        .attr("x2", centerX + boxWidth / 4)
        .attr("y1", y(d.max))
        .attr("y2", y(d.max));
    });
  
    // Labels
    svg.append("text")
      .attr("x", boundedWidth / 2)
      .attr("y", boundedHeight + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .text("Current Job Level");
  
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -boundedHeight / 2)
      .attr("text-anchor", "middle")
      .text("University GPA");
  }
  
}
