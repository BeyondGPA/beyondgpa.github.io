import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter } from '@angular/router';
import { AppComponent } from '@app/components/app/app.component';
import { AboutPageComponent } from '@app/pages/about-page/about-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { LandingPageComponent } from '@app/pages/landing-page/landing-page.component';

const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'home', component: MainPageComponent },
    { path: 'about', component: AboutPageComponent },
    { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), provideRouter(routes), provideAnimations()],
})
