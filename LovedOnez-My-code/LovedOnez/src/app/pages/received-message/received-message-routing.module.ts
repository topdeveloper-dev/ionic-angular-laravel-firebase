import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivedMessagePage } from './received-message.page';

const routes: Routes = [
  {
    path: '',
    component: ReceivedMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivedMessagePageRoutingModule {}
