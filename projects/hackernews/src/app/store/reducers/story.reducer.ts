import { createReducer, on } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { ServiceState, Story } from '../../shared/services';
import * as StoryActions from '../actions/story.actions';
import { initialStoryState, IStoryState } from '../state/story.state';

const keyById = fp.keyBy<Story>('id');

export const storyReducer = createReducer<IStoryState>(
    initialStoryState,
    on(StoryActions.loadTopStoriesSuccess, (state, { ids }) => {
        return {
            ...state,
            topStories: ids,
            topStoriesServiceState: ServiceState.success,
        };
    }),
    on(StoryActions.loadTopStoriesFailure, (state, { error }) => {
        return {
            ...state,
            topStoriesServiceState: ServiceState.error,
        };
    }),
    on(StoryActions.loadStoryItemsSuccess, (state, { items }) => {
        return {
            ...state,
            storyItems: { ...state.storyItems, ...keyById(items) },
            storyItemsServiceState: ServiceState.success,
        };
    }),
    on(StoryActions.loadStoryItemsFailure, (state, { error }) => {
        return {
            ...state,
            storyItemsServiceState: ServiceState.error,
        };
    })
);
