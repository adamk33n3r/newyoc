import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MdIconModule,
    MdButtonModule,
    MdInputModule,
    MdCardModule,
    MdGridListModule,
    MdListModule,
    MdExpansionModule,
    MdProgressSpinnerModule,
} from '@angular/material';
import { AuthHttp } from 'angular2-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { AppNavbarComponent } from './components/navbar/navbar.component';
import { AppContent } from './components/content.component';
import { MinerComponent } from './components/miner/miner.component';

import { Auth } from './services/auth.service';
import { Socket } from './services/socket.service';

@NgModule({
    declarations: [
        AppComponent,
        AppNavbarComponent,
        AppContent,
        MainComponent,
        MinerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MdIconModule,
        MdButtonModule,
        MdInputModule,
        MdCardModule,
        MdGridListModule,
        MdListModule,
        MdExpansionModule,
        MdProgressSpinnerModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: 'Window', useValue: window },
        AuthHttp,
        Auth,
        Socket,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
