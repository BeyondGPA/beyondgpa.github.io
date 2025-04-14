import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { VizSectionComponent } from '../../components/viz-section/viz-section.component';
import { Visual1Component } from '@app/components/d3/visual-1/visual-1.component';
import { Visual2Component } from '@app/components/d3/visual-2/visual-2.component';
import { Visual3Component } from '@app/components/d3/visual-3/visual-3.component';
import { Visual4Component } from '@app/components/d3/visual-4/visual-4.component';
import { Visual5Component } from '@app/components/d3/visual-5/visual-5.component';
// import { ScatterVizComponent } from '@app/components/d3/scatter-viz/scatter-viz.component';
// import { SankeyVizComponent } from '@app/components/d3/sankey-viz/sankey-viz.component';
// import { StackedBarVizComponent } from '@app/components/d3/stacked-bar-viz/stacked-bar-viz.component';

@Component({
  standalone: true,
  selector: 'app-main-page',
  imports: [CommonModule, HeaderComponent, VizSectionComponent, Visual1Component, Visual2Component, Visual3Component, Visual4Component, Visual5Component],
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

  Questions4 = [
    { id: '', text: '' },
    { id: '', text: '' },
    { id: '', text: '' }
  ];

  Answers4 = [
    { id: '', text: '' },
    { id: '', text: '' },
    { id: '', text: '' }
  ];

  Questions5 = [
    {
      id: 'A1.4 (★★☆)',
      text: 'How do academic indicators influence the average time to promotion?'
    },
    {
      id: 'A4.2 (★★☆)',
      text: 'Is the number of years before a first promotion related to work-life balance satisfaction?'
    }
  ];

  Answers5 = [
    {
      id: 'A1.4 (★★☆)',
      text: 'This box plot shows how the number of years before a first promotion varies across GPA brackets. We observe a clear inverse trend: students with higher university GPAs tend to reach their first promotion significantly faster. The median time to promotion for students with GPAs above 3.5 is approximately 3 years, compared to nearly 5 years for those with GPAs below 2.5. The interquartile ranges also tend to be narrower for higher GPA groups, suggesting more consistent advancement. This suggests that academic excellence not only correlates with career access (as seen in other visuals) but also with faster upward mobility.'
    },
    {
      id: 'A4.2 (★★☆)',
      text: 'While the visualization does not directly plot work-life balance, a cross-reference with other dataset attributes reveals a pattern: individuals who experience quicker promotions tend to report slightly higher satisfaction with work-life balance. This may seem counterintuitive, as rapid promotion can imply greater responsibilities. However, it is possible that high-performing individuals are promoted into more desirable roles that afford them flexibility or satisfaction. Additional visuals or multi-variable analysis would be required to validate this correlation more concretely.'
    }
  ];
}