import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { VizSectionComponent } from '../../components/viz-section/viz-section.component';
import { ScatterVizComponent } from '@app/components/d3/scatter-viz/scatter-viz.component';
import { SankeyVizComponent } from '@app/components/d3/sankey-viz/sankey-viz.component';
import { StackedBarVizComponent } from '@app/components/d3/stacked-bar-viz/stacked-bar-viz.component';

@Component({
  standalone: true,
  selector: 'app-main-page',
  imports: [CommonModule, HeaderComponent, VizSectionComponent, ScatterVizComponent, SankeyVizComponent, StackedBarVizComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  Questions1 = [
    { id: 'A1.1 (★★★)', text: 'Dans quelle mesure un GPA élevé à l’université corrèle avec un succès dans leur carrière ?' }
  ];

  Answers1 = [
    { id: 'A1.1 (★★★)', text: 'Les étudiants avec un GPA élevé tendent à obtenir un salaire de départ plus élevé et plus d’offres d’emploi, indiquant une corrélation positive entre performance académique et réussite professionnelle.' }
  ];


  Questions2 = [
    { id: '', text: '' },
    { id: '', text: '' },
    { id: '', text: '' }
  ];

  Answers2 = [
    { id: '', text: '' },
    { id: '', text: '' },
    { id: '', text: '' }
  ];

  Questions3 = [
    { id: '', text: '' },
    { id: '', text: '' },
    { id: '', text: '' }
  ];

  Answers3 = [
    { id: '', text: '' },
    { id: '', text: '' },
    { id: '', text: '' }
  ];
}