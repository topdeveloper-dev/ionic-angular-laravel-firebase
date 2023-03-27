import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { PayConformationComponent } from '../pay-conformation/pay-conformation.component';

@Component({
  selector: 'app-pay-transaction-modal',
  templateUrl: './pay-transaction-modal.component.html',
  styleUrls: ['./pay-transaction-modal.component.scss'],
})
export class PayTransactionModalComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  dismissModal(){
    this.modalCtrl.dismiss();
  }

  async onConfirm(){
    //console.log('Your Card');
    const modal = await this.modalCtrl.create({
      component: PayConformationComponent
    });
   return await modal.present();
  }
}
