import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppNavbar } from './components/navbar/navbar.component';
import { AppContent } from './components/content.component';

@NgModule({
  declarations: [
    AppComponent,
    AppNavbar,
    AppContent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: 'Window', useValue: window },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
