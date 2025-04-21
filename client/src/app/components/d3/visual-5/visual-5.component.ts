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
  @ViewChild('salaryChart') salaryChart!: ElementRef;
  @ViewChild('satisfactionChart') satisfactionChart!: ElementRef;
  @ViewChild('equilibreChart') equilibreChart!: ElementRef;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        observer.disconnect();
        this.dataService.loadCareerData().then(data => {
          const male = data.filter(d => d.Gender === 'Male');
          const female = data.filter(d => d.Gender === 'Female');

          this.renderLineChart(male, female, 'Starting_Salary', this.salaryChart, 'Starting Salary');
          this.renderLineChart(male, female, 'Career_Satisfaction', this.satisfactionChart, 'Career Satisfaction');
          this.renderLineChart(male, female, 'Work_Life_Balance', this.equilibreChart, 'Work/Life Balance');
        });
      }
    }, { threshold: 0.3 });

    observer.observe(this.salaryChart.nativeElement);
  }

  renderLineChart(male: any[], female: any[], metric: string, container: ElementRef, title: string): void {
    const margin = { top: 40, right: 20, bottom: 50, left: 60 };
    const width = 300;
    const height = 250;

    const containerEl = container.nativeElement;
    const svgContainer = d3.select(containerEl);
    const tooltip = d3.select(containerEl)
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('opacity', 0);

    const svg = svgContainer
      .append('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('display', 'block')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const avg = (data: any[]) =>
      Array.from(d3.group(data, d => d.Age), ([Age, values]) => ({
        Age: +Age,
        Value: d3.mean(values, d => +d[metric]) ?? 0
      })).sort((a, b) => a.Age - b.Age);

    const maleAvg = avg(male);
    const femaleAvg = avg(female);
    const allValues = [...maleAvg, ...femaleAvg].map(d => d.Value);
    const minVal = d3.min(allValues)!;
    const maxVal = d3.max(allValues)!;
    const buffer = (maxVal - minVal) * 0.1;

    const x = d3.scaleLinear()
      .domain(d3.extent([...maleAvg, ...femaleAvg], d => d.Age) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([minVal - buffer, maxVal + buffer])
      .range([height, 0]);

    const lineGen = d3.line<any>()
      .x(d => x(d.Age))
      .y(d => y(d.Value))
      .curve(d3.curveMonotoneX);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Âge');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(title);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(title);

    const animatePath = (data: any[], color: string, label: string) => {
      const path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', lineGen);

      const totalLength = (path.node() as SVGPathElement).getTotalLength();

      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .attr('stroke-dashoffset', 0);

      svg.selectAll(null)
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.Age))
        .attr('cy', d => y(d.Value))
        .attr('r', 4)
        .attr('fill', color)
        .on('mousemove', function (event, d) {
          const bounds = containerEl.getBoundingClientRect();
          tooltip
            .html(`${label}<br>Âge : ${d.Age}<br>Valeur : ${d.Value.toFixed(1)}`)
            .style('left', `${event.clientX - bounds.left + 10}px`)
            .style('top', `${event.clientY - bounds.top - 30}px`)
            .style('opacity', 1);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0));
    };

    animatePath(maleAvg, '#1f77b4', 'Hommes');
    animatePath(femaleAvg, '#e377c2', 'Femmes');
  }
}