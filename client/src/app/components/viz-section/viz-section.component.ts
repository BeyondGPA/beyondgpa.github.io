import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-viz-section',
  imports: [CommonModule],
  templateUrl: './viz-section.component.html',
  styleUrls: ['./viz-section.component.scss']
})
export class VizSectionComponent {
  @Input() sectionId!: string;
  @Input() section!: string;
  @Input() description!: string;
  @Input() vizId!: string;
  @Input() questions!: { id: string, text: string }[];
  @Input() answers!: { id: string, text: string }[];
}