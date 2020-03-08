import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { combineLatest, Subject, BehaviorSubject } from 'rxjs';
import {
    filter,
    map,
    scan,
    shareReplay,
    takeUntil,
    tap,
    take,
} from 'rxjs/operators';
import { HNConfigToken, HNConfigType } from '../../shared/hn-config';
import {
    ServiceData,
    ServiceState,
    Story,
    StoryItemsService,
    TopStoriesService,
} from '../../shared/services';

// Viewstate helper functions
const anyStateEquals = (serviceState: ServiceState) => (
    ...arr: ServiceData[]
) => {
    return arr.some(({ state }) => state === serviceState);
};
const anyLoading = anyStateEquals(ServiceState.loading);
const anyError = anyStateEquals(ServiceState.error);

const determineViewState = (serviceDataArr: ServiceData[]) => {
    if (anyLoading(...serviceDataArr)) {
        return ServiceState.loading;
    }
    if (anyError(...serviceDataArr)) {
        return ServiceState.error;
    }
    return ServiceState.success;
};

const isSuccess = ({ state }: ServiceData) => state === ServiceState.success;

@Component({
    selector: 'app-news-container',
    template: `
        <app-header (refresh)="handleRefersh()"></app-header>
        <app-top-stories
            [items]="storyItems$ | async"
            (loadMore)="handleLoadMore()"
        ></app-top-stories>
        <app-message [state]="viewState$ | async"></app-message>
    `,
    styleUrls: ['./news-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsContainerComponent implements OnInit, OnDestroy {
    storyItems$ = new BehaviorSubject<Story[]>([]);
    private destroyed$ = new Subject();

    /* Optional boolean true to indicate a page refresh */
    private loadMore$ = new Subject<boolean | undefined>();

    viewState$ = combineLatest([
        this.topStoriesService.data$,
        this.itemsService.data$,
    ]).pipe(map(determineViewState), shareReplay(1));

    constructor(
        @Inject(HNConfigToken) private config: HNConfigType,
        private topStoriesService: TopStoriesService,
        private itemsService: StoryItemsService
    ) {}

    ngOnInit(): void {
        this.servcieDataSubscribe();
        this.loadMoreSubscribe();
        this.handleRefersh();
    }

    handleLoadMore() {
        this.viewState$
            .pipe(
                tap(state => {
                    if (state === ServiceState.success) {
                        this.loadMore$.next();
                    }
                }),
                take(1)
            )
            .subscribe();
    }

    handleRefersh() {
        this.topStoriesService.callAPI();
    }

    private servcieDataSubscribe() {
        this.topStoriesService.data$
            .pipe(
                tap(_ => {
                    this.storyItems$.next([]);
                }),
                filter(isSuccess),
                tap(_ => {
                    this.loadMore$.next(true);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();

        this.itemsService.data$
            .pipe(
                filter(isSuccess),
                tap(data => {
                    this.storyItems$.next([
                        ...this.storyItems$.value,
                        ...data.items,
                    ]);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    private loadMoreSubscribe() {
        const initialAcc = {
            page: 0,
            isRefresh: true,
            serviceData: {} as ServiceData,
        };
        type Accumulator = typeof initialAcc;
        combineLatest([this.loadMore$, this.topStoriesService.data$])
            .pipe(
                filter(([_, serviceData]) => isSuccess(serviceData)),
                // Use a scan (like a reducer) to keep track of current page load number
                scan<any, Accumulator>((acc, [isRefresh, serviceData]) => {
                    const page = isRefresh ? 1 : acc.page + 1;
                    return {
                        page,
                        isRefresh,
                        serviceData,
                    };
                }, initialAcc),
                map(({ page, serviceData }) => {
                    const ids = this.getRequestIDs(serviceData.items, page);
                    if (ids.length > 0) {
                        this.itemsService.callAPI(ids);
                    }
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    private getRequestIDs(ids: number[], page: number): number[] {
        const reqAmount = this.config.storyRequestCount;
        return ids.slice((page - 1) * reqAmount, page * reqAmount);
    }

    ngOnDestroy() {
        this.destroyed$.next();
    }
}
