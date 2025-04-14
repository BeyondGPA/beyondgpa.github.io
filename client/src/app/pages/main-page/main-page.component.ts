import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { VizSectionComponent } from "../../components/viz-section/viz-section.component";
import { Visual1Component } from "@app/components/d3/visual-1/visual-1.component";
import { Visual2Component } from "@app/components/d3/visual-2/visual-2.component";
import { Visual3Component } from "@app/components/d3/visual-3/visual-3.component";
import { Visual4Component } from "@app/components/d3/visual-4/visual-4.component";
import { Visual5Component } from "@app/components/d3/visual-5/visual-5.component";
import { Visual6Component } from "@app/components/d3/visual-6/visual-6.component";
// import { ScatterVizComponent } from '@app/components/d3/scatter-viz/scatter-viz.component';
// import { SankeyVizComponent } from '@app/components/d3/sankey-viz/sankey-viz.component';
// import { StackedBarVizComponent } from '@app/components/d3/stacked-bar-viz/stacked-bar-viz.component';

@Component({
  standalone: true,
  selector: "app-main-page",
  imports: [
    CommonModule,
    HeaderComponent,
    VizSectionComponent,
    Visual1Component,
    Visual2Component,
    Visual3Component,
    Visual4Component,
    Visual5Component,
    Visual6Component,
  ],
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent {
  Questions1 = [
    {
      id: "A1.1 (★★★)",
      text: "Dans quelle mesure un GPA élevé à l’université corrèle avec un succès dans leur carrière ?",
    },
  ];

  Answers1 = [
    {
      id: "A1.1 (★★★)",
      text: "Les étudiants avec un GPA élevé tendent à obtenir un salaire de départ plus élevé et plus d’offres d’emploi, indiquant une corrélation positive entre performance académique et réussite professionnelle.",
    },
  ];

  Questions2 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Answers2 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Questions3 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Answers3 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Questions4 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Answers4 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Questions5 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Answers5 = [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];

  Questions6 = [
    {
      id: "A3.1 (★★★)",
      text: "Existe-t-il des différences dans les résultats professionnels selon le domaine d’études choisi ",
    },
    {
      id: "A3.2 (★★☆) ",
      text: "Les variables démographiques, telles que l’âge et le genre, influencent t-elles le salaire initial?",
    },
    {
      id: "A3.3 (★☆) s",
      text: "Les variables démographiques, telles que l’âge et le genre, influencent t-elles la performance académique?",
    },
  ];

  Answers6= [
    { id: "", text: "" },
    { id: "", text: "" },
    { id: "", text: "" },
  ];
}
