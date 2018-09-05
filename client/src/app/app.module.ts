import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
} from '@angular/material';
import { JwtModule } from '@auth0/angular-jwt';

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
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatGridListModule,
        MatListModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        AppRoutingModule,
    ],
    providers: [
        Auth,
        Socket,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
