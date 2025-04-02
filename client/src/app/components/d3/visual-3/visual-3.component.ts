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
  gpaGroups: string[] = ["2.0-2.5", "2.5-3.0", "3.0-3.5", "3.5-4.0"];
  rankGroups: string[] = ["Top", "Upper-Mid", "Mid", "Lower-Mid", "Bottom"];
  selectedCategory: 'promotion' | 'jobLevel' ; 
  leftSelected: 'gpa' | 'sat' | 'rank' = 'gpa'; 
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
    const sankeyData = this.processDataForSankey(this.selectedCategory);

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


  processDataForSankey(selectedCategory: 'Rank' | 'promotion' | 'jobLevel'): any {
    const links: { source: number; target: number; value: number }[] = [];
    const nodes: { name: string }[] = [];

    // Determine left-side groups
    const leftSideGroups = this.leftSelected === 'gpa' 
      ? this.gpaGroups 
      : this.leftSelected === 'sat' 
        ? ["Low", "Medium-Low", "Medium-High", "High"] 
        : this.rankGroups; 

    // Determine right-side groups
    const rightSideGroups = selectedCategory === 'Rank' 
      ? this.rankGroups 
      : selectedCategory === 'promotion' 
        ? ["Very Fast", "Fast", "Moderate", "Slow", "Very Slow"] 
        : ["Entry", "Mid", "Senior"];

    // Create nodes for left and right values
    leftSideGroups.forEach(group => nodes.push({ name: group }));
    rightSideGroups.forEach(group => nodes.push({ name: group }));

    // Create links based on data
    leftSideGroups.forEach((leftGroup, leftIndex) => {
      rightSideGroups.forEach((rightGroup, rightIndex) => {
        const link = {
          source: leftIndex,
          target: leftSideGroups.length + rightIndex,
          value: this.calculateGroupFlow(leftGroup, rightGroup, selectedCategory)
        };
        links.push(link);
      });
    });

    return { nodes, links };
  }
  // Calculate the flow between left and right groups based on selected category  

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
          : d['Current_Job_Level']; // Directly using Job Level
  
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

  getPromotionGroup(years: number): string {
    if (years === 1) return "Very Fast";
    if (years === 2) return "Fast";
    if (years === 3) return "Moderate";
    if (years === 4) return "Slow";
    return "Very Slow";  // 5+ years
  }
  

}
