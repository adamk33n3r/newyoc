import { NgModule } from '@angular/core';

import { TypeofPipe } from './typeof.pipe';

@NgModule({
    declarations: [
        TypeofPipe,
    ],
    exports: [
        TypeofPipe,
    ],
})
export class PipesModule {}
