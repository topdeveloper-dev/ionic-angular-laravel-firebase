import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageOptionsPage } from './message-options.page';

const routes: Routes = [
  {
    path: '',
    component: MessageOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class MessageOptionsPageRoutingModule {}
