import { PayTransactionModalComponent } from './../components/pay-transaction-modal/pay-transaction-modal.component';
import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';

import { WebIntent } from '@ionic-native/web-intent/ngx';

// import 'capacitor-gpay-plugin' // for web support
//import { GPayNativePlugin } from 'capacitor-gpay-plugin';
// import {
//   BaseRequestData,
//   PaymentDataRequest,
//   PaymentMethod,
//   TokenizationSpecificationPaymentGateway,
//   PaymentMethodCard,
//   AuthMethod,
//   CardNetwork,
//   PaymentData,
// } from 'capacitor-gpay-plugin';
import { cl, showToast } from '../globUtils';
//const GPayNative = Plugins.GPayNative as GPayNativePlugin;



const { Toast } = Plugins;

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {

  cardType;
  cardNo;
  mm;
  yyyy;
  cvv;

  constructor(
    private modalCtrl: ModalController,
    private webIntent: WebIntent
    ) { }

  @Input() paymentPlan: string;
  ngOnInit() {


    // const tokenizationSpecification: TokenizationSpecificationPaymentGateway = {
    //   type: 'PAYMENT_GATEWAY',
    //   parameters: {
    //       gateway: 'AOLC',
    //       gatewayMerchantId: 'BCR2DN6T567IVQJ3',
    //   }
    // };

  //   const baseRequest: BaseRequestData = {
  //     apiVersion: 2,
  //     apiVersionMinor: 0
  //   };

  // const baseCardPaymentMethod: PaymentMethodCard = {
  //   type: 'CARD',
  //   parameters: {
  //       allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"] as AuthMethod[],
  //       allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"] as CardNetwork[],
  //   }
  // };

//  GPayNative.createClient({ test: true }).then(res1=>{
//    cl('res1', res1)
//  });

/* Получение информации о готовности к платежу */
const googlePayBaseConfiguration = {
  apiVersion: 2,
  apiVersionMinor: 0,
  //allowedPaymentMethods: [baseCardPaymentMethod]
};
// const isReadyToPayRequest = {
//   baseCardPaymentMethod: baseCardPaymentMethod,
//     allowedPaymentMethods: [baseCardPaymentMethod],
// };



// const isReady = GPayNative.isReadyToPay(googlePayBaseConfiguration).then(res=>{
//   cl('isReady', res)

// });

// const paymentDataRequest: PaymentDataRequest = {
//   ...baseRequest,
//   allowedPaymentMethods: [baseCardPaymentMethod],
//   transactionInfo: {
//       totalPriceStatus: 'FINAL',
//       totalPrice: "12.34", // Итоговая стоимость
//       currencyCode: 'RZA',
//       countryCode: 'R',
//       checkoutOption: 'COMPLETE_IMMEDIATE_PURCHASE',
//   },
//   merchantInfo: {
//       merchantName: 'AOLC',
//       merchantId: 'BCR2DN6T567IVQJ3',
//   },
// };

  // cl('isReady', isReady)

  }

  onVisa(){
    var _cardType;
    this.cardType = "VISA";
  }
  onMastercard(){
    var _cardType;
    this.cardType = "MASTERCARD";
  }
  onAmericanExpress(){
    var _cardType;
    this.cardType = "AMX";
  }

  async onPay(){

    /*var _cardType = this.cardType;
    var _cardNo = this.cardNo;
    var _mm = this.mm;
    var _yyyy = this.yyyy;
    var _cvv = this.cvv;

    console.log('Card Type: ' + _cardType + ' Card Number: ' + _cardNo + ' Months ' + _mm + ' Year: ' + _yyyy + ' CVV: ' + _cvv);
    */

    const modal = await this.modalCtrl.create({
      component: PayTransactionModalComponent
    });
   return await modal.present();
  }

  upi(){

    showToast('Michael Nheyera......')
    let uriString = "";
    uriString = "upi://pay?pa=amazonupi@paytm&pn=amazon&tr=" + 'orderId' + "&mc=1234&am=" + 'amount'+"&tn=paymentForAmazon";
    // uriString = "https://staging-apiv2.wirecard.co.za/product/payment/v1/initialisevirtual";

    cl('uriString',uriString);

    const options = {
      action: this.webIntent.ACTION_VIEW,
      url: uriString
      // type: 'application/vnd.android.package-archive'
    }

    this.webIntent.startActivity(options).then(onSuccess=>{
      cl(onSuccess)
    }, onError=>{
      cl(onError)
    });

  }


  dismissModal(){
    this.modalCtrl.dismiss();
  }




}
