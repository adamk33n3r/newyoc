import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { StardewRoutingModule } from './stardew-routing.module';
import { StardewComponent } from './stardew.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    StardewRoutingModule
  ],
  declarations: [
    StardewComponent,
  ]
})
export class StardewModule { }
