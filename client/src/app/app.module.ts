import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppNavbarComponent } from './components/navbar/navbar.component';
import { AppContent } from './components/content.component';

@NgModule({
    declarations: [
        AppComponent,
        AppNavbarComponent,
        AppContent,
    ],
    entryComponents: [
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: 'Window', useValue: window },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
