import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StoryActions } from '../actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { TopStoriesService } from '../../shared/services';
import { of } from 'rxjs';

@Injectable()
export class StoryEffects {
    loadTopStories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StoryActions.loadTopStories),
            switchMap(() => {
                return this.topStoriesService.getTopStories().pipe(
                    map(ids => {
                        return StoryActions.loadTopStoriesSuccess({ ids });
                    }),
                    catchError(error => {
                        return of(
                            StoryActions.loadTopStoriesFailure({ error })
                        );
                    })
                );
            })
        )
    );

    // loadStoryItems$ = createEffect(() => {})
    // withLatestFrom(store.pipe(select(getUserName)))

    constructor(
        private actions$: Actions,
        private topStoriesService: TopStoriesService
    ) {}
}
