import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
    MatIconModule,
    MatListModule,
    MatInputModule,
} from '@angular/material';

import { JWPlayerComponent } from '../components/jwplayer/jwplayer.component';

import { StreamRoutingModule } from './stream-routing.module';
import { StreamComponent } from './stream.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    StreamRoutingModule,
  ],
  declarations: [
    StreamComponent,
    JWPlayerComponent,
  ],
})
export class StreamModule { }
