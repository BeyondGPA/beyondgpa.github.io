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
  hoverIconSrc: string;
  isHovered = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.updateIcons();
    this.themeService.themeChanged.subscribe(() => {
      this.updateIcons();
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  updateIcons() {
    const isDarkMode = this.themeService.getCurrentTheme() === 'dark';
    this.iconSrc = isDarkMode ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
    this.hoverIconSrc = isDarkMode ? 'assets/icons/sun_hover.svg' : 'assets/icons/moon_hover.svg';
  }
}
