import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HNConfigToken, HNConfigType } from '../hn-config';
import { BaseItemsService } from './base/base-items.service';

export interface Story {
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
}

@Injectable({
    providedIn: 'root',
})
export class StoryItemsService extends BaseItemsService<Story> {
    constructor(
        httpClient: HttpClient,
        @Inject(HNConfigToken) config: HNConfigType
    ) {
        super(httpClient, config.itemUrl);
    }
}
