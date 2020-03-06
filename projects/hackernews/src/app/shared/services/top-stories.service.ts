import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { HNConfigToken, HNConfigType } from '../hn-config';
import { BaseItemsService, ServiceState } from './base/base-items.service';

@Injectable({
    providedIn: 'root',
})
export class TopStoriesService extends BaseItemsService<number> {
    constructor(
        httpClient: HttpClient,
        @Inject(HNConfigToken) config: HNConfigType
    ) {
        super(httpClient, config.topStoriesUrl);
    }

    callAPI() {
        this.apiSubject.next();
    }

    protected setupSubscription() {
        this.apiSubject
            .pipe(
                tap(_ => {
                    this.processLoading();
                }),
                switchMap(_ => {
                    return this.httpClient.get<number[]>(this.url).pipe(
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
