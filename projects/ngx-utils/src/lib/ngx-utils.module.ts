import { NgModule } from '@angular/core';
import { GlobalListenersDirective } from './directives/global-listeners.directive';

const DIRECTIVES = [GlobalListenersDirective];

@NgModule({
    declarations: [...DIRECTIVES],
    imports: [],
    exports: [...DIRECTIVES],
})
export class NgxUtilsModule {}
