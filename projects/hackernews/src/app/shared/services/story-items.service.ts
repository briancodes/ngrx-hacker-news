import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { HNConfigToken, HNConfigType } from '../hn-config';

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
export class StoryItemsService {
    constructor(
        private httpClient: HttpClient,
        @Inject(HNConfigToken) private config: HNConfigType
    ) {}

    getStoryItems(ids: number[]): Observable<Story[]> {
        const obs = ids.map(id => {
            return this.httpClient.get<Story>(
                this.config.itemUrl.replace('{id}', '' + id)
            );
        });
        return forkJoin(obs);
    }
}
