import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-visual-5',
  templateUrl: './visual-5.component.html',
  styleUrls: ['./visual-5.component.scss']
})
export class Visual5Component implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;
  private hasRendered = false;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting && !this.hasRendered) {
        this.hasRendered = true;
        this.dataService.loadCareerData().then(data => {
          this.renderBoxPlot(data);
        });
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(this.chartContainer.nativeElement);
  }

  renderBoxPlot(data: any[]): void {
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const container = d3.select(this.chartContainer.nativeElement);
    const svg = container
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const cleanData = data
      .filter(d => d.University_GPA && d.Years_to_Promotion)
      .map(d => ({
        gpa: parseFloat(d.University_GPA),
        years: parseFloat(d.Years_to_Promotion)
      }));

    const grouped = d3.groups(cleanData, d => Math.round(d.gpa * 2) / 2);
    const labels = grouped.map(([g]) => g.toFixed(1));

    const summary = grouped.map(([gpa, records]) => {
      const values = records.map(d => d.years).sort(d3.ascending);
      const q1 = d3.quantile(values, 0.25)!;
      const median = d3.quantile(values, 0.5)!;
      const q3 = d3.quantile(values, 0.75)!;
      const iqr = q3 - q1;
      const rawMin = d3.min(values);
      const rawMax = d3.max(values);
      const min = Math.max(rawMin ?? q1, q1 - 1.5 * iqr);
      const max = Math.min(rawMax ?? q3, q3 + 1.5 * iqr);
      return { gpa: +gpa, q1, median, q3, min, max };
    });

    const x = d3.scaleBand()
      .domain(labels)
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(summary, d => d.max)! + 1])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip-boxplot')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.75)')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-size', '13px')
      .style('opacity', 0);

    summary.forEach((d, i) => {
      const center = x(d.gpa.toFixed(1))! + x.bandwidth() / 2;
      const boxWidth = x.bandwidth() * 0.5;

      svg.append('line')
        .attr('x1', center)
        .attr('x2', center)
        .attr('y1', y(d.min))
        .attr('y2', y(d.min))
        .attr('stroke', 'black')
        .transition().delay(i * 100).duration(400)
        .attr('y2', y(d.max));

      const box = svg.append('rect')
        .attr('x', center - boxWidth / 2)
        .attr('width', boxWidth)
        .attr('y', y(d.q3))
        .attr('height', 0)
        .attr('fill', '#69b3a2')
        .attr('cursor', 'pointer')
        .on('mousemove', (event) => {
          tooltip
            .style('left', event.pageX + 12 + 'px')
            .style('top', event.pageY - 30 + 'px')
            .style('opacity', 1)
            .html(`
              <strong>GPA:</strong> ${d.gpa}<br>
              Q1: ${d.q1}<br>
              Median: ${d.median}<br>
              Q3: ${d.q3}<br>
              Min: ${d.min}<br>
              Max: ${d.max}
            `);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0))
        .on('click', function () {
          d3.selectAll('rect').attr('stroke', null);
          d3.select(this).attr('stroke', 'black').attr('stroke-width', 2);
        });

      box.transition().delay(i * 100).duration(500)
        .attr('height', y(d.q1) - y(d.q3));

      svg.append('line')
      .attr('class', 'median-pulse')
      .attr('x1', center - boxWidth / 2)
      .attr('x2', center + boxWidth / 2)
      .attr('y1', y(d.median))
      .attr('y2', y(d.median))
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition().delay(i * 100 + 400).duration(300)
      .style('opacity', 1);
      

      svg.append('line')  // Min whisker
        .attr('x1', center - boxWidth / 4)
        .attr('x2', center + boxWidth / 4)
        .attr('y1', y(d.min))
        .attr('y2', y(d.min))
        .attr('stroke', 'black');

      svg.append('line')  // Max whisker
        .attr('x1', center - boxWidth / 4)
        .attr('x2', center + boxWidth / 4)
        .attr('y1', y(d.max))
        .attr('y2', y(d.max))
        .attr('stroke', 'black');
    });

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('University GPA');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Years to Promotion');
  }
}
