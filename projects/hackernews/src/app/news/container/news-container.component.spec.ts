import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeService, THEME_CONFIG } from '@bcodes/ngx-theme-service';
import { COMMON_CONSTANTS } from '../../shared/common.constants';
import { HNConfig, HNConfigToken } from '../../shared/hn-config';
import { StoryItemsService, TopStoriesService } from '../../shared/services';
import { NewsContainerComponent } from './news-container.component';

describe('NewsContainerComponent', () => {
    let component: NewsContainerComponent;
    let fixture: ComponentFixture<NewsContainerComponent>;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let topService: TopStoriesService;
    let itemsService: StoryItemsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [NewsContainerComponent],
            providers: [
                {
                    provide: THEME_CONFIG,
                    useValue: COMMON_CONSTANTS.themeServiceConfig,
                },
                ThemeService,
                { provide: HNConfigToken, useValue: HNConfig },
            ],
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        topService = TestBed.inject(TopStoriesService);
        itemsService = TestBed.inject(StoryItemsService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewsContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
