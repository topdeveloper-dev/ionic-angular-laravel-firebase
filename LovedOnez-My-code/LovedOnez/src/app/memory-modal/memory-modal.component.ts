//import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { cl } from '../globUtils';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { tcConditions } from '../terms-and-conditions/terms-and-conditions-data';
import { FormsModule } from '@angular/forms';
import { User } from '../glob.module';

 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
 // declarations: [MemoryModalComponent]
})
export class MemoryModalComponent implements OnInit {
  @Input() type: string;
  @Input() modId: string;
  @Input() memoryType: string;
  heartInCircle = '../assets/img/heartInCircle.png';
  heartInCircleSave = '../assets/img/heartInCircleSave.png';
  heartInCircleTrash = '../assets/img/heartInCircleTrash.png';
  message: string;
  letterImg: string;
  isCheckedtc: any;
  tcData: any;
  appLogo: string;
  messageCheck: string;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private user: User,
  ) { 
  }
  
  ngOnInit() {
    cl(this.type +'_'+ this.modId+'_'+this.memoryType)
    if(this.modId == 'mesOptions' && this.memoryType == 'letter-of-wishes'){
      if(this.type == 'send'){
        this.letterImg = this.heartInCircle
        this.message = 'LETTER SENT';
      }else if(this.type == 'save'){
        this.letterImg = this.heartInCircleSave
        this.message = 'LETTER SAVED';
      }else if(this.type == 'delete'){
        this.letterImg = this.heartInCircleTrash
        this.message = 'LETTER DELETED';
      }
    } else if(this.modId == 'mesOptions' && this.memoryType == 'text'){
      if(this.type == 'send'){
        this.letterImg = this.heartInCircle
        this.message = 'TEXT SENT';
      }else if(this.type == 'save'){
        this.letterImg = this.heartInCircleSave
        this.message = 'TEXT SAVED';
      }else if(this.type == 'delete'){
        this.letterImg = this.heartInCircleTrash
        this.message = 'TEXT DELETED';
      }
    } else if(this.modId == 'mesOptions' && this.memoryType == 'voice'){
      if(this.type == 'send'){
        this.letterImg = this.heartInCircle
        this.message = 'VOICE MEMORY SENT';
      }else if(this.type == 'save'){
        this.letterImg = this.heartInCircleSave
        this.message = 'VOICE MEMORY SAVED';
      }else if(this.type == 'delete'){
        this.letterImg = this.heartInCircleTrash
        this.message = 'VOICE MEMORY DELETED';
      }
    } else if(this.modId == 'mesOptions' && this.memoryType == 'video'){
      if(this.type == 'send'){
        this.letterImg = this.heartInCircle
        this.message = 'VIDEO MEMORY SENT';
      }else if(this.type == 'save'){
        this.letterImg = this.heartInCircleSave
        this.message = 'VIDEO MEMORY SAVED';
      }else if(this.type == 'delete'){
        this.letterImg = this.heartInCircleTrash
        this.message = 'VIDEO MEMORY DELETED';
      }
    } else if(this.modId == 'mesOptions' && this.memoryType == 'all-in-one'){
      if(this.type == 'send'){
        this.letterImg = this.heartInCircle
        this.message = 'ALL IN ONE MEMORY SENT';
      }else if(this.type == 'save'){
        this.letterImg = this.heartInCircleSave
        this.message = 'ALL IN ONE MEMORY SAVED';
      }else if(this.type == 'delete'){
        this.letterImg = this.heartInCircleTrash
        this.message = 'ALL IN ONE MEMORY DELETED';
      }
    }else if(this.modId == 'termsAndConditions'){
    }else if(this.modId == 'text'){
      cl('modId not set')

    }
    this.appLogo = '../assets/img/app_logo.png';
    this.isCheckedtc = false;
    this.tcData = tcConditions();
  }

  dismissModal(modId){
    if(this.modId == 'mesOptions'){
      this.router.navigate(['/menu/create-new-message']);
      this.modalCtrl.dismiss();
    } else if(this.modId == 'termsAndConditions'){
      this.modalCtrl.dismiss();
      this.router.navigate(['/menu/create-new-message/letter-of-wishes']);
    }
  }

  dismissModalTC(){
    // cl(this.isCheckedtc)
    if(this.isCheckedtc){

      this.user.acceptTermsAndCondition().then((res) => {
        if(res){
          this.modalCtrl.dismiss();
        }
      })

    } else{
      this.messageCheck = 'Please make sure you check Terms and conditions.'
    }
  }

}
