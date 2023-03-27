import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayResultsPage } from './pay-results.page';

const routes: Routes = [
  {
    path: '',
    component: PayResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayResultsPageRoutingModule {}
