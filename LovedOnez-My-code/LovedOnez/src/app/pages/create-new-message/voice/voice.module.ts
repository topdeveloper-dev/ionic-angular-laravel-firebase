import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoicePageRoutingModule } from './voice-routing.module';

import { VoicePage } from './voice.page';
//import { Base64 } from '@ionic-native/base64/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
   // Base64,
    VoicePageRoutingModule
  ],
  declarations: [VoicePage]
})
export class VoicePageModule {}
