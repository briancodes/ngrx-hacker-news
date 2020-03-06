import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ThemeServiceConfig, THEME_CONFIG } from '@bcodes/ngx-theme-service';
import { NewsModule } from './news/news.module';
import { HNConfigToken, HNConfig } from './shared/hn-config';

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
    imports: [HttpClientModule, BrowserModule, AppRoutingModule, NewsModule],
    providers: [
        {
            provide: THEME_CONFIG,
            useValue: themeServiceConfig,
        },
        {
            provide: HNConfigToken,
            useValue: HNConfig,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
