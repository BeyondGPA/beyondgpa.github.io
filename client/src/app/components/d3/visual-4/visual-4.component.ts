import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-visual-4',
  templateUrl: './visual-4.component.html',
  styleUrls: ['./visual-4.component.scss']
})
export class Visual4Component implements AfterViewInit {
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
      .attr("viewBox", `0 0 ${width + 50} ${height + 75}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("width", width)
      .attr("height", height)
      .style('display', 'block')
      .style('max-width', '100%')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const cleanData = data
      .filter(d => d.University_GPA && d.Years_to_Promotion)
      .map(d => ({
        gpa: parseFloat(d.University_GPA),
        years: parseFloat(d.Years_to_Promotion)
      }));

    const grouped = d3.groups(cleanData, d => Math.round(d.years));
    const labels = grouped.map(([years]) => years.toString());

    const summary = grouped.map(([years, records]) => {
      const values = records.map(d => d.gpa).sort(d3.ascending);
      const q1 = d3.quantile(values, 0.25)!;
      const median = d3.quantile(values, 0.5)!;
      const q3 = d3.quantile(values, 0.75)!;
      const iqr = q3 - q1;
      const rawMin = d3.min(values);
      const rawMax = d3.max(values);
      const min = Math.max(rawMin ?? q1, q1 - 1.5 * iqr);
      const max = Math.min(rawMax ?? q3, q3 + 1.5 * iqr);
      return { years: +years, q1, median, q3, min, max };
    });

    const x = d3.scaleLinear()
      .domain([0, d3.max(summary, d => d.max)! + 0.5])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(labels)
      .range([height, 0])
      .paddingInner(0.3)
      .paddingOuter(0.1);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select('body')
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

    summary.forEach((d, i) => {
      const center = y(d.years.toString())! + y.bandwidth() / 2;
      const boxHeight = y.bandwidth() * 0.5;

      svg.append('line')
        .attr('y1', center)
        .attr('y2', center)
        .attr('x1', x(d.min))
        .attr('x2', x(d.min))
        .attr('stroke', 'black')
        .transition().delay(i * 100).duration(400)
        .attr('x2', x(d.max));

      const box = svg.append('rect')
        .attr('y', center - boxHeight / 2)
        .attr('height', boxHeight)
        .attr('x', x(d.q1))
        .attr('width', 0)
        .attr('fill', '#69b3a2')
        .attr('cursor', 'pointer')
        .on('mousemove', (event) => {
          tooltip
            .style('left', event.pageX + 12 + 'px')
            .style('top', event.pageY - 30 + 'px')
            .style('opacity', 1)
            .style('display', 'Block')
            .html(`
              <strong>Years:</strong> ${d.years}<br>
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
        .attr('width', x(d.q3) - x(d.q1));

      svg.append('line')
        .attr('class', 'median-pulse')
        .attr('y1', center - boxHeight / 2)
        .attr('y2', center + boxHeight / 2)
        .attr('x1', x(d.median))
        .attr('x2', x(d.median))
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .transition().delay(i * 100 + 400).duration(300)
        .style('opacity', 1);

      svg.append('line')  // Min whisker
        .attr('y1', center - boxHeight / 4)
        .attr('y2', center + boxHeight / 4)
        .attr('x1', x(d.min))
        .attr('x2', x(d.min))
        .attr('stroke', 'black');

      svg.append('line')  // Max whisker
        .attr('y1', center - boxHeight / 4)
        .attr('y2', center + boxHeight / 4)
        .attr('x1', x(d.max))
        .attr('x2', x(d.max))
        .attr('stroke', 'black');
    });

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Years to Promotion');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('University GPA');
  }
}
