import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivedMessagePageRoutingModule } from './received-message-routing.module';

import { ReceivedMessagePage } from './received-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceivedMessagePageRoutingModule
  ],
  declarations: [ReceivedMessagePage]
})
export class ReceivedMessagePageModule {}
