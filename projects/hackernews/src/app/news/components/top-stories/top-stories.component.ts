import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    NgZone,
    EventEmitter,
    Output,
} from '@angular/core';
import { Story } from '../../../shared/services';

@Component({
    selector: 'app-top-stories',
    templateUrl: './top-stories.component.html',
    styleUrls: ['./top-stories.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopStoriesComponent implements OnInit {
    @Input() items: Story[];
    @Output() loadMore = new EventEmitter();

    constructor(private zone: NgZone) {}

    ngOnInit(): void {}

    trackByFn(index, item: Story) {
        return item.id;
    }

    handleWindowEvent(event: Event) {
        if (event.type === 'scroll') {
            if (
                window.scrollY + window.innerHeight >=
                document.body.scrollHeight - 20
            ) {
                this.zone.run(() => {
                    this.loadMore.emit();
                });
            }
        }
    }
}
