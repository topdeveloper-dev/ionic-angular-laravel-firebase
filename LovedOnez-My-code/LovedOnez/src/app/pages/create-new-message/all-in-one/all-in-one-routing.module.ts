import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllInOnePage } from './all-in-one.page';

const routes: Routes = [
  {
    path: '',
    component: AllInOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllInOnePageRoutingModule {}
