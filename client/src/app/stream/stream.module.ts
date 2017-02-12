import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { WindowProvider } from '../window.provider';
import { JWPlayerComponent } from '../components/jwplayer/jwplayer.component';

import { StreamRoutingModule } from './stream-routing.module';
import { StreamComponent } from './stream.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    StreamRoutingModule,
  ],
  declarations: [
    StreamComponent,
    JWPlayerComponent,
  ],
  providers: [
    { provide: WindowProvider, useValue: window },
  ],
})
export class StreamModule { }
