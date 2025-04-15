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
  selectedX: string = 'University_GPA';
  data: any[] = [];
  fieldOptions: string[] = [];
  currentIndex = 0;
  chartsPerPage = 2;

  globalMinX: number = Infinity;
  globalMaxX: number = -Infinity;
  globalMinY: number = Infinity;
  globalMaxY: number = -Infinity;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.loadCareerData().then(data => {
      this.data = data;
      this.fieldOptions = Array.from(new Set(data.map(d => d.Field_of_Study)));
      this.calculateGlobalMinMax();
      this.renderCharts();
    });
  }

  calculateGlobalMinMax(): void {
    this.globalMinX = d3.min(this.data, d => +d[this.selectedX]) as number;
    this.globalMaxX = d3.max(this.data, d => +d[this.selectedX]) as number;
    this.globalMinY = d3.min(this.data, d => +d['Starting_Salary']) as number;
    this.globalMaxY = d3.max(this.data, d => +d['Starting_Salary']) as number;
  }

  renderCharts(): void {
    const container = d3.select(this.chartContainer.nativeElement);
    container.selectAll('svg').remove();

    const fieldsToShow = this.fieldOptions.slice(this.currentIndex, this.currentIndex + this.chartsPerPage);

    fieldsToShow.forEach(field => {
      const filteredData = this.data.filter(d => d.Field_of_Study === field);
      this.renderChartForField(filteredData, field);
    });
  }

  renderChartForField(filteredData: any[], field: string): void {
    const width = 600;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    const x = d3.scaleLinear()
      .domain([this.globalMinX, this.globalMaxX])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([this.globalMinY, this.globalMaxY])
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
      .attr("cy", d => y(+d['Starting_Salary']))
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

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 10)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .text(`${field}`);
  }

  updateChart(): void {
    this.calculateGlobalMinMax();
    this.renderCharts();
  }

  nextCharts(): void {
    if (this.currentIndex + this.chartsPerPage < this.fieldOptions.length) {
      this.currentIndex += this.chartsPerPage;
      this.renderCharts();
    }
  }

  previousCharts(): void {
    if (this.currentIndex - this.chartsPerPage >= 0) {
      this.currentIndex -= this.chartsPerPage;
      this.renderCharts();
    }
  }
}
