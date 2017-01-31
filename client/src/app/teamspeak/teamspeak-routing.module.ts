import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamSpeakComponent } from './teamspeak.component';

const routes: Routes = [
  {
    path: '',
    component: TeamSpeakComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class TeamSpeakRoutingModule { }
