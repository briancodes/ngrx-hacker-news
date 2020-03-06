import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { HNConfig, HNConfigToken } from '../hn-config';
import { ServiceState } from './base/base-items.service';
import { TopStoriesService } from './top-stories.service';

describe('TopStoriesService', () => {
    let service: TopStoriesService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: HNConfigToken, useValue: HNConfig }],
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(TopStoriesService);
    });

    it('should start with initial state', () => {
        expect(service).toBeTruthy();
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.initial);
        });
    });

    it('should process loading and success state', () => {
        const url = HNConfig.topStoriesUrl;

        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.initial);
        });

        service.callAPI();

        const req = httpTestingController.expectOne(url);

        // Lodading check
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.loading);
        });

        // Success check
        const body = [1, 2];
        req.flush(body);

        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.success);
            expect(data.items).toEqual(body);
        });
        httpTestingController.verify();
    });

    it('should process loading and error state', () => {
        const url = HNConfig.topStoriesUrl;

        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.initial);
        });

        service.callAPI();

        const req = httpTestingController.expectOne(url);

        // Lodading check
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.loading);
        });

        // Error check
        req.flush(
            { errorMessage: 'err' },
            { status: 400, statusText: 'API Error' }
        );

        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.error);
        });
        httpTestingController.verify();
    });

    it('unsubscribe on destroy', () => {
        expect(service).toBeTruthy();
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.initial);
        });
        // tslint:disable-next-line: no-string-literal
        expect(service['apiSubject'].observers.length).toEqual(1);
        service.ngOnDestroy();
        // tslint:disable-next-line: no-string-literal
        expect(service['apiSubject'].observers.length).toEqual(0);
    });
});
