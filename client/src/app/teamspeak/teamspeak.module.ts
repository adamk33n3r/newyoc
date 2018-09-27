import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
} from '@angular/material';

import { TeamSpeakRoutingModule } from './teamspeak-routing.module';
import { TeamSpeakComponent } from './teamspeak.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    TeamSpeakRoutingModule,
  ],
  declarations: [
    TeamSpeakComponent,
  ],
})
export class TeamSpeakModule { }
