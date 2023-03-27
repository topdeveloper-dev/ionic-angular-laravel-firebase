import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageSummaryPageRoutingModule } from './message-summary-routing.module';

import { MessageSummaryPage } from './message-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageSummaryPageRoutingModule
  ],
  declarations: [MessageSummaryPage]
})
export class MessageSummaryPageModule {}
