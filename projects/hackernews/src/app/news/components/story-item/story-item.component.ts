import { Component, OnInit, Input } from '@angular/core';
import { Story } from '../../../shared/services';

@Component({
    selector: 'app-story-item',
    templateUrl: './story-item.component.html',
    styleUrls: ['./story-item.component.scss'],
})
export class StoryItemComponent implements OnInit {
    @Input() item: Story;
    @Input() index: number;
    constructor() {}

    ngOnInit(): void {}
}
