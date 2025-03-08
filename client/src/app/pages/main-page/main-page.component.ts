import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { VizSectionComponent } from '../../components/viz-section/viz-section.component';
import { ScatterVizComponent } from '@app/components/d3/scatter-viz/scatter-viz.component';
import { SankeyVizComponent } from '@app/components/d3/sankey-viz/sankey-viz.component';

@Component({
  standalone: true,
  selector: 'app-main-page',
  imports: [CommonModule, HeaderComponent, VizSectionComponent, ScatterVizComponent, SankeyVizComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {}