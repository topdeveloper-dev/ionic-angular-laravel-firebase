import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { SymService } from '../services/sym.service';
import { Storage } from '@ionic/storage';
import { Authentication, User } from '../glob.module';
import { cl, jsonToString, stringToJson } from '../globUtils';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  appLogo: string;
  ionicForm: FormGroup;
  isSubmitted: boolean;
  email: string;
  password: string;
  loginStatus: boolean;
  loginMessage: string;
  fullName: string;
  deviceToken: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private authentication: Authentication,
    public formBuilder: FormBuilder,
    private symService: SymService,
    private storage: Storage,
    private androidPermissions: AndroidPermissions,
    private user: User,
    ) {
      this.appLogo = '../assets/img/app_logo.png'

      this.email = 'mnheyera@aolc.co.za';
      this.password = 'Qwerty!23';
      // this.email = 'davhanar@gmail.com';
      // this.password = '@Aolc123';
    // this.symService.getData().subscribe(res=>{
    //   console.log(JSON.stringify(res));
    // });
    cl(this.authentication.isNewUser())
    if(this.authentication.isNewUser().length==0){
      // this.route.navigate(['/welcome']);
    } else{
      this.storage.get('userAuth').then((res) => {
        if(res){
            this.route.navigate(['/menu/home']);
        }
      });
    }

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        console.log('Has permission?',result.hasPermission);
      },
      err => {
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
        }
    );
   }

  ngOnInit() {
    this.user.device().then((devToken: string) =>{
      try {
        this.deviceToken = devToken;
        // cl('Device token: ',this.deviceToken)
      } catch (error) {
        cl('Device token error: ',error)
      }

    });
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    });
  }


  get errorControl() {
    // console.log(this.ionicForm.controls);
    return this.ionicForm.controls;
  }

  goVideo(){
this.route.navigate(['/welcome-video'])
  }

  toRegForm(){
    this.route.navigate(['/create-account'])
  }

  forgotPassword(){
    this.route.navigate(['/forgot-password']);
  }

  toVideo(){
    this.route.navigate(['/welcome-video']);
  }

  submitForm(){
    this.user.getDeviceToken().then(deviceToken=>{

      // cl(['deviceToken', deviceToken.toString])
      this.isSubmitted = true;
      // console.log(this.ionicForm.value)
      if (!this.ionicForm.valid) {
        // console.log('Please provide all the required values!')
        return false;
      } else {
        const formData = new FormData();
        formData.append('action', 'loveLogin');
        formData.append('userEmail', this.ionicForm.value.email);
        formData.append('userPassword', this.ionicForm.value.password);
        formData.append('symId', '1');
        formData.append('deviceToken', deviceToken.toString());
        this.symService.easyService(formData).subscribe(res=>{


          console.log('userCred',res['response'])
          if(res['response']==0){
            this.loginStatus = false;
            this.loginMessage = 'Login failed!, wrong user credentials.';
            this.storage.set('userAuth', false);
          } else if(res['response']['id']!=undefined){
            if(res['response']['activationStatus']==1){
              // cl(res['response']);
              // this.fullName = res['response']['firstName']+'_'+res['response']['lastName']+'_'+res['response']['activationStatus']
              this.authentication.login(res['response'], (res2)=>{
                if(res2){

                  // this.storage.set('userAuth', false);
                  // cl(res2);
                  // this.fullName = this.fullName+'_'+res2;
                  // let data = jsonToString(res['response']);
                  //   let navigationExtras: NavigationExtras = {
                    //     state: {
                      //       userInfo: data
                      //     }
                      //   };
                  this.loginStatus = true;

                  this.storage.get('firstLogin').then((firstLogin) => {

                    cl('firstLogin', firstLogin)
                    if(firstLogin){
                      this.route.navigate(['/menu/home']);
                    }else{
                      this.route.navigate(['/first-login']);
                    }
                 }).catch(err=>{
                   this.route.navigate(['/first-login']);
                 });
                }

              });
            }else{
              this.storage.set('userAuth', false);
              this.loginMessage = 'This account still needs to be activated.';
            }
          }
        });
      }
    })
  }
}
