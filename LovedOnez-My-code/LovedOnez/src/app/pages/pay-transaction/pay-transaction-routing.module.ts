import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayTransactionPage } from './pay-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: PayTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayTransactionPageRoutingModule {}
