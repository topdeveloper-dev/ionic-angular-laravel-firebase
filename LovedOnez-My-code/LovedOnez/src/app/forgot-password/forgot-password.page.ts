import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../glob.module';
import { SymService } from '../services/sym.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  appLogo: string;
  ionicForm: FormGroup;
  isSubmitted: boolean;
  email: string;
  forgotStatus: boolean;
  forgotMessage: string;

  constructor(
    public formBuilder: FormBuilder,
    private symService: SymService,
    private route: Router,
    private user: User,
  ) {
    this.appLogo = '../assets/img/app_logo.png';
    // this.email = 'mnheyera@aolc.co.za';
    this.forgotStatus = false;
   }


   
   ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    });
    }
    get errorControl() {
      // console.log(this.ionicForm.controls);
      return this.ionicForm.controls;
    }

    gotoLogin(){
      this.forgotStatus = false;
      this.route.navigate(['/login']);
    }

  submitForm(){
    this.isSubmitted = true;
    // console.log(this.ionicForm.value)
    if (!this.ionicForm.valid) {
      // console.log('Please provide all the required values!')
      return false;
    } else {
      // console.log(this.ionicForm.value)
      const formData = new FormData();
      formData.append('action', 'forgotPassword');
      formData.append('userEmail', this.ionicForm.value.email);
      this.user.get().then(useRes => {
        this.symService.easyService(formData).subscribe(res=>{
          console.log(res);
          if(res['response']==true){
            this.forgotStatus = true;
          }else if(res['response']=='emailNoExist'){
            this.forgotStatus = false;
            this.forgotMessage = 'This email does not exist.';
          }
        });

      })
    }
  }

}
