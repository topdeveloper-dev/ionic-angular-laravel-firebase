import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestDemoPage } from './test-demo.page';

const routes: Routes = [
  {
    path: '',
    component: TestDemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestDemoPageRoutingModule {}
