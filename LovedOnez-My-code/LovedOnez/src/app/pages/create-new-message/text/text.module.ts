import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TextPageRoutingModule } from './text-routing.module';

import { TextPage } from './text.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TextPageRoutingModule
  ],
  declarations: [TextPage]
})
export class TextPageModule {}
