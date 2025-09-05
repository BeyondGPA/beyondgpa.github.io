import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@app/services/theme/theme.service';
import { SeoService } from '@app/services/seo/seo.service';
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

  constructor(
    public themeService: ThemeService, 
    private router: Router,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.updateIcons();
    this.themeService.themeChanged.subscribe(() => {
      this.updateIcons();
    });

    // Update SEO for landing page
    this.seoService.updatePageSeo({
      title: 'BeyondGPA - Education Career Success Analytics | Data Visualization Platform',
      description: 'BeyondGPA is an interactive data visualization platform exploring the relationship between education and career success. Discover insights beyond traditional GPA metrics through advanced analytics and visual storytelling.',
      keywords: 'BeyondGPA, education analytics, career success, data visualization, GPA analysis, educational insights, career development, student success metrics, education data',
      url: '/'
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
