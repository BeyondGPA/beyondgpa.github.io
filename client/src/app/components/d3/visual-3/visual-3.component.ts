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

  constructor(private dataService: DataService) { }

  async ngAfterViewInit(): Promise<void> {
    const data = await this.dataService.loadCareerData();
    this.data = data;
    this.fieldsOfStudy = [...new Set(data.map(d => d.Field_of_Study))];
    this.selectedField = this.fieldsOfStudy[0];
    this.renderChart(data);
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
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
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
      .call(d3.axisBottom(x).ticks(10))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Networking score');

    svg.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Completed projects');

    const tooltip = d3.select(element)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('padding', '6px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('display', 'none');

    svg.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', d => x(+d.Networking_Score))
      .attr('cy', d => y(+d.Projects_Completed))
      .attr('r', 5)
      .attr('fill', d => color(+d.Job_Offers))
      .on('mouseover', function (event, d) {
        tooltip
          .style('display', 'block')
          .html(
            `Étudiant : ${d.Student_ID}<br/>
             GPA : ${d.University_GPA}<br/>
             Réseautage : ${d.Networking_Score}<br/>
             Projets : ${d.Projects_Completed}<br/>
             Offres : ${d.Job_Offers}`
          );
        d3.select(this).attr('stroke', 'black').attr('stroke-width', 1.5);
      })
      .on('mousemove', event => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('display', 'none');
        d3.select(this).attr('stroke', 'none');
      });

    // Légende couleur
    const legendX = width + 20;

    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'color-gradient')
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
      .style('fill', 'url(#color-gradient)');

    svg.append('text')
      .attr('x', legendX + 7.5)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text("Job offers");

    const legendScale = d3.scaleLinear()
      .domain([d3.max(filteredData, d => +d.Job_Offers)!, 0])
      .range([0, height]);

    svg.append('g')
      .attr('transform', `translate(${legendX + 15},0)`)
      .call(d3.axisRight(legendScale));
  }
}
