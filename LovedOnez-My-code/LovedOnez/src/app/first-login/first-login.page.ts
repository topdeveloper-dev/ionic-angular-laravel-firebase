import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonUtils, User } from '../glob.module';
import { cl, jsonToString, stringToJson } from '../globUtils';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.page.html',
  styleUrls: ['./first-login.page.scss'],
})
export class FirstLoginPage implements OnInit {
  readonly appLogo: string = '../assets/img/app_logo.png';
  userInfo: any
  constructor(
    private route: Router,
    private ionUtils: IonUtils,
    private user: User,
    private databaseService: DatabaseService,
    private storage: Storage,
  ) {
  }

  ngOnInit() {
    this.databaseService.onAppLogin();

    this.storage.set('firstLogin', true);
    this.user.get().then(userData=>{
      this.storage.set('userId', userData['id']);
    })

    // if(this.route.getCurrentNavigation().extras.state){
    //   // this.userInfo = stringToJson(this.route.getCurrentNavigation().extras.state.userInfo);
    //   // cl(this.userInfo);
    // } else{
    //   if (this.userInfo == undefined) {
    //     this.user.get().then((userObj)=>{
    //       // cl(userObj);
    //     });
    //   }
    // }
  }
  goToHomePage(){
    // cl(this.userInfo)
    this.route.navigate(['/menu/home']);
  }

}
