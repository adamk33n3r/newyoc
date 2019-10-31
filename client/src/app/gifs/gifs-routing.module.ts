import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GifsComponent } from './gifs.component';

const routes: Routes = [
  {
    path: '',
    component: GifsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GifsRoutingModule { }
