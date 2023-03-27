import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageSummaryPage } from './message-summary.page';

const routes: Routes = [
  {
    path: '',
    component: MessageSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageSummaryPageRoutingModule {}
