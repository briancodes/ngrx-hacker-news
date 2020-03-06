import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NewsContainerComponent } from './container/news-container.component';
import { NewsRoutingModule } from './news-routing.module';
import { TopStoriesComponent } from './components/top-stories/top-stories.component';
import { StoryItemComponent } from './components/story-item/story-item.component';
import { SharedModule } from '../shared/shared.module';
import { NgxUtilsModule } from '@bcodes/ngx-utils';

@NgModule({
    declarations: [
        NewsContainerComponent,
        TopStoriesComponent,
        StoryItemComponent,
    ],
    imports: [CommonModule, NewsRoutingModule, SharedModule, NgxUtilsModule],
})
export class NewsModule {}
