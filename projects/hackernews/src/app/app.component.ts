import { Component } from '@angular/core';
import { ThemeService } from '@bcodes/ngx-theme-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hackernews';

  constructor(themeService: ThemeService) {}
}
