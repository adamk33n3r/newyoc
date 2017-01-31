import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { JWPlayerComponent } from '../components/jwplayer/jwplayer.component';

import { StreamRoutingModule } from './stream-routing.module';
import { StreamComponent } from './stream.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    StreamRoutingModule,
  ],
  declarations: [
    StreamComponent,
    JWPlayerComponent,
  ],
})
export class StreamModule { }
