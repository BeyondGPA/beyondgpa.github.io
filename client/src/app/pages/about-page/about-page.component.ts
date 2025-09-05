import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SeoService } from '@app/services/seo/seo.service';

@Component({
  standalone: true,
  selector: 'app-about-page',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    // Update SEO for about page
    this.seoService.updatePageSeo({
      title: 'About BeyondGPA - Education Analytics Team | Data Visualization Project',
      description: 'Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.',
      keywords: 'BeyondGPA team, education research, data visualization team, academic analytics, career success research, student success metrics, about us',
      url: '/about'
    });
  }
}