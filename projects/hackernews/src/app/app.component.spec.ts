import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NewsModule } from './news/news.module';
import { THEME_CONFIG, ThemeService } from '@bcodes/ngx-theme-service';
import { COMMON_CONSTANTS } from './shared/common.constants';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, SharedModule, NewsModule],
            declarations: [AppComponent],
            providers: [
                {
                    provide: THEME_CONFIG,
                    useValue: COMMON_CONSTANTS.themeServiceConfig,
                },
                ThemeService,
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
