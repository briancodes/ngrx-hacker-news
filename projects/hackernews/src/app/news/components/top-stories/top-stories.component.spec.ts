import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Story } from '../../../shared/services';
import { TopStoriesComponent } from './top-stories.component';

// TODO: We still need to test the handleWindowEvent

describe('TopStoriesComponent', () => {
    let component: TopStoriesComponent;
    let fixture: ComponentFixture<TopStoriesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [TopStoriesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopStoriesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the correct number of stories', () => {
        const stories = [
            { id: 1, title: '1' },
            { id: 2, title: '2' },
        ] as Story[];
        component.items = stories;

        fixture.detectChanges();

        const { debugElement } = fixture;

        const elems = debugElement.queryAll(By.css('app-story-item'));
        expect(elems.length).toEqual(2);
    });
});
