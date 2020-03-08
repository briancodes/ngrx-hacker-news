import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ThemeService, THEME_CONFIG } from '@bcodes/ngx-theme-service';
import { take } from 'rxjs/operators';
import { COMMON_CONSTANTS } from '../../shared/common.constants';
import { HNConfig, HNConfigToken, HNConfigType } from '../../shared/hn-config';
import {
    ServiceState,
    Story,
    StoryItemsService,
    TopStoriesService,
} from '../../shared/services';
import { NewsContainerComponent } from './news-container.component';

// Note: story request count of 5
const TEST_CONFIG: HNConfigType = {
    ...HNConfig,
    storyRequestCount: 5,
};

const generateStoryIDs = (count: number) => {
    return Array(count)
        .fill(0)
        .map((v, i) => i + 1);
};

const generateStories = (ids: number[]): Story[] => {
    return ids.map(
        id =>
            ({
                id,
                title: `title ${id}`,
            } as Story)
    );
};

const getControllerItemRequests = (controller: HttpTestingController) => (
    ids: number[]
) => {
    const requests = ids
        .map(id => TEST_CONFIG.itemUrl.replace('{id}', '' + id))
        .map(expectedUrl => {
            return controller.expectOne(expectedUrl);
        });
    return requests;
};

describe('NewsContainerComponent', () => {
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
                { provide: HNConfigToken, useValue: TEST_CONFIG },
            ],
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        topService = TestBed.inject(TopStoriesService);
        itemsService = TestBed.inject(StoryItemsService);
    }));

    it('should successfully load the stories in batches', () => {
        const fixture = TestBed.createComponent(NewsContainerComponent);
        const { componentInstance, debugElement } = fixture;
        fixture.detectChanges();

        const topStoriesRequest = httpTestingController.expectOne(
            TEST_CONFIG.topStoriesUrl
        );

        // Initial loading state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.loading);
        });
        // Initial empty stories
        componentInstance.storyItems$.pipe(take(1)).subscribe(items => {
            expect(items.length).toEqual(0);
        });

        const getItemRequests = getControllerItemRequests(
            httpTestingController
        );

        const ids = generateStoryIDs(8);
        topStoriesRequest.flush(ids);

        // *****************
        // Batch 1
        const idsBatch1 = ids.slice(0, 5);
        const requestsBatch1 = getItemRequests(idsBatch1);
        expect(requestsBatch1.length).toEqual(5);

        fixture.detectChanges();

        // Still in loading state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.loading);
        });

        // Flush the responses
        const responsesBatch1 = generateStories(idsBatch1);
        requestsBatch1.forEach((req, i) => {
            req.flush(responsesBatch1[i]);
        });

        // Stories should have loaded
        componentInstance.storyItems$.pipe(take(1)).subscribe(items => {
            expect(items.length).toEqual(5);
        });

        // Expect success state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.success);
        });

        httpTestingController.verify();

        // ********
        // Batch 2

        // Trigger load more stories
        componentInstance.handleLoadMore();

        const idsBatch2 = ids.slice(5);
        const requestsBatch2 = getItemRequests(idsBatch2);
        expect(requestsBatch2.length).toEqual(3);

        fixture.detectChanges();

        // Should be in a loading state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.loading);
        });

        // Flush the responses
        const responsesBatch2 = generateStories(idsBatch2);
        requestsBatch2.forEach((req, i) => {
            req.flush(responsesBatch2[i]);
        });

        // Expect success state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.success);
        });

        // Stories should have loaded
        componentInstance.storyItems$.pipe(take(1)).subscribe(items => {
            expect(items.length).toEqual(8);
        });

        httpTestingController.verify();
    });

    it('should be in error state if any story API calls fail', () => {
        const fixture = TestBed.createComponent(NewsContainerComponent);
        const { componentInstance, debugElement } = fixture;
        fixture.detectChanges();

        const topStoriesRequest = httpTestingController.expectOne(
            TEST_CONFIG.topStoriesUrl
        );

        // Initial loading state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.loading);
        });
        // Initial empty stories
        componentInstance.storyItems$.pipe(take(1)).subscribe(items => {
            expect(items.length).toEqual(0);
        });

        const getItemRequests = getControllerItemRequests(
            httpTestingController
        );

        const ids = generateStoryIDs(8);
        topStoriesRequest.flush(ids);

        // *****************
        // Batch 1
        const idsBatch1 = ids.slice(0, 5);
        const requestsBatch1 = getItemRequests(idsBatch1);
        expect(requestsBatch1.length).toEqual(5);

        fixture.detectChanges();

        // Still in loading state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.loading);
        });

        // Flush the responses
        const responsesBatch1 = generateStories(idsBatch1);
        // Error check
        requestsBatch1[0].flush(responsesBatch1[0]);
        requestsBatch1[1].flush(responsesBatch1[1]);
        requestsBatch1[2].flush(
            { errorMessage: 'err' },
            { status: 400, statusText: 'API Error' }
        );

        // Stories should have loaded
        componentInstance.storyItems$.pipe(take(1)).subscribe(items => {
            expect(items.length).toEqual(0);
        });

        // Expect error state
        componentInstance.viewState$.pipe(take(1)).subscribe(serviceState => {
            expect(serviceState).toEqual(ServiceState.error);
        });
    });
});
