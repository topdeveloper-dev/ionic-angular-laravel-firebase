import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewMessagePage } from './view-message.page';

const routes: Routes = [
  {
    path: '',
    component: ViewMessagePage
  },
  {
    path: 'message',
    loadChildren: () => import('./message/message.module').then( m => m.MessagePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewMessagePageRoutingModule {}
