import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-stacked-bar-viz',
  templateUrl: './stacked-bar-viz.component.html',
  styleUrls: ['./stacked-bar-viz.component.scss']
})
export class StackedBarVizComponent implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.loadCareerData().then(data => {
      this.renderChart(data);
    });
  }

  renderChart(data: any[]): void {
    // --- Data Aggregation into 10 GPA Bins ---
    // Extract GPA values.
    const gpaValues = data.map(d => +d.University_GPA);
    const [minGPA, maxGPA] = d3.extent(gpaValues) as [number, number];
    const binCount = 10;
    // Create 11 threshold values (bin boundaries).
    const binThresholds = d3.range(binCount + 1).map(i => minGPA + (maxGPA - minGPA) * (i / binCount));
    // Create labels, e.g. "2.5 - 2.8".
    const labels = binThresholds.slice(0, binCount).map((t, i) =>
      `${t.toFixed(1)} - ${binThresholds[i + 1].toFixed(1)}`
    );

    // Initialize 10 bins.
    const bins = Array.from({ length: binCount }, () => ({ salarySum: 0, offersSum: 0, count: 0 }));
    data.forEach(d => {
      const gpa = +d.University_GPA;
      // if GPA equals max, force it into the last bin.
      const binIndex = (gpa === maxGPA)
        ? binCount - 1
        : Math.floor((gpa - minGPA) / ((maxGPA - minGPA) / binCount));
      bins[binIndex].salarySum += +d.Starting_Salary;
      bins[binIndex].offersSum += +d.Job_Offers;
      bins[binIndex].count++;
    });
    // Compute average salary and offers for each bin.
    const avgSalary = bins.map(bin => bin.count ? bin.salarySum / bin.count : 0);
    const avgOffers = bins.map(bin => bin.count ? bin.offersSum / bin.count : 0);
    // Scale salary down by 10,000.
    const salaryData = avgSalary.map(s => s / 10000);
    // Our two series: starting salary and job offers.
    const seriesData = [salaryData, avgOffers];
    const n = seriesData.length;  // 2 series
    // const m = binCount;           // 10 bins

    // --- Adjusted Dimensions (e.g., 600×400) ---
    const width = 600;
    const height = 400;
    const marginTop = 0;
    const marginRight = 0;
    const marginBottom = 10;
    const marginLeft = 0;

    // x-scale: use the computed bin labels.
    const x = d3.scaleBand<string>()
      .domain(labels)
      .rangeRound([marginLeft, width - marginRight])
      .padding(0.08);

    // Prepare stacked data.
    // For d3.stack, we need to convert each bin's series into an object with keys.
    const keys = d3.range(n).map(String);
    const transposed = d3.transpose(seriesData) as number[][];
    const stackedData = d3.stack()
      .keys(keys)
      (transposed.map(d => {
        const obj: { [key: string]: number } = {};
        d.forEach((value, i) => { obj[keys[i]] = value; });
        return obj;
      }))
      .map((data, i) =>
        data.map((d: d3.SeriesPoint<{ [key: string]: number }>) => [d[0], d[1], i] as [number, number, number])
      );
      
    const yMaxStacked = d3.max(stackedData, series => d3.max(series, d => d[1]))!;
    const y = d3.scaleLinear()
      .domain([0, yMaxStacked])
      .range([height - marginBottom, marginTop]);

    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([-0.5 * n, 1.5 * n]);

    // --- Create the SVG and Draw the Bars ---
    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("viewBox", `0 -25 ${width} ${height + 50}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

    const rect = svg.selectAll("g")
      .data(stackedData)
      .join("g")
        .attr("fill", (_d, i) => color(i))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        // For x, we use the index of the bin to match the labels array.
        .attr("x", (_d, i) => x(labels[i])!)
        .attr("y", height - marginBottom)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // --- Transition Functions ---
    function transitionGrouped() {
      // For grouped view, use maximum among individual metrics.
      y.domain([0, d3.max(seriesData, series => d3.max(series))!]);
      rect.transition()
        .duration(500)
        .delay((d: unknown, i: number) => i * 20)
        .attr("x", (d: unknown, i: number) => {
          const dd = d as [number, number, number];
          return x(labels[i])! + x.bandwidth() / n * dd[2];
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

    function transitionStacked() {
      y.domain([0, yMaxStacked]);
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
        .attr("x", (d: unknown, i: number) => x(labels[i])!)
        .attr("width", x.bandwidth());
    }

    function update(layout: "stacked" | "grouped") {
      if (layout === "stacked") transitionStacked();
      else transitionGrouped();
    }

    let currentLayout: "stacked" | "grouped" = "stacked";
    setInterval(() => {
      currentLayout = currentLayout === "stacked" ? "grouped" : "stacked";
      update(currentLayout);
    }, 2000);
  }
}
