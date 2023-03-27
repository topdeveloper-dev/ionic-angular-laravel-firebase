import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoicePage } from './voice.page';

const routes: Routes = [
  {
   path: '',
    component: VoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoicePageRoutingModule {}
