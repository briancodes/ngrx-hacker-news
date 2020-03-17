import { Story, ServiceState } from '../../shared/services';

export interface IStoryState {
    topStoryIds: ReadonlyArray<number>;
    topStoriesToDisplay: ReadonlyArray<number>;
    storyItems: { [key: number]: Story };
    topStoriesServiceState: ServiceState;
    storyItemsServiceState: ServiceState;
}

export const initialStoryState: IStoryState = {
    topStoryIds: [],
    topStoriesToDisplay: [],
    storyItems: {},
    topStoriesServiceState: ServiceState.initial,
    storyItemsServiceState: ServiceState.initial,
};
