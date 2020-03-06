import { NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// @see https://netbasal.com/optimizing-angular-change-detection-triggered-by-dom-events-d2a3b2e11d87
export const runOutsideZone = <T>(zone: NgZone) => {
    return (source: Observable<T>) => {
        return new Observable<T>(observer => {
            let sub: Subscription;
            zone.runOutsideAngular(() => {
                sub = source.subscribe(observer);
            });
            return sub;
        });
    };
};

export const RXJS_UTILS = {
    runOutsideZone,
};
