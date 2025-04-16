import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viz-transition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viz-transition.component.html',
  styleUrls: ['./viz-transition.component.scss']
})
export class VizTransitionComponent {
  @Input() title: string = '';
  @Input() text: string[] = [];
}
