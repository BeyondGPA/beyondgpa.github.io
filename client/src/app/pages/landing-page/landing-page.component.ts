import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@app/services/theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LandingPageComponent {
  iconSrc: string;
  hoverIconSrc: string;
  isHovered = false;
  isLoading = false;

  constructor(public themeService: ThemeService, private router: Router) {}

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


  navigateWithDelay() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/home']);
    }, 1500);
  }
}
