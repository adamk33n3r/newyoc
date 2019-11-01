import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatCardModule,
  MatButtonModule,
  MatChipsModule,
  MatIconModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSnackBarModule,
} from '@angular/material';

import { GifsRoutingModule } from './gifs-routing.module';
import { GifsComponent } from './gifs.component';

import { GifComponent } from '../components/gif/gif.component';
import { ComponentsModule } from 'app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    GifsRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  declarations: [GifsComponent, GifComponent]
})
export class GifsModule { }
