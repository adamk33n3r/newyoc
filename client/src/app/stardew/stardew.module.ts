import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule, MdDialog, MdDialogModule } from '@angular/material';

import { PipesModule } from '../pipes/pipes.module';

import { StardewRoutingModule } from './stardew-routing.module';
import { StardewComponent } from './stardew.component';
import { ObjectModalComponent } from './stardew.tile-edit.modal.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        PipesModule,
        StardewRoutingModule,
    ],
    declarations: [
        StardewComponent,
        ObjectModalComponent,
    ],
    entryComponents: [
        ObjectModalComponent,
    ],
})
export class StardewModule { }
