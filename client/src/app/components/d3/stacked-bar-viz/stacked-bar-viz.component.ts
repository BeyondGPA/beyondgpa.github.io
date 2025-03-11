import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  standalone: true,
  selector: 'app-stacked-bar-viz',
  templateUrl: './stacked-bar-viz.component.html',
  styleUrls: ['./stacked-bar-viz.component.scss']
})
export class StackedBarVizComponent implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;

  ngAfterViewInit(): void {
    // Parameters from the original example.
    const n = 5;
    const m = 58;
    // Use numbers converted to strings for the x-scale domain.
    const xDomain = d3.range(m).map(String);
    // Generate dummy data.
    const yz = d3.range(n).map(() => this.bumps(m));

    const width = 928;
    const height = 500;
    const marginTop = 0;
    const marginRight = 0;
    const marginBottom = 10;
    const marginLeft = 0;

    // For d3.stack, use string keys.
    const keys = d3.range(n).map(String);
    const transposed = d3.transpose(yz) as number[][];
    // Create stacked data and attach the series index.
    const y01z = d3.stack().keys(keys)(transposed.map(d => {
      const obj: { [key: string]: number } = {};
      d.forEach((value, i) => obj[keys[i]] = value);
      return obj;
    }))
      .map((data, i) =>
        data.map((d: d3.SeriesPoint<{ [key: string]: number }>) => [d[0], d[1], i] as [number, number, number])
      );

    const yMax = d3.max(yz, y => d3.max(y))!;
    const y1Max = d3.max(y01z, series => d3.max(series, d => d[1]))!;

    // Create x and y scales.
    const x = d3.scaleBand<string>()
      .domain(xDomain)
      .rangeRound([marginLeft, width - marginRight])
      .padding(0.08);

    const y = d3.scaleLinear()
      .domain([0, y1Max])
      .range([height - marginBottom, marginTop]);

    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([-0.5 * n, 1.5 * n]);

    // Create the SVG element.
    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

    // Create groups and rectangles.
    const rect = svg.selectAll("g")
      .data(y01z)
      .join("g")
        .attr("fill", (_d, i) => color(i))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", (_d, i) => x(String(i))!)
        .attr("y", height - marginBottom)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    // Append an x-axis with no tick labels.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => ""));

    // Transition to grouped layout.
    function transitionGrouped() {
      y.domain([0, yMax]);
      rect.transition()
        .duration(500)
        .delay((d: unknown, i: number) => i * 20)
        .attr("x", (d: unknown, i: number) => {
          const dd = d as [number, number, number];
          return x(String(i))! + x.bandwidth() / n * dd[2];
        })
        .attr("width", x.bandwidth() / n)
      .transition()
        .attr("y", (d: unknown) => {
          const dd = d as [number, number, number];
          return y(dd[1] - dd[0]);
        })
        .attr("height", (d: unknown) => {
          const dd = d as [number, number, number];
          return y(0) - y(dd[1] - dd[0]);
        });
    }

    // Transition to stacked layout.
    function transitionStacked() {
      y.domain([0, y1Max]);
      rect.transition()
        .duration(500)
        .delay((d: unknown, i: number) => i * 20)
        .attr("y", (d: unknown) => {
          const dd = d as [number, number, number];
          return y(dd[1]);
        })
        .attr("height", (d: unknown) => {
          const dd = d as [number, number, number];
          return y(dd[0]) - y(dd[1]);
        })
      .transition()
        .attr("x", (d: unknown, i: number) => x(String(i))!)
        .attr("width", x.bandwidth());
    }

    // Update function that switches layouts.
    function update(layout: "stacked" | "grouped") {
      if (layout === "stacked") transitionStacked();
      else transitionGrouped();
    }

    // Automatically toggle layout every 2 seconds.
    let currentLayout: "stacked" | "grouped" = "stacked";
    setInterval(() => {
      currentLayout = currentLayout === "stacked" ? "grouped" : "stacked";
      update(currentLayout);
    }, 2000);
  }

  // Bumps function from the original code.
  bumps(m: number): number[] {
    const values: number[] = [];
    // Initialize with uniform random values in [0.1, 0.2)
    for (let i = 0; i < m; ++i) {
      values[i] = 0.1 + 0.1 * Math.random();
    }
    // Add five random bumps.
    for (let j = 0; j < 5; ++j) {
      const x = 1 / (0.1 + Math.random());
      const y = 2 * Math.random() - 0.5;
      const z = 10 / (0.1 + Math.random());
      for (let i = 0; i < m; i++) {
        const w = (i / m - y) * z;
        values[i] += x * Math.exp(-w * w);
      }
    }
    // Ensure all values are positive.
    for (let i = 0; i < m; ++i) {
      values[i] = Math.max(0, values[i]);
    }
    return values;
  }
}
