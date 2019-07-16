import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatTableModule } from '@angular/material';

import { QuotesRoutingModule } from './quotes-routing.module';
import { QuotesComponent } from './quotes.component';

@NgModule({
  imports: [
    CommonModule,
    QuotesRoutingModule,
    MatCardModule,
    MatTableModule,
  ],
  declarations: [QuotesComponent]
})
export class QuotesModule { }
