import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayTransactionPageRoutingModule } from './pay-transaction-routing.module';

import { PayTransactionPage } from './pay-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PayTransactionPageRoutingModule
  ],
  declarations: [PayTransactionPage]
})
export class PayTransactionPageModule {}
