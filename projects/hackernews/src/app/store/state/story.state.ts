import { Story, ServiceState } from '../../shared/services';

export interface IStoryState {
    topStories: ReadonlyArray<number>;
    storyItems: { [key: number]: Story };
    topStoryDisplayCount: number;
    topStoriesServiceState: ServiceState;
    storyItemsServiceState: ServiceState;
}

export const initialStoryState: IStoryState = {
    topStories: [],
    storyItems: {},
    topStoryDisplayCount: 0,
    topStoriesServiceState: ServiceState.initial,
    storyItemsServiceState: ServiceState.initial,
};
