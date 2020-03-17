import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about-container',
    template: `
        <app-header></app-header>
        <section class="max-width-section">
            <div>Load DevTools Redux Extention to see State Output</div>
        </section>
    `,
    styleUrls: ['./about-container.component.scss'],
})
export class AboutContainerComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
