import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewMessagePageRoutingModule } from './view-message-routing.module';

import { ViewMessagePage } from './view-message.page';
import { PaymentModalComponent } from 'src/app/payment-modal/payment-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMessagePageRoutingModule
  ],
  declarations: [ViewMessagePage, PaymentModalComponent],
  entryComponents: [PaymentModalComponent]
})
export class ViewMessagePageModule {}
