import { createReducer, on } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { ServiceState, Story } from '../../shared/services';
import { StoryActions } from '../actions';
import { initialStoryState, IStoryState } from '../state/story.state';

const keyById = fp.keyBy<Story>('id');

export const storyReducer = createReducer<IStoryState>(
    initialStoryState,
    // Top Story IDs
    on(StoryActions.topStoriesLoading, state => {
        return {
            ...state,
            topStoriesServiceState: ServiceState.loading,
        };
    }),
    on(StoryActions.topStoriesSuccess, (state, { ids }) => {
        return {
            ...state,
            topStoryIds: ids,
            topStoriesServiceState: ServiceState.success,
        };
    }),
    on(StoryActions.topStoriesFailure, (state, { error }) => {
        return {
            ...state,
            topStoriesServiceState: ServiceState.error,
        };
    }),
    // Story Items
    on(StoryActions.storyItemsLoading, state => {
        return {
            ...state,
            storyItemsServiceState: ServiceState.loading,
        };
    }),
    on(StoryActions.storyItemsSuccess, (state, { items }) => {
        return {
            ...state,
            storyItems: { ...state.storyItems, ...keyById(items) },
            storyItemsServiceState: ServiceState.success,
        };
    }),
    on(StoryActions.storyItemsFailure, (state, { error }) => {
        return {
            ...state,
            storyItemsServiceState: ServiceState.error,
        };
    }),
    // Update displayed stories
    on(StoryActions.updateTopStoriesToDisplay, (state, { ids }) => {
        return {
            ...state,
            topStoriesToDisplay: ids,
        };
    })
);
