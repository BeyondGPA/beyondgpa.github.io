import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@app/services/theme/theme.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  iconSrc: string;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.updateIcon();
    this.themeService.themeChanged.subscribe(() => {
      this.updateIcon();
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  updateIcon() {
    this.iconSrc = this.themeService.getCurrentTheme() === 'dark' ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
  }
}