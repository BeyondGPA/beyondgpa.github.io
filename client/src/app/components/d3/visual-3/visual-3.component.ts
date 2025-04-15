import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-visual-3',
  templateUrl: './visual-3.component.html',
  styleUrls: ['./visual-3.component.scss'],
  imports: [CommonModule]
})
export class Visual3Component implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;
  data: any[] = [];
  fieldsOfStudy: string[] = [];
  selectedField = '';
  private hasRendered = false;

  constructor(private dataService: DataService) {}

  async ngAfterViewInit(): Promise<void> {
    const observer = new IntersectionObserver(async entries => {
      const entry = entries[0];
      if (entry.isIntersecting && !this.hasRendered) {
        this.hasRendered = true;
        this.data = await this.dataService.loadCareerData();
        this.fieldsOfStudy = [...new Set(this.data.map(d => d.Field_of_Study))];
        this.selectedField = this.fieldsOfStudy[0];
        this.renderChart(this.data);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(this.chartContainer.nativeElement);
  }

  onFieldChange(event: Event): void {
    this.selectedField = (event.target as HTMLSelectElement).value;
    this.renderChart(this.data);
  }

  renderChart(data: any[]): void {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const filteredData = data.filter(d => d.Field_of_Study === this.selectedField);
    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr("viewBox", `0 0 ${width + 120} ${height + 100}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("width", width)
      .attr("height", height)
      .style('display', 'block')
      .style('max-width', '100%')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 10])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => +d.Projects_Completed)! + 1])
      .range([height, 0]);

    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(filteredData, d => +d.Job_Offers)!]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip-v3')
      .style('display', 'none')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.75)')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-size', '13px')
      .style('opacity', 0);

    svg.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', d => x(+d.Networking_Score))
      .attr('cy', d => y(+d.Projects_Completed))
      .attr('r', 0)
      .attr('fill', d => color(+d.Job_Offers))
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        tooltip
          .style('display', 'block')
          .style('opacity', 1)
          .html(`
            <strong>ID:</strong> ${d.Student_ID}<br/>
            GPA: ${d.University_GPA}<br/>
            Networking: ${d.Networking_Score}<br/>
            Projects: ${d.Projects_Completed}<br/>
            Offers: ${d.Job_Offers}
          `);
        d3.select(this).attr('stroke', '#333').attr('stroke-width', 1.5);
      })
      .on('mousemove', event => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseleave', function () {
        tooltip.style('opacity', 0).style('display', 'none');
        d3.select(this).attr('stroke', 'none');
      })
      .transition()
      .duration(600)
      .attr('r', 6);

    // X label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .text('Networking Score');

    // Y label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .text('Completed Projects');

    // Color legend
    const legendX = width + 20;
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'color-gradient-v3')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    for (let i = 0; i <= 10; i++) {
      gradient.append('stop')
        .attr('offset', `${i * 10}%`)
        .attr('stop-color', color(i));
    }

    svg.append('rect')
      .attr('x', legendX)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', height)
      .style('fill', 'url(#color-gradient-v3)');

    const legendScale = d3.scaleLinear()
      .domain([d3.max(filteredData, d => +d.Job_Offers)!, 0])
      .range([0, height]);

    svg.append('g')
      .attr('transform', `translate(${legendX + 15},0)`)
      .call(d3.axisRight(legendScale));

    svg.append('text')
      .attr('x', legendX + 7.5)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text("Job offers");
  }
}
