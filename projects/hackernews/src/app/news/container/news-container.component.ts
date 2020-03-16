import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, shareReplay, filter, tap, takeUntil, take } from 'rxjs/operators';
import { HNConfigToken, HNConfigType } from '../../shared/hn-config';
import { ServiceState, Story } from '../../shared/services';
import { IAppState } from '../../store/state/app.state';
import { StorySelectors } from '../../store/selectors';
import { StoryActions } from '../../store/actions';

// Viewstate helper functions
const anyStateEquals = (serviceState: ServiceState) => (
    arr: ServiceState[]
) => {
    return arr.some(state => state === serviceState);
};
const anyLoading = anyStateEquals(ServiceState.loading);
const anyError = anyStateEquals(ServiceState.error);

const determineViewState = (states: ServiceState[]) => {
    if (anyLoading(states)) {
        return ServiceState.loading;
    }
    if (anyError(states)) {
        return ServiceState.error;
    }
    return ServiceState.success;
};

const isSuccess = (state: ServiceState) => state === ServiceState.success;

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
    storyItems$ = this.store.pipe(
        select(StorySelectors.selectStoriesToDisplay)
    );

    viewState$ = combineLatest([
        this.store.pipe(select(StorySelectors.selectTopStoriesServiceState)),
        this.store.pipe(select(StorySelectors.selectStoryItemsServiceState)),
    ]).pipe(
        map(determineViewState),
        tap(ss => {
            this.loadingEnabled = isSuccess(ss);
        }),
        shareReplay(1)
    );

    private destroyed$ = new Subject();

    private pageCount = 1;

    private loadingEnabled: boolean;

    constructor(
        @Inject(HNConfigToken) private config: HNConfigType,
        private store: Store<IAppState>
    ) {}

    ngOnInit(): void {
        this.loadTopStories();
        this.store
            .pipe(
                select(StorySelectors.selectTopStoriesServiceState),
                filter(isSuccess),
                tap(() => {
                    this.loadMoreStories(true);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    handleLoadMore() {
        if (!this.loadingEnabled) {
            return;
        }
        this.loadMoreStories();
    }

    loadMoreStories(isRefresh = false) {
        const count = isRefresh
            ? this.pageCount * this.config.storyRequestCount
            : ++this.pageCount * this.config.storyRequestCount;
        this.loadStoryItems(count);
    }

    handleRefersh() {
        this.loadTopStories();
    }

    private loadTopStories() {
        this.store.dispatch(StoryActions.loadTopStories());
    }

    private loadStoryItems(count: number) {
        this.store.dispatch(
            StoryActions.loadStoryItems({
                count,
            })
        );
    }

    ngOnDestroy() {
        this.destroyed$.next();
    }
}
