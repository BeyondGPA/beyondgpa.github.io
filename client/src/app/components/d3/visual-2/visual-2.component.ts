import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-visual-2',
  templateUrl: './visual-2.component.html',
  imports: [FormsModule],
  styleUrls: ['./visual-2.component.scss']
})
export class Visual2Component implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;
  selectedX: string = 'University_GPA'; // X-axis variable
  data: any[] = [];
  fieldOptions: string[] = [];

  // Global min/max values for x and y axes, will be recalculated based on selected variable
  globalMinX: number = Infinity;
  globalMaxX: number = -Infinity;
  globalMinY: number = Infinity;
  globalMaxY: number = -Infinity;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.loadCareerData().then(data => {
      this.data = data;
      this.fieldOptions = Array.from(new Set(data.map(d => d.Field_of_Study))); // Get unique Field_of_Study values
      this.calculateGlobalMinMax(); // Initial global min/max values for both axes
      this.renderCharts();
    });
  }

  // Calculate global min/max for both x and y axes based on the selected variables
  calculateGlobalMinMax(): void {
    // Calculate for selected X
    this.globalMinX = d3.min(this.data, d => +d[this.selectedX]) as number;
    this.globalMaxX = d3.max(this.data, d => +d[this.selectedX]) as number;

    // Calculate for Y (always Starting_Salary)
    this.globalMinY = d3.min(this.data, d => +d['Starting_Salary']) as number;
    this.globalMaxY = d3.max(this.data, d => +d['Starting_Salary']) as number;
  }

  renderCharts(): void {
    if (!this.data.length) return;

    // Clear the existing charts before rendering new ones
    d3.select(this.chartContainer.nativeElement).selectAll("svg").remove();

    // Loop through all field options and render charts
    this.fieldOptions.forEach(field => {
      const filteredData = this.data.filter(d => d.Field_of_Study === field);
      this.renderChartForField(filteredData, field);
    });
  }

  renderChartForField(filteredData: any[], field: string): void {
    const width = 600;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    // Set up x-axis scale (dynamic based on selected X variable)
    const x = d3.scaleLinear()
      .domain([this.globalMinX, this.globalMaxX]) // Use the global min/max for x-axis
      .range([margin.left, width - margin.right]);

    // Y-axis scale is always the same: Starting_Salary
    const y = d3.scaleLinear()
      .domain([this.globalMinY, this.globalMaxY]) // Use the global min/max for y-axis (always salary)
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text(this.selectedX.replace(/_/g, ' '));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text('Starting Salary');

    svg.append("g")
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("cx", d => x(+d[this.selectedX]))
      .attr("cy", d => y(+d['Starting_Salary'])) // Always use 'Starting_Salary' for Y
      .attr("r", 5)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .on("mouseover", function (_event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 8)
          .attr("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 5)
          .attr("fill", "steelblue");
      });

    // Add a label for the Field of Study
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 10)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .text(`${field}`);
  }

  updateChart(): void {
    // Recalculate the global min/max based on the selected X variable
    this.calculateGlobalMinMax();
    this.renderCharts();
  }
}
