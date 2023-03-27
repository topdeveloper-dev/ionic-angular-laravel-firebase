import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiverDetailsFormPageRoutingModule } from './receiver-details-form-routing.module';

import { ReceiverDetailsFormPage } from './receiver-details-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReceiverDetailsFormPageRoutingModule
  ],
  declarations: [ReceiverDetailsFormPage]
})
export class ReceiverDetailsFormPageModule {}
