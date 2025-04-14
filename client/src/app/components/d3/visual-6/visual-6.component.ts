import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import * as d3 from "d3";
import { DataService } from "@app/services/data/data.service";

@Component({
  standalone: true,
  selector: "app-visual-6",
  templateUrl: "./visual-6.component.html",
  styleUrls: ["./visual-6.component.scss"],
})
export class Visual6Component implements AfterViewInit {
  @ViewChild("salaryChart") salaryChart!: ElementRef;
  @ViewChild("satisfactionChart") satisfactionChart!: ElementRef;
  @ViewChild("equilibreChart") equilibreChart!: ElementRef;

  metrics = {
    Salary: "Starting_Salary",
    Satisfaction: "Career_Satisfaction",
    Equilibre: "Work_Life_Balance",
  };

  margin = { top: 40, right: 60, bottom: 30, left: 60 };
  width = 400;
  height = 350;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.loadCareerData().then((data) => {
      this.renderChart(data);
    });
  }

  renderChart(data: any[]): void {
    const male = data.filter((d) => d.Gender === "Male");
    const female = data.filter((d) => d.Gender === "Female");

    this.createComparisonChart(
      male,
      female,
      this.metrics.Salary,
      this.salaryChart
    );
    this.createComparisonChart(
      male,
      female,
      this.metrics.Satisfaction,
      this.satisfactionChart
    );
    this.createComparisonChart(
      male,
      female,
      this.metrics.Equilibre,
      this.equilibreChart
    );
  }

  createComparisonChart(
    maleData: any[],
    femaleData: any[],
    metric: string,
    container: ElementRef
  ) {
    // const containerWidth = container.nativeElement.clientWidth;
    // const containerHeight = container.nativeElement.clientHeight;

    // this.width = containerWidth - this.margin.left - this.margin.right;
    // this.height = containerHeight - this.margin.top - this.margin.bottom;

    // Calcul des valeurs moyennes pour chaque âge de la métriquE
    const avgMaleData: any[] = this.getAverage(maleData, metric);
    const avgFemaleData: any[] = this.getAverage(femaleData, metric);

    // Échelles des axes X (âge) et Y (valeurs de la métrique)
    const x = d3
      .scaleLinear()
      .domain([
        d3.min([...avgMaleData, ...avgFemaleData], (d: any) => d.Age)!,
        d3.max([...avgMaleData, ...avgFemaleData], (d: any) => d.Age)!,
      ])
      .range([0, this.width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min([...avgMaleData, ...avgFemaleData], (d: any) => d.Value),
        d3.max([...avgMaleData, ...avgFemaleData], (d: any) => d.Value)!,
      ])
      .range([this.height, 0]);

    // Création de l'élément SVG
    const svg = this.createSvg(container);

    const line = d3
      .line()
      .x((d: any) => x(d.Age))
      .y((d: any) => y(d.Value));

    // Ajout des axes X et Y + labels
    this.drawChart(svg, x, y, metric);

    const colors = { Male: "blue", Female: "red" };

    // Fonction  pour éclaircir une couleur selon le genre lorsqu'on survole
    const lightenColor = (color: string, percent: number): string => {
      return this.lightenColor(color, percent);
    };

    // Création des lignes du graphique
    const lines = [
      { gender: "Male", data: avgMaleData, color: colors.Male },
      { gender: "Female", data: avgFemaleData, color: colors.Female },
    ];

    lines.forEach((lineData) => {
      svg
        .append("path")
        .datum(lineData.data)
        .attr("class", "data-line " + lineData.gender)
        .attr("fill", "none")
        .attr("stroke", lineData.color)
        .attr("stroke-width", 3)
        .attr("d", line)
        .on("mouseover", function () {
          const hoveredGender = lineData.gender;

          svg
            .selectAll(".data-line")
            .filter((d: any) => d !== null)
            .attr("stroke", function (d, i, nodes) {
              const currentStroke = d3.select(nodes[i]).attr("stroke");
              return currentStroke !==
                colors[hoveredGender as keyof typeof colors]
                ? lightenColor(currentStroke, 0.9)
                : currentStroke;
            });
        })
        .on("mouseout", function () {
          svg.selectAll(".data-line").attr("stroke", function () {
            const classes = d3.select(this).attr("class").split(" ");
            const genderClass = classes.find(
              (c) => c === "Male" || c === "Female"
            );
            return colors[genderClass as keyof typeof colors];
          });
        });
    });

    // Ajout de la légende
    this.drawLegend(svg, colors);
  }

  private getAverage(data: any[], metric: string) {
    return Array.from(
      d3.group(data, (d: any) => d.Age),
      ([key, values]) => ({
        Age: key,
        Value: d3.mean(values, (d: any) => +d[metric]),
      })
    ).sort((a, b) => a.Age - b.Age);
  }

  private createSvg(container: ElementRef) {
    return d3
      .select(container?.nativeElement)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawChart(svg: any, x: any, y: any, metric: string): void {
    svg
      .append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("x", this.width / 2)
      .attr("y", this.height + 25)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .text("Âge");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -this.margin.left + 10)
      .attr("x", -this.height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .text(
        this.getMetricLabel(metric) +
          (metric === this.metrics.Satisfaction ? " moyenne" : " moyen")
      );

    svg
      .append("text")
      .attr("x", this.width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#fff")
      .text(this.getMetricLabel(metric));
  }

  private lightenColor(color: string, percent: number): string {
    const colorRgb = d3.rgb(color);
    return d3
      .rgb(
        Math.min(255, colorRgb.r + (255 - colorRgb.r) * percent),
        Math.min(255, colorRgb.g + (255 - colorRgb.g) * percent),
        Math.min(255, colorRgb.b + (255 - colorRgb.b) * percent)
      )
      .toString();
  }

  private drawLegend(svg: any, colors: any): void {
    const legend = svg
      .append("g")
      .attr("transform", `translate(${this.width}, 0)`);

    legend
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 15)
      .attr("y2", 0)
      .attr("stroke", colors.Male)
      .attr("stroke-width", 2);

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 4)
      .style("font-size", "10px")
      .text("Hommes");

    legend
      .append("line")
      .attr("x1", 0)
      .attr("y1", 15)
      .attr("x2", 15)
      .attr("y2", 15)
      .attr("stroke", colors.Female)
      .attr("stroke-width", 2);

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 19)
      .style("font-size", "10px")
      .text("Femmes");
  }

  private getMetricLabel(metricKey: string): string {
    switch (metricKey) {
      case this.metrics.Salary:
        return "Salaire initial";
      case this.metrics.Satisfaction:
        return "Satisfaction professionnelle";
      case this.metrics.Equilibre:
        return "Équilibre vie pro/perso";
      default:
        return "";
    }
  }
}
