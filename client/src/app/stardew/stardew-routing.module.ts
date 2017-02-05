import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StardewComponent } from './stardew.component';

const routes: Routes = [
  {
    path: '',
    component: StardewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class StardewRoutingModule { }
