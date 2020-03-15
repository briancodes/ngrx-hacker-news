import { RouterReducerState } from '@ngrx/router-store';
import { IStoryState, initialStoryState } from './story.state';

export interface IAppState {
    router?: RouterReducerState;
    stories: IStoryState;
}

export const initialAppState: IAppState = {
    stories: initialStoryState,
};

export const getInitialAppState = (): IAppState => {
    return initialAppState;
};
