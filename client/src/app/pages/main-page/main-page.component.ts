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
  academicPerformanceQuestions = [
    { id: 'A1.1 (★★★)', text: 'Dans quelle mesure un GPA élevé à l’université corrèle avec un succès dans leur carrière ?' },
    { id: 'A1.2 (★★★)', text: 'Quel est l’impact du classement universitaire par rapport au salaire initial ?' },
    { id: 'A1.3 (★★★)', text: 'Existe-t-il une corrélation entre les indicateurs académiques (GPA, SAT, classement) et le niveau de satisfaction professionnelle ?' }
  ];

  academicPerformanceAnswers = [
    { id: 'A1.1 (★★★)', text: 'Dans quelle mesure un GPA élevé à l’université corrèle avec un succès dans leur carrière ?' },
    { id: 'A1.2 (★★★)', text: 'Quel est l’impact du classement universitaire par rapport au salaire initial ?' },
    { id: 'A1.3 (★★★)', text: 'Existe-t-il une corrélation entre les indicateurs académiques (GPA, SAT, classement) et le niveau de satisfaction professionnelle ?' }
  ];

  experientialLearningQuestions = [
    // Add questions for the "Experiential Learning Impact" section here
  ];

  experientialLearningAnswers = [
    // Add answers for the "Experiential Learning Impact" section here
  ];
}