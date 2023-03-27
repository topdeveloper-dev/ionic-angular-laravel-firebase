import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageOptionsPageRoutingModule } from './message-options-routing.module';

import { MessageOptionsPage } from './message-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageOptionsPageRoutingModule
  ],
  declarations: [MessageOptionsPage]
})
export class MessageOptionsPageModule {}
