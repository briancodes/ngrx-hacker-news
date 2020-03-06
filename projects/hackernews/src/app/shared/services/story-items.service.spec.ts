import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HNConfig, HNConfigToken } from '../hn-config';
import { ServiceState } from './base/base-items.service';
import { StoryItemsService, Story } from './story-items.service';
import { request } from 'http';
import { take } from 'rxjs/operators';

describe('StoryItemsService', () => {
    let service: StoryItemsService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: HNConfigToken, useValue: HNConfig }],
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(StoryItemsService);
    });

    it('should start with initial state', () => {
        expect(service).toBeTruthy();
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.initial);
        });
    });

    it('should process loading and success state', () => {
        const url = HNConfig.itemUrl;

        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.initial);
        });

        const ids = [1, 2, 3];
        service.callAPI(ids);

        const requests = ids
            .map(id => url.replace('{id}', '' + id))
            .map(expectedUrl => {
                return httpTestingController.expectOne(expectedUrl);
            });

        expect(requests.length).toEqual(3);

        // Lodading check
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.loading);
        });

        const respBodies = ids.map(id => {
            const story = {
                id,
                title: 'title: ' + id,
            } as Story;
            return story;
        });
        // Success check
        requests.forEach((req, i) => {
            req.flush(respBodies[i]);
        });
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.success);
            expect(data.items).toEqual(respBodies);
        });
        httpTestingController.verify();
    });

    it('should process loading and error state', () => {
        const url = HNConfig.itemUrl;

        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.initial);
        });

        const ids = [1, 2, 3];
        service.callAPI(ids);

        const requests = ids
            .map(id => url.replace('{id}', '' + id))
            .map(expectedUrl => {
                return httpTestingController.expectOne(expectedUrl);
            });

        expect(requests.length).toEqual(3);

        // Lodading check
        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.loading);
        });

        const respBodies = ids.map(id => {
            const story = {
                id,
                title: 'title: ' + id,
            } as Story;
            return story;
        });

        // Error check
        requests[0].flush(respBodies[0]);
        requests[1].flush(respBodies[1]);
        requests[2].flush(
            { errorMessage: 'err' },
            { status: 400, statusText: 'API Error' }
        );

        service.data$.pipe(take(1)).subscribe(data => {
            expect(data.state).toEqual(ServiceState.error);
        });
        httpTestingController.verify();
    });
});
