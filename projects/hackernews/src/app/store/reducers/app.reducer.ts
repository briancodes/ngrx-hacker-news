import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { routerReducer } from '@ngrx/router-store';
import { storyReducer } from './story.reducer';

export const appReducer: ActionReducerMap<IAppState> = {
    router: routerReducer,
    stories: storyReducer,
};
