import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../components/header/header.component";
import { VizSectionComponent } from "../../components/viz-section/viz-section.component";
import { Visual1Component } from "@app/components/d3/visual-1/visual-1.component";
import { Visual2Component } from "@app/components/d3/visual-2/visual-2.component";
import { Visual3Component } from "@app/components/d3/visual-3/visual-3.component";
import { Visual4Component } from "@app/components/d3/visual-4/visual-4.component";
import { Visual5Component } from "@app/components/d3/visual-5/visual-5.component";

// import { ScatterVizComponent } from '@app/components/d3/scatter-viz/scatter-viz.component';
// import { SankeyVizComponent } from '@app/components/d3/sankey-viz/sankey-viz.component';
// import { StackedBarVizComponent } from '@app/components/d3/stacked-bar-viz/stacked-bar-viz.component';


@Component({
  standalone: true,
  selector: "app-main-page",
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    VizSectionComponent,
    Visual1Component,
    Visual2Component,
    Visual3Component,
    Visual4Component,
    Visual5Component,
  ],
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent {
  Questions1 = [
    { id: 'A1.1 (★★★)', text: 'To what extent does a high GPA in university correlate with career success?' }
  ];

  Answers1 = [
    { id: 'A1.1 (★★★)', text: 'Students with high GPAs tend to get promoted quicker on average than those with lesser GPAs indicating a positive correlation between academic performance and professional success as the median for each successive group is significantly higher than the last.' }
  ];

  Questions2 = [
    { id: 'A1.2 (★★★)', text: 'What is the impact of academic indicators on starting salary?' },
  ];

  Answers2 = [
    { id: 'A1.2 (★★★)', text: 'Theres no impact' },

  ];

  Questions3 = [
    { id: 'A2.1 (★★★) ', text: 'Can internships, projects and certifications compensate for a less successful academic profile in terms of professional opportunities?' },
    { id: 'A2.4 (★★☆)', text: 'Do different fields of study show distinct patterns in how job offers relate to networking and project completion?' },
  ];


  Answers3 = [
    { id: 'A2.1 (★★★) ', text: 'The scatter plot shows that students with high project completion and networking scores tend to receive more job offers, even across fields where academic GPA may be less emphasized, The color intensity (job offers) often increases with projects completed, suggesting their value regardless of GPA.  This suggests that practical experience and soft skills can make up for a weaker academic profile in terms of employability.' },
    { id: 'A2.4 (★★☆)', text: 'Yes, the visualizations reveal that different fields of study show distinct patterns in how job offers relate to networking and project completion. In Business and Computer Science, students with high scores in both areas tend to receive the most job offers. Arts and Law display more scattered patterns, indicating that other factors might influence employability in these fields. Engineering and Mathematics show a steady trend where project completion has a stronger impact, while Medicine presents a more balanced effect of both variables. Overall, the importance of practical experience and soft skills varies by discipline/field.' },
  ];

  Questions4 = [
    {
      id: 'A1.4 (★★☆)',
      text: 'How do academic indicators influence the average time to promotion?'
    },
    {
      id: 'A4.2 (★★☆)',
      text: 'Is the number of years before a first promotion related to work-life balance satisfaction?'
    }
  ];

  Answers4 = [
    {
      id: 'A1.4 (★★☆)',
      text: 'This box plot shows how the number of years before a first promotion varies across GPA brackets. We observe a clear inverse trend: students with higher university GPAs tend to reach their first promotion significantly faster. The median time to promotion for students with GPAs above 3.5 is approximately 3 years, compared to nearly 5 years for those with GPAs below 2.5. The interquartile ranges also tend to be narrower for higher GPA groups, suggesting more consistent advancement. This suggests that academic excellence not only correlates with career access (as seen in other visuals) but also with faster upward mobility.'
    },
    {
      id: 'A4.2 (★★☆)',
      text: 'While the visualization does not directly plot work-life balance, a cross-reference with other dataset attributes reveals a pattern: individuals who experience quicker promotions tend to report slightly higher satisfaction with work-life balance. This may seem counterintuitive, as rapid promotion can imply greater responsibilities. However, it is possible that high-performing individuals are promoted into more desirable roles that afford them flexibility or satisfaction. Additional visuals or multi-variable analysis would be required to validate this correlation more concretely.'
    }
  ];

  Questions5 = [
    {
      id: "A3.1 (★★★)",
      text: "Do age and gender influence job satisfaction?",
    },
    {
      id: "A3.2 (★★☆)",
      text: "Do demographic variables, such as age and gender, influence starting salary?",
    },
    {
      id: "A3.3 (★☆)",
      text: "Do demographic variables, such as age and gender, influence work-life balance?",
    },
  ];

  Answers5 = [
    {
      id: "A3.1 (★★★)",
      text: "The first graph illustrates variations in initial salary by age and gender. Overall, salaries increase slightly with age but fluctuate more for certain age brackets. We observe distinct trends between men and women, with salary gaps appearing at several points. This suggests that both age and gender impact starting salary, confirming a correlation between demographic variables and income at entry.",
    },
    {
      id: "A3.2 (★★☆)",
      text: "The second graph shows that job satisfaction also varies by age and gender. While both curves follow similar trajectories, men tend to report slightly higher satisfaction at specific ages. The variations in peaks and dips imply that perceived professional satisfaction is indeed influenced by demographic characteristics.",
    },
    {
      id: "A3.3 (★☆)",
      text: "In the third graph, we observe how work-life balance perception shifts with age for both genders. The gap between male and female responses suggests a gendered experience in balancing personal and professional life. Although the correlation is less pronounced than in the other two graphs, it still shows that age and gender have a moderate influence on this aspect of professional well-being.",
    },
  ];
}
