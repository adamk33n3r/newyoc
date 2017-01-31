import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { TeamSpeakRoutingModule } from './teamspeak-routing.module';
import { TeamSpeakComponent } from './teamspeak.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TeamSpeakRoutingModule,
  ],
  declarations: [
    TeamSpeakComponent,
  ],
})
export class TeamSpeakModule { }
