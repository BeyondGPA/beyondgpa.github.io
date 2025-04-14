import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { FormsModule } from '@angular/forms';
import { DataService } from '@app/services/data/data.service';

@Component({
  standalone: true,
  selector: 'app-visual-3',
  templateUrl: './visual-3.component.html',
  imports: [FormsModule],
  styleUrls: ['./visual-3.component.scss']
})
export class Visual3Component implements AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;
  data: any[] = [];

  gpaGroups: string[] = ["2-2.5", "2.5-3.0", "3.0-3.5", "3.5-4.0"];
  satGroups: string[] = ["1-600", "601-1000", "1001-1300", "1301-1600"];
  rankGroups: string[] = ["1-200", "201-400", "401-600", "601-800", "801-1000"];

  selectedCategory: 'promotion' | 'jobLevel' = 'promotion';
  leftSelected: 'gpa' | 'sat' | 'rank' = 'gpa';

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.loadCareerData().then(data => {
      this.data = data.map(student => ({
        ...student,
        GPA_Group: this.getGPAGroup(+student.University_GPA),
        SAT_Group: this.getSATGroup(+student.SAT_Score),
        University_Rank_Group: this.getUniversityRankGroup(+student.University_Ranking),
      }));
      this.renderSankey();
    });
  }

  renderSankey(): void {
    d3.select(this.chartContainer.nativeElement).selectAll("svg").remove();
    const sankeyData = this.processDataForSankey(this.selectedCategory);

    const width = 600;
    const height = 400;

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("width", width)
      .attr("height", height)
      .style('display', 'block')
      .style('max-width', '100%')

    const sankey = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]]);

    const { nodes, links } = sankey(sankeyData) as {
      nodes: Array<{ name: string } & d3Sankey.SankeyNodeMinimal<{}, {}>>,
      links: d3Sankey.SankeyLinkMinimal<{}, {}>[]
    };

    const gpaGroups = ["Low", "Medium-Low", "Medium-High", "High"];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(gpaGroups);
    const nodeMap = new Map(nodes.map(d => [d.name, d]));

    svg.append("g")
      .selectAll(".link")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke-width", d => Math.max(1, d.width ?? 0))
      .style("stroke", d => {
        const sourceNode = typeof d.source === 'object' && 'name' in d.source ? nodeMap.get((d.source as { name: string }).name) : undefined;
        return sourceNode ? colorScale(sourceNode.name) : "#999";
      })
      .style("fill", "none")
      .style("opacity", 0.7);

    svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .call(g => g.append("rect")
        .attr("height", d => (d.y1 ?? 0) - (d.y0 ?? 0))
        .attr("width", d => (d.x1 ?? 0) - (d.x0 ?? 0))
        .style("fill", d => colorScale(d.name) || "#ddd")
      );

    svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .call(g => g.append("text")
        .attr("x", d => {
          const isLeft = (d.x0 ?? 0) < width / 2;
          const nodeWidth = (d.x1 ?? 0) - (d.x0 ?? 0);
          const nameLength = d.name.length;
          return isLeft ? nodeWidth + 12 : -10 - nameLength * 6;
        })
        .attr("y", d => ((d.y1 ?? 0) - (d.y0 ?? 0)) / 2 + 5)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => (d.x0 ?? 0) < width / 2 ? "start" : "end")
        .text(d => d.name)
        .style("font-size", "14px")
        .style("fill", "#000")
        .style("font-weight", "bold")
      );
  }

  processDataForSankey(selectedCategory: 'Rank' | 'promotion' | 'jobLevel'): any {
    const links: { source: number; target: number; value: number }[] = [];
    const nodes: { name: string }[] = [];

    const leftSideGroups = this.leftSelected === 'gpa' 
      ? this.gpaGroups 
      : this.leftSelected === 'sat' 
        ? this.satGroups 
        : this.rankGroups;

    const rightSideGroups = selectedCategory === 'Rank' 
      ? this.rankGroups 
      : selectedCategory === 'promotion' 
        ? ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5+"] 
        : ["Entry", "Mid", "Senior"];

    leftSideGroups.forEach(group => nodes.push({ name: group }));
    rightSideGroups.forEach(group => nodes.push({ name: group }));

    leftSideGroups.forEach((leftGroup, leftIndex) => {
      rightSideGroups.forEach((rightGroup, rightIndex) => {
        links.push({
          source: leftIndex,
          target: leftSideGroups.length + rightIndex,
          value: this.calculateGroupFlow(leftGroup, rightGroup, selectedCategory)
        });
      });
    });

    return { nodes, links };
  }

  calculateGroupFlow(leftGroup: string, rightGroup: string, category: 'Rank' | 'promotion' | 'jobLevel'): number {
    return this.data.filter(d => {
      const leftValue = this.leftSelected === 'gpa' 
        ? this.getGPAGroup(parseFloat(d['University_GPA'])) 
        : this.leftSelected === 'sat' 
          ? this.getSATGroup(parseInt(d['SAT_Score'])) 
          : this.getUniversityRankGroup(parseInt(d['University_Ranking']));

      const rightValue = category === 'Rank'
        ? this.getUniversityRankGroup(parseInt(d['University_Ranking']))
        : category === 'promotion'
          ? this.getPromotionGroup(parseInt(d['Years_to_Promotion']))
          : d['Current_Job_Level'];

      return leftValue === leftGroup && rightValue === rightGroup;
    }).length;
  }

  getGPAGroup(gpa: number): string {
    if (gpa >= 2.0 && gpa < 2.5) return "2-2.5";
    if (gpa >= 2.5 && gpa < 3.0) return "2.5-3.0";
    if (gpa >= 3.0 && gpa < 3.5) return "3.0-3.5";
    if (gpa >= 3.5 && gpa <= 4.0) return "3.5-4.0";
    return "Unknown";
  }

  getSATGroup(sat: number): string {
    if (sat >= 1 && sat <= 600) return "1-600";
    if (sat > 600 && sat <= 1000) return "601-1000";
    if (sat > 1000 && sat <= 1300) return "1001-1300";
    if (sat > 1300 && sat <= 1600) return "1301-1600";
    return "Unknown";
  }

  getUniversityRankGroup(rank: number): string {
    if (rank >= 1 && rank <= 200) return "1-200";
    if (rank > 200 && rank <= 400) return "201-400";
    if (rank > 400 && rank <= 600) return "401-600";
    if (rank > 600 && rank <= 800) return "601-800";
    if (rank > 800 && rank <= 1000) return "801-1000";
    return "Unknown";
  }

  getPromotionGroup(years: number): string {
    if (years === 1) return "Year 1";
    if (years === 2) return "Year 2";
    if (years === 3) return "Year 3";
    if (years === 4) return "Year 4";
    return "Year 5+";
  }
}
