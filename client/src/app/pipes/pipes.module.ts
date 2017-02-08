import { NgModule } from '@angular/core';

import { TypeofPipe } from './typeof.pipe';
import { TitleizePipe } from './titleize.pipe';

@NgModule({
    declarations: [
        TypeofPipe,
        TitleizePipe,
    ],
    exports: [
        TypeofPipe,
        TitleizePipe,
    ],
})
export class PipesModule {}
