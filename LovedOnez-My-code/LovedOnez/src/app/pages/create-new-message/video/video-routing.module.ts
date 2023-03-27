import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoPage } from './video.page';

const routes: Routes = [
  {
    path: '',
    component: VideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoPageRoutingModule {}
