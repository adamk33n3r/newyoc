import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material';

import { AudioFileComponent } from './audio-file/audio-file.component';

@NgModule({
    imports: [
        MatRippleModule,
    ],
    declarations: [
        AudioFileComponent,
    ],
    exports: [
        AudioFileComponent,
    ],
})
export class ComponentsModule {}
