import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HNConfigToken, HNConfigType } from '../hn-config';

@Injectable({
    providedIn: 'root',
})
export class TopStoriesService {
    constructor(
        private httpClient: HttpClient,
        @Inject(HNConfigToken) private config: HNConfigType
    ) {}

    getTopStories(): Observable<number[]> {
        return this.httpClient.get<number[]>(this.config.topStoriesUrl);
    }
}
