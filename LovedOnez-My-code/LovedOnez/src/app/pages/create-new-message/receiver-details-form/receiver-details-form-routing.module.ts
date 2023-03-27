import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiverDetailsFormPage } from './receiver-details-form.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiverDetailsFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiverDetailsFormPageRoutingModule {}
