import { InjectionToken } from '@angular/core';

export const HNConfig = {
    topStoriesUrl: 'https://hacker-news.firebaseio.com/v0/topstories.json',
    itemUrl: 'https://hacker-news.firebaseio.com/v0/item/{id}.json',
    storyRequestCount: 10,
};

export type HNConfigType = typeof HNConfig;

export const HNConfigToken = new InjectionToken<HNConfigType>('HNConfigToken');
