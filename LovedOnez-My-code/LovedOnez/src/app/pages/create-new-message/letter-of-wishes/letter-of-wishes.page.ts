//import { isDefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/glob.module';
import { cl, isUndefinedString, jsonToString, stringToJson, testEmogi } from 'src/app/globUtils';
import { MemoryModalComponent } from 'src/app/memory-modal/memory-modal.component';

@Component({
  selector: 'app-letter-of-wishes',
  templateUrl: './letter-of-wishes.page.html',
  styleUrls: ['./letter-of-wishes.page.scss'],
})
export class LetterOfWishesPage implements OnInit {
  ionicForm: FormGroup;
  memoryName: String;
  memoryBody: String;
  memory: any;
  textName: string;
  textBody: string;

  createReminderDaily: boolean = false;
  createReminderWeekly: boolean = false;
  createReminderMonthly: boolean = false;

  repeatDeliveryDaily: boolean = false;
  repeatDeliveryWeekly: boolean = false;
  repeatDeliveryMonthly: boolean = false;
  repeatDeliveryYearly: boolean = false;

  createRemainderStatus: boolean = true;
  deliveryDateStatus: boolean = true;
  repeatDeliveryStatus: boolean = true;
  deliveryDate: string;
  currentDateTime: string;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private user: User,
  ) {

    // this.termsAndConditionsModal();
  }


  ngOnInit() {

      //date-Time
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
      //--------------------------

    this.memory = {};
    this.memoryName = '';
    this.memoryBody = '';
    this.deliveryDate = '';

    this.memory.deliveryDate = "dateTime";
    this.user.checkTermsAndCondition().then(res => {
      // cl(['terms Check', res])
      if(res == 1){
      } else{
        this.termsAndConditionsModal();
      }
    })
    if(this.router.getCurrentNavigation().extras.state){
	
      this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
      cl('memory=> '+testEmogi,this.memory);

      if(this.memory.messageStatus === "edit-message"){
        this.memoryName = this.memory.memoryName;
        this.memoryBody = this.memory.memoryBody;
        // this.memoryNameStatus = false;
      }

    }
    this.ionicForm = this.formBuilder.group({
      memoryName: ['', [Validators.required]],
      memoryBody: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]]
    });

  }

  async termsAndConditionsModal(){
    //  ionic g c memory-modal
    const modal = await this.modalCtrl.create({
      component: MemoryModalComponent,
      cssClass: 'my-custom-class',
      componentProps: {modId: 'termsAndConditions'}
    });
    await modal.present();
  }

  submitForm(){
    this.memory.memoryType = 'letter-of-wishes';
    this.memory.messageStatus = 'createMessage';
    this.memory.memoryName =  this.ionicForm.value.memoryName;
    this.memory.memoryBody = this.ionicForm.value.memoryBody;
    //this.memory.deliveryDate = defaultdate.setDate(Date.now());

    if(this.ionicForm.value.deliveryDate !== ""){
      this.memory.deliveryDate = this.ionicForm.value.deliveryDate;
    }

    if(!isUndefinedString(this.memory.memoryName) && !isUndefinedString(this.memory.memoryBody)){
      var defaultdate = new Date();
      let data = jsonToString(this.memory);
      // cl(data)
      let navigationExtras: NavigationExtras = {
        state: {
          memory: data
        }
      };

      this.router.navigate(['/menu/create-new-message/receiver-details-form'], navigationExtras);
    }else{
    }
  }
}
