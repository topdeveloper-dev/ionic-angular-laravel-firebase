import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayCardPage } from './pay-card.page';

const routes: Routes = [
  {
    path: '',
    component: PayCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayCardPageRoutingModule {}
