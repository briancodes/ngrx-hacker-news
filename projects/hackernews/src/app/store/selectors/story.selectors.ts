import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { IStoryState } from '../state/story.state';

const storyState = (state: IAppState) => state.stories;

export const selectTopStoryIds = createSelector(
    storyState,
    (state: IStoryState) => state.topStoryIds
);

export const selectStoryItems = createSelector(
    storyState,
    (state: IStoryState) => state.storyItems
);

export const selectStoriesToDisplay = createSelector(
    storyState,
    selectStoryItems,
    (state: IStoryState, storyItems) =>
        state.topStoriesToDisplay.map(id => storyItems[id])
);

// Service State e.g. loading/error
export const selectTopStoriesServiceState = createSelector(
    storyState,
    state => state.topStoriesServiceState
);
export const selectStoryItemsServiceState = createSelector(
    storyState,
    state => state.storyItemsServiceState
);
