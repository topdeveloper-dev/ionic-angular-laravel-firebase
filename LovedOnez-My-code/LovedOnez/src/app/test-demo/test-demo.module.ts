import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestDemoPageRoutingModule } from './test-demo-routing.module';

import { TestDemoPage } from './test-demo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestDemoPageRoutingModule
  ],
  declarations: [TestDemoPage]
})
export class TestDemoPageModule {}
