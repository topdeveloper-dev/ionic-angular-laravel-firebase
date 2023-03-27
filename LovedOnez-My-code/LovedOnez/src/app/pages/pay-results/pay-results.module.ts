import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayResultsPageRoutingModule } from './pay-results-routing.module';

import { PayResultsPage } from './pay-results.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PayResultsPageRoutingModule
  ],
  declarations: [PayResultsPage]
})
export class PayResultsPageModule {}
