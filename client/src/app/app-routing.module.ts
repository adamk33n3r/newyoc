import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
    },
    {
        path: 'status',
        redirectTo: 'teamspeak',
    },
    {
        path: 'teamspeak',
        loadChildren: './teamspeak/teamspeak.module#TeamSpeakModule',
    },
    {
        path: 'stream',
        loadChildren: './stream/stream.module#StreamModule',
    },
    {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule',
    },
    {
        path: 'stardew',
        loadChildren: './stardew/stardew.module#StardewModule',
    },
    {
        path: '**',
        redirectTo: '/',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [ RouterModule ],
    providers: [],
})
export class AppRoutingModule {}
