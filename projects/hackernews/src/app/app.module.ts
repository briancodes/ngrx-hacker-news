import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ThemeServiceConfig, THEME_CONFIG } from '@bcodes/ngx-theme-service';
import { NewsModule } from './news/news.module';
import { HNConfigToken, HNConfig } from './shared/hn-config';
import { COMMON_CONSTANTS } from './shared/common.constants';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { appReducer } from './store/reducers/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoryEffects } from './store/effects/story.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AboutModule } from './about/about.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        NewsModule,
        AboutModule,
        StoreModule.forRoot(appReducer, {
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
            },
        }),
        EffectsModule.forRoot([StoryEffects]),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        StoreDevtoolsModule.instrument(),
    ],
    providers: [
        {
            provide: THEME_CONFIG,
            useValue: COMMON_CONSTANTS.themeServiceConfig,
        },
        {
            provide: HNConfigToken,
            useValue: HNConfig,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
