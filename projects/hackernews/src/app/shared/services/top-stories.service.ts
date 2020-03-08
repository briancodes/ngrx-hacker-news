import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HNConfigToken, HNConfigType } from '../hn-config';
import { BaseService } from './base/base.service';

@Injectable({
    providedIn: 'root',
})
export class TopStoriesService extends BaseService<number> {
    constructor(
        httpClient: HttpClient,
        @Inject(HNConfigToken) config: HNConfigType
    ) {
        super(httpClient, config.topStoriesUrl);
    }
}
