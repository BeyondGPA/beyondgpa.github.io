import { Component, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '@app/services/theme/theme.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LandingPageComponent {
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
