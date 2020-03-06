import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NewsContainerComponent } from './container/news-container.component';
import { NewsRoutingModule } from './news-routing.module';

@NgModule({
    declarations: [NewsContainerComponent],
    imports: [CommonModule, NewsRoutingModule],
})
export class NewsModule {}
