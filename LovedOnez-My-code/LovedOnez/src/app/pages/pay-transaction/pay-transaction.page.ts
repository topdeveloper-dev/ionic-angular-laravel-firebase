import { SymService } from 'src/app/services/sym.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppControl, IonUtils, User } from 'src/app/glob.module';
import { cl, stringToJson } from 'src/app/globUtils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-transaction',
  templateUrl: './pay-transaction.page.html',
  styleUrls: ['./pay-transaction.page.scss'],
})
export class PayTransactionPage implements OnInit {
  ionicForm: FormGroup;
  amount: any;
  myToken: any;
  userId: any;
  items: any;
  card_token: any;
  token: string  = '';

  constructor(
    public formBuilder: FormBuilder,
    private ionUtils: IonUtils,
    private route: Router,
    private appControl: AppControl,
    private user: User,
    private symService: SymService
    ) {
      cl('params',this.route.getCurrentNavigation().extras.state)
      let name: any = 'aby'

    if(name == 'aby'){
      cl('Zolensky', name )
    }

    if(this.route.getCurrentNavigation().extras.state){
      let amount = stringToJson(this.route.getCurrentNavigation().extras.state.amount);
debugger
      //cl('paymentPlan', paymentPlan)
this.amount = amount
      // if(paymentPlan == "Pay-As-You-Go"){
      //   this.amount = 100;
      // }
      // if(paymentPlan == "Monthly"){
      //   this.amount = 150;
      // }
      // if(paymentPlan == "Yearly"){
      //   this.amount = 200;
      // }
      cl('Amount', this.amount)
          //this.ionUtils.loading();
          this.user.get().then(user => {
          this.appControl.getCard(user['id']).then(_res=>{
            let cardsList = _res['response'];
              //this.userId = user['id'];
              this.items = cardsList;
            cl('check cards', this.items)
              this.ionUtils.loadingDismiss();

            })
          })

          this.ionicForm = this.formBuilder.group({
            card_Token: [''],
            amount_due: ['']
      })
    }

    }

  ngOnInit() {


  }

  getCard(callback){
    this.user.get().then(useRes => {
        let formData = new FormData();
        formData.append('action', 'getCard');
        cl(useRes['token'])
        this.symService.easyService(formData, useRes['token']).subscribe(res=>{
            //cl("qwert",res)
            // if(res[])
            callback(res);
        }, err=>{
            cl(err)
            if(err==='failed_to_authenticate'){
                // this.authentication.logout();
                this.ionUtils.loadingDismiss();
            }
        });
    })
}


  onSubmit(){

    this.myToken = JSON.stringify(this.items)
    this.myToken = this.myToken.substring(20);
    this.myToken = this.myToken.slice(0, -3);
    console.log('New Token: '+' '+ this.myToken);
    this.amount = 500;

    // this.card_token = this.ionicForm.value.token;
    //this.isSubmitted = true;

    if(!this.ionicForm.valid){
      console.log('Please provide all the required values!');
      return false;
  } else{
    const formData = new FormData();
    formData.append('action', 'proccessdPayment');
    formData.append('tokenizationID', this.myToken);
    formData.append('amount', this.amount);

    this.user.get().then(useRes => {
    this.symService.easyService(formData, useRes['token']).subscribe(res=>{
    cl("", res)

    if(res['response'] == null){
      this.ionicForm.value.card_Token ='';
      this.amount = 200;
      //this.ionicForm.value.card_month = '';
      }
     });
   });

   console.log('Card Token: '+' '+this.myToken);
   console.log('Amount Due: '+' '+this.amount);

   this.route.navigate(['/menu/pay-results'])
  }
 }
}



