import { Component, OnInit } from '@angular/core';
import { tcConditions } from './terms-and-conditions-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage implements OnInit {
  appLogo: string;
  isCheckedtc: boolean;
  tcData: string;
  tcMessage: string;
  

  constructor( private route: Router) {
    this.appLogo = '../assets/img/app_logo.png';
    this.isCheckedtc = false;
    this.tcMessage = '';
    this.tcData = tcConditions();
   }
   
  ngOnInit() {

  }

  goToWelcomeVideo(){
    if(this.isCheckedtc){
      this.route.navigate(['/welcome-video']); 
    } else{
      this.tcMessage = 'Please make sure you check Terms and conditions.'
    }
  }

}
