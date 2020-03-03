import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, identity, merge, Observable, Subject } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { RXJS_UTILS } from '../utils/rxjs.utils';

const EVENT_TARGETS = {
  window,
  document,
};

/**
 * Subscribe to multiple `docuemnt` and `window` events. All events are
 * emitted via a single EventEmitter `bcGlobalEvent`. Check for the event type
 * with the `Event.type` property in the handler.
 *
 * An Rxjs `throttleTime` of `bcGlobalThrottle` ms can be applied (disable by
 * setting to 0). Usually for `resize` a debounce would be used, but `throttleTime`
 * allows for more accurate first event timings when mixing `resize` and `mousedown` for example, as a
 * config of `{leading:true, trailing:true}` is used.
 *
 * Events can be subscribed to outside of the Angular zone to prevent change detection
 * cycles (e.g. there can be dozens for scroll and resize per second) - enable with `bcGlobalRunOutside`.
 * If enabled use `ngZone.run(()=> doSomething(event))` to trigger change detection in the event handler.
 *
 * #### Usage Example
 * ```html
 * <div
 *     [bcGlobalListeners]="[
 *           'window:resize',
 *           'window:scroll',
 *           'document:touchstart',
 *           'document:mousedown'
 *       ]"
 *       (bcGlobalEvent)="onRunOutsideEvent($event)"
 *       [bcGlobalThrottle]="100"
 *       [bcGlobalRunOutside]="true"
 * ></div>
 * ```
 */
@Directive({
  selector: '[bcGlobalListeners]',
})
export class GlobalListenersDirective implements OnDestroy, OnInit {
  /** Array of 'window' and 'document' events in the  form `'target:event'` */
  @Input() bcGlobalListeners: ReadonlyArray<string> = []; // e.g ['window:resize', 'document:mousedown']
  /** Rxjs `throttleTime` (default 250) to apply - uses leading:true, trailing: true. Set to `0` to disable */
  @Input() bcGlobalThrottle = 250;
  /** subscribe within zone.runOutsideAngular() - use zone.run() to trigger change detection */
  @Input() bcGlobalRunOutside = true;
  /** Single emitter for all events - use Event.type and Event.target to determine event */
  @Output() bcGlobalEvent = new EventEmitter<Event>();

  private componentDestroyed$ = new Subject();

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    // build up an array of rxjs fromEvent observables
    const observables: Observable<Event>[] = this.bcGlobalListeners.map(
      item => {
        const [target, eventType] = item.split(':');
        const elem = EVENT_TARGETS[target];
        if (!elem) {
          throw new Error(
            `GlobalListenersDirective: ${target} not 'window' or 'document'`
          );
        }
        return fromEvent(elem, eventType);
      }
    );
    // subscribe to the observables
    merge(...observables)
      .pipe(
        this.bcGlobalRunOutside
          ? RXJS_UTILS.runOutsideZone<Event>(this.zone)
          : identity,
        this.bcGlobalThrottle
          ? throttleTime(this.bcGlobalThrottle, undefined, {
              leading: true,
              trailing: true,
            })
          : identity,
        tap(event => {
          this.bcGlobalEvent.emit(event);
        }),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
  }
}
