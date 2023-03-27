import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeVideoPageRoutingModule } from './welcome-video-routing.module';

import { WelcomeVideoPage } from './welcome-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeVideoPageRoutingModule
  ],
  declarations: [WelcomeVideoPage]
})
export class WelcomeVideoPageModule {}
