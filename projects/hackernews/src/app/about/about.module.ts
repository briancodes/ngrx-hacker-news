import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutContainerComponent } from './container/about-container.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [AboutContainerComponent],
    imports: [CommonModule, SharedModule, AboutRoutingModule],
})
export class AboutModule {}
