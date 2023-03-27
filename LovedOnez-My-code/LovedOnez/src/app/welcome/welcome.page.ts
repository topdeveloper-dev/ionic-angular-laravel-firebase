import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  appLogo: string;

  constructor(private router: Router,) {
    this.appLogo = '../assets/img/app_logo.png'
  }

  ngOnInit() {
    // this.router.navigate(['/login']);
  }

  goToTermsAndConditions(){
    this.router.navigate(['/terms-and-conditions']);
  }

}
