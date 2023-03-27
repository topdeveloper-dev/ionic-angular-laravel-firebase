import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LetterOfWishesPageRoutingModule } from './letter-of-wishes-routing.module';

import { LetterOfWishesPage } from './letter-of-wishes.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    LetterOfWishesPageRoutingModule
  ],
  declarations: [LetterOfWishesPage]
})
export class LetterOfWishesPageModule {}
