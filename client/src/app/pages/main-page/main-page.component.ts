import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { collapseExpandAnimation } from 'src/assets/animations/CollapseExpand';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [CommonModule],
  animations: [collapseExpandAnimation]
})
export class MainPageComponent {

}
