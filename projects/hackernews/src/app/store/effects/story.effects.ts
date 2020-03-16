import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { StoryItemsService, TopStoriesService } from '../../shared/services';
import { StoryActions } from '../actions';
import { IAppState } from '../state/app.state';

@Injectable()
export class StoryEffects {
    loadTopStories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StoryActions.loadTopStories),
            switchMap(() => {
                this.store$.dispatch(StoryActions.topStoriesLoading());

                return this.topStoriesService.getTopStories().pipe(
                    map(ids => {
                        return StoryActions.topStoriesSuccess({ ids });
                    }),
                    catchError(error => {
                        return of(StoryActions.topStoriesFailure({ error }));
                    })
                );
            })
        )
    );

    loadStoryItems$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StoryActions.loadStoryItems),
            withLatestFrom(this.store$), // should use a selector
            switchMap(([{ count }, { stories: storiesState }]) => {
                this.store$.dispatch(StoryActions.storyItemsLoading());

                const ids = storiesState.topStoryIds.slice(0, count);
                // Only get the Story items we don't already have
                const idsToFetch = ids.filter(id => {
                    return !storiesState.storyItems[id];
                });
                return this.storyItemsService.getStoryItems(idsToFetch).pipe(
                    map(items => {
                        this.store$.dispatch(
                            StoryActions.updateTopStoriesToDisplay({
                                ids,
                            })
                        );
                        return StoryActions.storyItemsSuccess({
                            items,
                        });
                    }),
                    catchError(error => {
                        return of(StoryActions.storyItemsFailure({ error }));
                    })
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private store$: Store<IAppState>,
        private topStoriesService: TopStoriesService,
        private storyItemsService: StoryItemsService
    ) {}
}
