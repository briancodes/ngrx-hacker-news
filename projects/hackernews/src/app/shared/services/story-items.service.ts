import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HNConfigToken, HNConfigType } from '../hn-config';
import { BaseService } from './base/base.service';
import { tap, map, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

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
export class StoryItemsService extends BaseService<Story, number[]> {
    constructor(
        httpClient: HttpClient,
        @Inject(HNConfigToken) config: HNConfigType
    ) {
        super(httpClient, config.itemUrl);
    }

    callAPI(ids: number[]) {
        this.apiSubject.next(ids);
    }

    protected setupSubscription() {
        this.apiSubject
            .pipe(
                tap(_ => {
                    this.processLoading();
                }),
                map(ids => {
                    return ids.map(id => {
                        return this.httpClient.get<Story>(
                            this.url.replace('{id}', '' + id)
                        );
                    });
                }),
                switchMap(obs => {
                    return forkJoin(obs).pipe(
                        tap(data => {
                            this.processSuccess(data);
                        }),
                        catchError(error => {
                            this.processError(error);
                            return of(error);
                        })
                    );
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }
}
