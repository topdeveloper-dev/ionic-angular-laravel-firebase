import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstLoginPageRoutingModule } from './first-login-routing.module';

import { FirstLoginPage } from './first-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirstLoginPageRoutingModule
  ],
  declarations: [FirstLoginPage]
})
export class FirstLoginPageModule {}
