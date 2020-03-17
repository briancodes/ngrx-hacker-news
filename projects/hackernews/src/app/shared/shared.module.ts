import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MessageComponent } from './components/message/message.component';
import { RouterModule } from '@angular/router';

const COMPONENTS = [HeaderComponent, MessageComponent];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [CommonModule, RouterModule],
    exports: [...COMPONENTS],
})
export class SharedModule {}
