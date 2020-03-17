import { createAction, props } from '@ngrx/store';
import { Story } from '../../shared/services';

// Top Stories
export const loadTopStories = createAction('[Story] loadTopStories');
export const topStoriesLoading = createAction('[Story] topStoriesLoading');
export const topStoriesSuccess = createAction(
    '[Story] topStoriesSuccess',
    props<{ ids: number[] }>()
);
export const topStoriesFailure = createAction(
    '[Story] topStoriesFailure',
    props<{ error: string }>()
);

// Story Items
export const loadStoryItems = createAction(
    '[Story] loadStoryItems',
    props<{ count: number }>()
);
export const storyItemsLoading = createAction('[Story] storyItemsLoading');
export const storyItemsSuccess = createAction(
    '[Story] storyItemsSuccess',
    props<{ items: Story[] }>()
);
export const storyItemsFailure = createAction(
    '[Story] storyItemsFailure',
    props<{ error: string }>()
);

// Update stories to display
export const updateTopStoriesToDisplay = createAction(
    '[Story] updateTopStoriesToDisplay',
    props<{ ids: ReadonlyArray<number> }>()
);
