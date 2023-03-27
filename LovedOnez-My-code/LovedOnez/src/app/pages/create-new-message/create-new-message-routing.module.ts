import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNewMessagePage } from './create-new-message.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNewMessagePage
  },  {
    path: 'all-in-one',
    loadChildren: () => import('./all-in-one/all-in-one.module').then( m => m.AllInOnePageModule)
  },
  {
    path: 'letter-of-wishes',
    loadChildren: () => import('./letter-of-wishes/letter-of-wishes.module').then( m => m.LetterOfWishesPageModule)
  },
  {
    path: 'text',
    loadChildren: () => import('./text/text.module').then( m => m.TextPageModule)
  },
  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then( m => m.VideoPageModule)
  },
  {
    path: 'voice',
    loadChildren: () => import('./voice/voice.module').then( m => m.VoicePageModule)
  },
  {
    path: 'receiver-details-form',
    loadChildren: () => import('./receiver-details-form/receiver-details-form.module').then( m => m.ReceiverDetailsFormPageModule)
  },
  {
    path: 'message-summary',
    loadChildren: () => import('./message-summary/message-summary.module').then( m => m.MessageSummaryPageModule)
  },
  {
    path: 'message-options',
    loadChildren: () => import('./message-options/message-options.module').then( m => m.MessageOptionsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewMessagePageRoutingModule {}
