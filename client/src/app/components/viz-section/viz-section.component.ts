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
  @Input() title!: string;
  @Input() description!: string;
  @Input() vizId!: string;
}