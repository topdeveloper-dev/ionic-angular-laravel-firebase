import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { User } from 'src/app/glob.module';
import { cl, stringToJson } from 'src/app/globUtils';
import { SymService } from 'src/app/services/sym.service';

@Component({
  selector: 'app-pay-card',
  templateUrl: './pay-card.page.html',
  styleUrls: ['./pay-card.page.scss'],
})
export class PayCardPage implements OnInit {
  ionicForm: FormGroup;
  cardDetails: any;
  deviceToken: string;
  userId: any;
  amount: number;
  amountValue: number;

  constructor(
    private route: Router,
    private router:ActivatedRoute,
    public formBuilder: FormBuilder,
    private symService: SymService,
    private user: User

  ) {

    this.ionicForm = this.formBuilder.group({
      card_type: [''],
      card_no: [''],
      card_month: [''],
      card_year: [''],
      card_cvv: [''],
      card_holder: ['']
})

if(this.route.getCurrentNavigation().extras.state){
  
  this.amountValue = stringToJson(this.route.getCurrentNavigation().extras.state.amount);
}
// this.router.queryParams.subscribe(params => {
//   this.amountValue = params.amount;
// })


this.user.device().then((devToken: string) =>{
  try {
    this.deviceToken = devToken;
    cl('Device token: ',this.deviceToken)
  } catch (error) {
    //cl('Device token error: ',error)
  }
});


this.user.get().then(user => {
  this.userId = user['id'];
}

)
  }

  ngOnInit() {

  }

  toCardTransaction(){
    this.route.navigate(['/menu/pay-transaction'])
  }


  onSubmit(){
    //this.isSubmitted = true;
    if(!this.ionicForm.valid){
      console.log('Please provide all the required values!');
      return false;
  } else{
    const formData = new FormData();
    formData.append('action', 'addCardDetails');
    formData.append('cardNumber', this.ionicForm.value.card_no);
    formData.append('cvv', this.ionicForm.value.card_cvv);
    formData.append('holder', this.ionicForm.value.card_holder)
    formData.append('month', this.ionicForm.value.card_month);
    formData.append('year', this.ionicForm.value.card_year);
    formData.append('brand', this.ionicForm.value.card_type);
    formData.append('userId', this.userId);

    this.user.get().then(useRes => {
    this.symService.easyService(formData, useRes['token']).subscribe(res=>{
    cl("", res)

    if(res['response'] == null){

      this.ionicForm.value.card_type ='';
      this.ionicForm.value.card_no = '';
      this.ionicForm.value.card_month = '';
      this.ionicForm.value.card_year = '';
      this.ionicForm.value.card_cvv = '';
      this.ionicForm.value.card_holder ='';

      }
     });
   });
   let navigationExtras: NavigationExtras = {
    state: {
      amount: this.amountValue
    }
  };

   this.route.navigate(['/menu/pay-transaction'], navigationExtras)

   console.log('Card Number: '+' '+this.ionicForm.value.card_no);
   console.log('Card Month: '+' '+this.ionicForm.value.card_month);
   console.log('Card Year: '+' '+this.ionicForm.value.card_year);
   console.log('Card Cvv: '+' '+this.ionicForm.value.card_cvv);
   console.log('Card Name: '+' '+this.ionicForm.value.card_holder);
   console.log('Card Type ' +' '+this.ionicForm.value.card_type);
   console.log('User ID: ' +' '+this.userId);

  }
 }




}



