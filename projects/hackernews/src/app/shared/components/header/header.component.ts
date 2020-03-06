import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    ThemeService,
    THEME_CONFIG,
    ThemeServiceConfig,
} from '@bcodes/ngx-theme-service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
    @Output() refresh = new EventEmitter();
    private isDarkTheme: boolean;
    constructor(
        @Inject(THEME_CONFIG) private themeConfig: ThemeServiceConfig,
        private themeService: ThemeService
    ) {}

    ngOnInit(): void {
        this.isDarkTheme = this.themeConfig.defaultTheme === 'dark';
    }

    handleRefreshClick() {
        this.refresh.emit();
    }

    handleThemeClick() {
        this.isDarkTheme = !this.isDarkTheme;
        this.themeService.switchTheme(this.isDarkTheme ? 'dark' : 'light');
    }
}
