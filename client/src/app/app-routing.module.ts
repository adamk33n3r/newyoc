import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'teamspeak',
        loadChildren: './teamspeak/teamspeak.module#TeamSpeakModule'
      },
      {
        path: 'stream',
        loadChildren: './stream/stream.module#StreamModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        path: 'stardew',
        loadChildren: './stardew/stardew.module#StardewModule'
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MaterialModule,
  ],
  exports: [ RouterModule ],
  providers: []
})
export class AppRoutingModule { }
