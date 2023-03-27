import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeVideoPage } from './welcome-video.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeVideoPageRoutingModule {}
