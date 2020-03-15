import { createAction, props } from '@ngrx/store';
import { Story } from '../../shared/services';

// Top Stories
export const loadTopStories = createAction('[Story] loadTopStories');
export const loadTopStoriesSuccess = createAction(
    '[Story] loadTopStoriesSuccess',
    props<{ ids: number[] }>()
);
export const loadTopStoriesFailure = createAction(
    '[Story] loadTopStoriesFailure',
    props<{ error: string }>()
);

// Story Items
export const loadStoryItems = createAction(
    '[Story] loadStoryItems',
    props<{ count: number }>()
);
export const loadStoryItemsSuccess = createAction(
    '[Story] loadStoryItemsSuccess',
    props<{ items: Story[] }>()
);
export const loadStoryItemsFailure = createAction(
    '[Story] loadStoryItemsFailure',
    props<{ error: string }>()
);
