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
  gpaCount: any = {};
  gpaGroups: string[] = ["Low", "Medium-Low", "Medium-High", "High"];
  rankGroups: string[] = ["Top", "Upper-Mid", "Mid", "Lower-Mid", "Bottom"];
  satCount: any = {};
  rankCount: any = {};



  constructor(private dataService: DataService) {}

  
  processData(): void {
    this.data = this.data.map(student => ({
      ...student,
      GPA_Group: this.getGPAGroup(+student.University_GPA),
      SAT_Group: this.getSATGroup(+student.SAT_Score),
      University_Rank_Group: this.getUniversityRankGroup(+student.University_Ranking),
    }));
  
    console.log("Processed Data:", this.data.slice(0, 10)); // Log to check if groups are assigned correctly
  }
  


  ngAfterViewInit(): void {
    this.dataService.loadCareerData().then(data => {
      this.data = data;
      this.renderSankey();
    });
    console.log(this.chartContainer.nativeElement);

  }
    
  renderSankey(): void {
    // Clear previous chart
    d3.select(this.chartContainer.nativeElement).selectAll("svg").remove();

    // Prepare data for the Sankey diagram
    const sankeyData = this.processDataForSankey();

    const width = 800;
    const height = 600;

    // Create the SVG element for the Sankey diagram
    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    // Define Sankey layout
    const sankey = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]]);

    const { nodes, links } = sankey(sankeyData) as { nodes: Array<{ name: string } & d3Sankey.SankeyNodeMinimal<{}, {}>>, links: d3Sankey.SankeyLinkMinimal<{}, {}>[] };
    console.log("Nodes:", nodes);
    console.log("Links:", links);

    // Define a color scale for GPA groups
    const gpaGroups = ["Low", "Medium-Low", "Medium-High", "High"];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(gpaGroups);

    // Create a lookup for node names
    const nodeMap = new Map(nodes.map(d => [d.name, d]));

    // Draw links (flows)
    svg.append("g")
      .selectAll(".link")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke-width", d => Math.max(1, d.width ?? 0))
      .style("stroke", d => {
          const sourceNode = typeof d.source === 'object' && 'name' in d.source ? nodeMap.get((d.source as { name: string }).name) : undefined;
          return sourceNode ? colorScale(sourceNode.name) : "#999"; // Assign color based on GPA group
      })
      .style("fill", "none")
      .style("opacity", 0.7);

    // Draw nodes
    svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .call(g => g.append("rect")
        .attr("height", d => (d.y1 ?? 0) - (d.y0 ?? 0))
        .attr("width", d => (d.x1 ?? 0) - (d.x0 ?? 0))
        .style("fill", d => colorScale(d.name) || "#ddd") // Use same color for GPA nodes
      );

    // Add labels to nodes
    // Add labels to nodes
    svg.append("g")
    .selectAll(".node")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x0},${d.y0})`)
    .call(g => g.append("text")
      .attr("x", d => (d.x0 ?? 0 < width / 2) ? (d.x1 ?? 0 - (d.x0 ?? 0)) + 6 : -6) // Push right for left-side nodes, left for right-side
      .attr("y", d => ((d.y1 ?? 0) - (d.y0 ?? 0)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => (d.x0 ?? 0 < width / 2) ? "start" : "end") // Align text correctly
      .text(d => d.name)
      .style("font-size", "14px") // Ensure readability
      .style("fill", "#000") // Ensure contrast
    );

}


    processDataForSankey(): any {
      const links: { source: number; target: number; value: number; }[] = [];
      const nodes: { name: string }[] = [];
    
      // Create nodes for GPA groups and Rank groups
      this.gpaGroups.forEach(gpaGroup => {
        nodes.push({ name: gpaGroup });
      });
    
      this.rankGroups.forEach(rankGroup => {
        nodes.push({ name: rankGroup });
      });
    
      // Create links based on data
      this.gpaGroups.forEach((gpaGroup, gpaIndex) => {
        this.rankGroups.forEach((rankGroup, rankIndex) => {
          const link = {
            source: gpaIndex,  // Use the index of the GPA group node
            target: this.gpaGroups.length + rankIndex,  // Use the index of the Rank group node
            value: this.calculateGroupFlow(gpaGroup, rankGroup)
          };
          links.push(link);
        });
      });
    
      return { nodes, links };
    }
    
  

  calculateGroupFlow(gpaGroup: string, rankGroup: string): number {
    // Count the number of students within the specified GPA and Rank groups
    const count = this.data.filter(d => {
      const gpa = this.getGPAGroup(parseFloat(d['University_GPA']));
      const rank = this.getUniversityRankGroup(parseInt(d['University_Ranking']));
      return gpa === gpaGroup && rank === rankGroup;
    }).length;
  
    console.log(`${gpaGroup} -> ${rankGroup}: ${count}`);  // Log flow count for debugging
    return count;
  }
  


  getGPAGroup(gpa: number): string {
    if (gpa >= 2.0 && gpa < 2.5) return "Low";
    if (gpa >= 2.5 && gpa < 3.0) return "Medium-Low";
    if (gpa >= 3.0 && gpa < 3.5) return "Medium-High";
    if (gpa >= 3.5 && gpa <= 4.0) return "High";
    return "Unknown";
  }
  
  getSATGroup(sat: number): string {
    if (sat >= 1 && sat <= 600) return "Low";
    if (sat > 600 && sat <= 1000) return "Medium-Low";
    if (sat > 1000 && sat <= 1300) return "Medium-High";
    if (sat > 1300 && sat <= 1600) return "High";
    return "Unknown";
  }
  
  getUniversityRankGroup(rank: number): string {
    if (rank >= 1 && rank <= 200) return "Top";
    if (rank > 200 && rank <= 400) return "Upper-Mid";
    if (rank > 400 && rank <= 600) return "Mid";
    if (rank > 600 && rank <= 800) return "Lower-Mid";
    if (rank > 800 && rank <= 1000) return "Bottom";
    return "Unknown";
  }

}
