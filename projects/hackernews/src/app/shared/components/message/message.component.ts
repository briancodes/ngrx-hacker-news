import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';
import { ServiceState } from '../../services';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit {
    @Input() state: ServiceState;

    ServiceState = ServiceState;

    constructor() {}

    ngOnInit(): void {}
}
