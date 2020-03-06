import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';

export enum ServiceState {
    initial = 'initial',
    loading = 'loading',
    error = 'error',
    success = 'success',
}
export interface ServiceData<T = any> {
    state: ServiceState;
    items: T[];
}

export abstract class BaseItemsService<T = any> implements OnDestroy {
    protected apiSubject = new Subject<ReadonlyArray<number>>();
    protected destroyed$ = new Subject();

    private data = new BehaviorSubject<ServiceData<T>>({
        state: ServiceState.initial,
        items: [],
    });

    data$ = this.data.asObservable();

    constructor(protected httpClient: HttpClient, protected url: string) {
        this.setupSubscription();
    }

    callAPI(ids: ReadonlyArray<number>) {
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
                        return this.httpClient.get<T>(
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

    protected processLoading() {
        this.emit({ state: ServiceState.loading });
    }

    protected processSuccess(data) {
        this.emit({
            state: ServiceState.success,
            items: data,
        });
    }

    protected processError(error?: HttpErrorResponse) {
        this.emit({ state: ServiceState.error });
    }

    private emit(update: Partial<ServiceData>) {
        this.data.next({
            ...this.currentData,
            ...update,
        });
    }

    private get currentData(): ServiceData<T> {
        return this.data.value;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
    }
}
