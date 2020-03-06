import { Component } from '@angular/core';
import { ThemeService } from '@bcodes/ngx-theme-service';

@Component({
    selector: 'app-root',
    template: `
        <div class="router-outlet-wrapper">
            <!-- <app-navigation-container></app-navigation-container> -->
            <div>Navigation</div>
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [
        `
            .router-outlet-wrapper {
                position: relative;
            }
        `,
    ],
})
export class AppComponent {
    title = 'hackernews';

    constructor(themeService: ThemeService) {}
}
