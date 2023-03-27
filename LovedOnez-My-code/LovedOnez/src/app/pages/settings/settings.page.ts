import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { PluginListenerHandle, Plugins } from '@capacitor/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { AppControl, User } from 'src/app/glob.module';
import { cl, testEmogi } from 'src/app/globUtils';
import { PaymentModalComponent } from 'src/app/payment-modal/payment-modal.component';
import { SymService } from 'src/app/services/sym.service';
const { Network, Stripe } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  createReminderYearly: boolean = false;
  createReminderMonthly: boolean = false;
  createReminderDaily: boolean = false;

  createRemainderStatus: boolean;

  pushNotificationStatus: boolean;

  allowMobileDataUsageStatus: boolean;

  allowThemesStatus: boolean;

  paymentOption: string = 'Pay-As-You-Go';

  notificationVolume: number=50;
  userId: any;

  networkStatus: any;
  networkListener: PluginListenerHandle;


  constructor(
    private user: User,
    private symService: SymService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private appControl: AppControl,
    public alertController: AlertController,
    ) {

     }

  ngOnInit() {
    this.user.get().then((res) => {
      this.userId = res['id'];
    })

    // this.appControl.getSubscriptionTypes().then(subscriptionArr=>{
    //   cl('subscriptionArr', subscriptionArr)
    // })
    this.user.getAppSettings().then(res=>{

      if(res == 'not_set'){
        this.router.navigate(['/menu/home']);
      } else{
        if(res['reminder'] == 'daily'){
          this.createReminderDaily = true;
        } else if(res['reminder'] == 'monthly'){
          this.createReminderMonthly = true
        } else if(res['reminder'] == 'yearly'){
          this.createReminderYearly = true
        }

        if(this.createReminderDaily == true || this.createReminderMonthly == true || this.createReminderYearly == true){
          this.createRemainderStatus = true;
        }
        this.pushNotificationStatus = res['pushNotifications'] == 0 ? false : true;
        this.allowMobileDataUsageStatus = res['allowMobileDataUsage']  == 0 ? false : true;
        this.allowThemesStatus = res['allowThemes']  == 0 ? false : true;
        this.notificationVolume = res['notificationSound'];
      }
    });
  }

  async confirmSubscritionType() {

    // cl('1234', memoryid)
    const actionSheet = await this.actionSheetController.create({
      header: 'Pick Subscription Method',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Pay-As-You-Go',
        role: 'destructive',
        icon: 'cash',
        //amount: 100,
        handler: () => {
          this.openPaymentModal('Pay-As-You-Go', 100);
          // this.deleteMemory(memoryid)
        },
      }, {
        text: 'Monthly',
        icon: 'cash',
        //amount: 100,
        handler: () => {
          this.openPaymentModal('Monthly', 150);
          console.log('Share clicked');
        }
      }, {
        text: 'Yearly',
        icon: 'cash',
        //amount: 150,
        handler: () => {
          this.openPaymentModal('Yearly', 200);
          console.log('Play clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        //amount: 0,
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }

  async openPaymentModal(paymentPlan, amount = 100) {

    let navigationExtras: NavigationExtras = {
      state: {
        paymentPlan: paymentPlan,
        amount:amount
      }
    };

    //this.router.navigate([`/menu/create-new-message/${this.memory.memoryType}`], navigationExtras);

    this.router.navigate(['/menu/pay-card'], navigationExtras)
    // this.paymentOption = paymentPlan;

    // cl(testEmogi, 'open-modal')

    // const modal = await this.modalCtrl.create({
    //   component: PaymentModalComponent,
    //   componentProps: {paymentPlan: paymentPlan }
    // });
    // await modal.present();
  }

  toogleOptions(option){
    const formData = new FormData();
    // updateSettingReminder
    // updateSettingPushNotifications
    // updateSettingAllowMobileDataUsage
    // updateSettingAllowThemes
    // updateSettingNotificationSound
    // updateSettingSubscriptionType
    if(option == 'reminder'){
      // cl(this.createRemainderStatus)
      if(!this.createRemainderStatus){
          this.createReminderYearly = false;
          this.createReminderMonthly = false;
          this.createReminderDaily = false;
          this.createRemainderStatus = false;
          this.changeSetting('updateSettingReminder', 'not_set');
        }else{
        this.createRemainderStatus = true;
      }
    } else if(option == 'pushNotifications'){
      this.changeSetting('updateSettingPushNotifications', this.pushNotificationStatus);
    } else if(option == 'allowMobileDataUsage'){
      this.changeSetting('updateSettingAllowMobileDataUsage', this.allowMobileDataUsageStatus);
    } else if(option == 'allowTheme'){
      this.changeSetting('updateSettingAllowThemes', this.allowThemesStatus);
    }
  }

  changeSetting(action, settingValue){
      const formData = new FormData();
      cl(action, settingValue)
      formData.append('action', action);
      if(action == 'updateSettingReminder'){
        formData.append('setting', settingValue);
      }else if(action == 'updateSettingNotificationSound'){
        formData.append('setting', settingValue ? '1' : '0');
      } else{
        formData.append('setting', settingValue);
      }
      formData.append('userId', this.userId);

      this.symService.easyService(formData).subscribe(res => {
        // cl([action, settingValue, res['response'][0]])
        this.user.updateSettings(res['response'][0]).then(newRes=>{
          cl(newRes)
        })
      })
      // return formData;
  }

  createReminder(duration){
    // this.memory.reminder = duration;
    if(duration == 'yearly'){
      this.createReminderYearly = true;
      this.createReminderMonthly = false;
      this.createReminderDaily = false;
    } else if(duration == 'monthly'){
      this.createReminderYearly = false;
      this.createReminderMonthly = true;
      this.createReminderDaily = false;
    } else if(duration == 'daily'){
      this.createReminderYearly = false;
      this.createReminderMonthly = false;
      this.createReminderDaily = true;
    }
    this.changeSetting('updateSettingReminder', duration);
  }

  confirmWithGooglePay() {
    Stripe.payWithGooglePay({
        clientSecret: 'mysecretstripekey',
        googlePayOptions: { // just demo options
            currencyCode: 'EUR',
            totalPrice: 1.00,
            totalPriceStatus: 'FINAL',
            allowedAuthMethods: ['PAN_ONLY'],
            allowedCardNetworks: ['VISA', 'MASTERCARD']
        },
    }).then(res => {
        console.log(res)
        // this.result = res;
        Stripe.confirmPaymentIntent({clientSecret: 'mysecretstripekey', fromGooglePay: true });
        })
        .catch(err => {
            console.log(err)
            // this.error = err;
        });
}

  soundChange(e){
    this.notificationVolume = e.detail.value;
    cl(this.notificationVolume)
    this.changeSetting('updateSettingNotificationSound', this.notificationVolume);
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Warning!',
      message: 'Please make sure you have internet connection to change subscription type!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            // console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


  changepaymentOption(){

    this.confirmSubscritionType();
    // this.networkListener = Network.addListener('networkStatusChange', (status) => {
    //   console.log("Network_status_changed", status);
    //   this.networkStatus = status;
    //   if(this.networkStatus.connected){
    //   }else{
    //     this.presentAlertConfirm()
    //   }
    // });
  }

}
