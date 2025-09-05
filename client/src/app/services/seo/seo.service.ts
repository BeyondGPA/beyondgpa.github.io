import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  updateOgTags(url: string, title: string, description: string, image: string) {
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
  }

  updateTwitterTags(url: string, title: string, description: string, image: string) {
    this.meta.updateTag({ property: 'twitter:url', content: url });
    this.meta.updateTag({ property: 'twitter:title', content: title });
    this.meta.updateTag({ property: 'twitter:description', content: description });
    this.meta.updateTag({ property: 'twitter:image', content: image });
  }

  updateCanonical(url: string) {
    // Remove existing canonical link if any
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
    
    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  // Method to update all SEO tags for a specific page
  updatePageSeo(pageConfig: {
    title: string;
    description: string;
    keywords: string;
    url: string;
    image?: string;
  }) {
    const baseUrl = 'https://beyondgpa.github.io';
    const fullUrl = `${baseUrl}${pageConfig.url}`;
    const imageUrl = pageConfig.image || `${baseUrl}/assets/beyondGPA.png`;

    this.updateTitle(pageConfig.title);
    this.updateDescription(pageConfig.description);
    this.updateKeywords(pageConfig.keywords);
    this.updateCanonical(fullUrl);
    this.updateOgTags(fullUrl, pageConfig.title, pageConfig.description, imageUrl);
    this.updateTwitterTags(fullUrl, pageConfig.title, pageConfig.description, imageUrl);
  }
}
