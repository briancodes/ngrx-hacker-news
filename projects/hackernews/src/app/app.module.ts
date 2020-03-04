import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ThemeServiceConfig, THEME_CONFIG } from '@bcodes/ngx-theme-service';

const themeServiceConfig: ThemeServiceConfig = {
  themes: ['light', 'dark'],
  defaultTheme: 'light',
  transitionConfig: {
    className: 'theme-transition',
    duration: 1500,
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    {
      provide: THEME_CONFIG,
      useValue: themeServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
