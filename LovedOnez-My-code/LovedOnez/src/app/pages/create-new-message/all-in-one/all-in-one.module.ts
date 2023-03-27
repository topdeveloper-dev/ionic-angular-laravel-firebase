import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllInOnePageRoutingModule } from './all-in-one-routing.module';

import { AllInOnePage } from './all-in-one.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    AllInOnePageRoutingModule
  ],
  declarations: [AllInOnePage]
})
export class AllInOnePageModule {}
