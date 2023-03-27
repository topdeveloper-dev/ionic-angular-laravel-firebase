import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewMessagePageRoutingModule } from './create-new-message-routing.module';

import { CreateNewMessagePage } from './create-new-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewMessagePageRoutingModule
  ],
  declarations: [CreateNewMessagePage]
})
export class CreateNewMessagePageModule {}
