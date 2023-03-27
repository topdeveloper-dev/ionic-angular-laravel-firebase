import {Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { User } from 'src/app/glob.module';
import { cl, isUndefinedString, jsonToString, momentStringForm, stringToJson, testEmogi } from 'src/app/globUtils';
import { MemoryModalComponent } from 'src/app/memory-modal/memory-modal.component';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx'

// import { Geolocation } from '@ionic-native/geolocation/ngx';

import { Plugins} from "@capacitor/core";

const { Geolocation } = Plugins;


@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
})
export class TextPage implements OnInit {

map: any;
marker: any;
latitude: any;
longitude: any;
timesatamp: any;

@ViewChild('mapElement') mapElement;


  memory: any;
  memoryName: string;
  memoryBody: string;
  ionicForm: any;

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
  locationStatus: boolean = true;
  location: string = '0.0,0.0';
  deviceLocation: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private user: User,
    private nativeStorage: NativeStorage,
    private platform: Platform,

    // private geolocation: Geolocation,
  ) {

    this.user.checkTermsAndCondition().then(res => {
      // cl(['checkTermsAndCondition', res])
      if(res == 1){

      } else{
        this.termsAndConditionsModal();
      }
    })

   }


  ngOnInit() {
    this.nativeStorage.getItem('myitem')
  .then(
    data => console.log(data),
    error => console.error(error)
  );

    //-----------------date-Time
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    //--------------------------

    this.memory = {};
    this.memoryName = '';
    this.memoryBody = '';
    this.deliveryDate = '';

    this.memory.reminder = undefined;
    this.memory.deliveryDate = dateTime;
    this.memory.repeatDelivery = undefined;

    const coordinates = Geolocation.getCurrentPosition().then(coordinates => {
      this.deviceLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;
    })
    this.route.queryParams.subscribe(params => {
      // if (params && params.textId){
      //   this.memory = params;
      // }
      if(this.router.getCurrentNavigation().extras.state){
        this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
        // cl('memory=> '+testEmogi,this.memory);

        if(this.memory.messageStatus === "edit-message"){
          this.memoryName = this.memory.memoryName;
          this.memoryBody = this.memory.memoryBody;
        }

      }
    });
    this.ionicForm = this.formBuilder.group({
      memoryName: ['', [Validators.required]],
      memoryBody: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]]
    });

    this.currentDateTime = momentStringForm();



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

  createReminder(duration){
    this.memory.reminder = duration;
    if(duration == 'daily'){
      this.createReminderDaily = true;
      this.createReminderWeekly = false;
      this.createReminderMonthly = false;
    } else if(duration == 'weekly'){
      this.createReminderDaily = false;
      this.createReminderWeekly = true;
      this.createReminderMonthly = false;
    } else if(duration == 'monthly'){
      this.createReminderDaily = false;
      this.createReminderWeekly = false;
      this.createReminderMonthly = true;
    }
  }



  repeatDelivery(duration){
    this.memory.repeatDelivery = duration;
    if(duration == 'daily'){
      this.repeatDeliveryDaily = true;
      this.repeatDeliveryWeekly = false;
      this.repeatDeliveryMonthly = false;
      this.repeatDeliveryYearly = false;
    } else if(duration == 'weekly'){
      this.repeatDeliveryDaily = false;
      this.repeatDeliveryWeekly = true;
      this.repeatDeliveryMonthly = false;
      this.repeatDeliveryYearly = false;
    } else if(duration == 'monthly'){
      this.repeatDeliveryDaily = false;
      this.repeatDeliveryWeekly = false;
      this.repeatDeliveryMonthly = true;
      this.repeatDeliveryYearly = false;
    } else if(duration == 'yearly'){
      this.repeatDeliveryDaily = false;
      this.repeatDeliveryWeekly = false;
      this.repeatDeliveryMonthly = false;
      this.repeatDeliveryYearly = true;
    }
  }

  toogleOptions(option, e){

    // cl(option, e)

    if(option == 'reminder'){
      if(e.detail.checked){
        this.createRemainderStatus = false;
      }else{
        this.createReminderDaily = false;
        this.createReminderWeekly = false;
        this.createReminderMonthly = false;
        this.createRemainderStatus = true;
      }
    } else if(option == 'deliveryDate'){
      if(e.detail.checked){
        this.deliveryDateStatus = false;

      }else{
        this.deliveryDateStatus = true;
      }
    }
    else if(option == 'repeatDelivery'){
      if(e.detail.checked){
        this.repeatDeliveryStatus = false;
      }else{
        this.repeatDeliveryDaily = false;
        this.repeatDeliveryWeekly = false;
        this.repeatDeliveryMonthly = false;
        this.repeatDeliveryYearly = false;
        this.repeatDeliveryStatus = true;
      }
    } else if(option == 'setLocation'){
      if(e.detail.checked){
        this.location = this.deviceLocation;
        this.locationStatus = true;
      }else{
        this.locationStatus = false;
        this.location = `0.0, 0.0`;
      }
      // cl('locationStatus',  [this.locationStatus, this.location])
    }
  }

  // previewMemory(){
  //   this.user.get().then((userObj)=>{
  //     this.memory.senderName = userObj['firstName']+' '+userObj['lastName'];
  //     this.memory.messageStatus == 'createMessage';
  //     let data = jsonToString(this.memory);
  //     // cl(data)
  //     let navigationExtras: NavigationExtras = {
  //       state: {
  //         memory: data
  //       }
  //     };
  //     this.router.navigate(['/menu/view-message/message'], navigationExtras);
  //   })
  // }
  submitForm(){


    this.nativeStorage.setItem('myitem', {property: 'value', anotherProperty: 'anotherValue'})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );

    this.memory.memoryType = 'text';
    this.memory.messageStatus = 'createMessage'
    this.memory.memoryName =  this.ionicForm.value.memoryName;
    this.memory.memoryBody = this.ionicForm.value.memoryBody;
    this.memory.location = this.location;
    this.memory.imageMemoryPath = 'note_applicable';
    this.memory.videoMemoryPath = 'note_applicable';
    this.memory.voiceMemoryPath = 'note_applicable';
    // cl(this.ionicForm.value.deliveryDate)
    if(this.ionicForm.value.deliveryDate !== ""){
      this.memory.deliveryDate = this.ionicForm.value.deliveryDate;
    }
    if(!isUndefinedString(this.memory.memoryName) && !isUndefinedString(this.memory.memoryBody)){
      let data = jsonToString(this.memory);
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
