import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CaptureError, CaptureVideoOptions, MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { User } from 'src/app/glob.module';
import { cl, isUndefinedString, jsonToString, randomString, secondsToHHMMSS, stringToJson, testEmogi, trimString } from 'src/app/globUtils';
import { File } from '@ionic-native/file/ngx';
import { StreamingAudioOptions, StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { Capacitor } from '@capacitor/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { MemoryModalComponent } from 'src/app/memory-modal/memory-modal.component';

import { Plugins} from "@capacitor/core";

const { Geolocation } = Plugins;



@Component({
  selector: 'app-all-in-one',
  templateUrl: './all-in-one.page.html',
  styleUrls: ['./all-in-one.page.scss'],
})
export class AllInOnePage implements OnInit {
  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;
  ionicForm: FormGroup;
  messageName: String;
  messageBody: String;
  memory: any;
  memoryName: string;
  memoryBody: string;

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

  recordedFile: boolean;
  recordedAudioFile: boolean;
  recordStopIcon: string = 'videocam';
  videoTime: string;

  videoNoteNameStatus: boolean = false;
  memoryNoteNameStatus: boolean = true;
  videoFilePath: any;

  voiceFilePath: string = this.file.externalRootDirectory;
  voiceName: any;

  playPauseIcon: string = 'play';
  videoName: string;
  startRecord: boolean = false;
  nextStatus: boolean = true;
  audioTime: any = secondsToHHMMSS(0);
  audioTimeInt: any;
  audioName: string;
  audioUri: string;
  videoMemoryPath: string;
  voiceMemoryPath: string;
  

  audioFile: MediaObject = this.media.create(this.file.externalRootDirectory+'/Recording/audioFile.mp3');
  // filePath: string = this.file.externalRootDirectory+'/Loved1z';
  audioFilePath: string = this.file.externalRootDirectory;
  status: string;
  userId: any;
  recordedAudio: string;
  recordedVideo: any;
  recordedVideoFile: boolean = false;
  recordAudioStopIcon: string = 'mic-circle';
  audioRecordingStatus: boolean = false;
  audioFullName: string;
  videoMessageStatus: boolean = false;
  videoPlayUrl: string;
  token: any;
  locationStatus: boolean = false;
  location: string = `0.0, 0.0`;
  deviceLocation: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mediaCapture: MediaCapture,
    private modalCtrl: ModalController,
    private user: User,
    private platform: Platform,
    private file: File,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private diagnostic: Diagnostic,
  ) {
    this.ionicForm = formBuilder.group({
      memoryName: new FormControl('', Validators.required),
      deliveryDate: new FormControl('', Validators.required)
    });
   }

  ngOnInit() {
    this.diagnostic.requestRuntimePermission('WRITE_EXTERNAL_STORAGE');
    this.memory = {};
    this.memoryName = '';
    this.memoryBody = '';
    this.deliveryDate = '';

    this.user.get().then((userObj)=>{
      this.userId = userObj['id'];
    });

    const coordinates = Geolocation.getCurrentPosition().then(coordinates => {
      this.deviceLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;
    });

    this.user.checkTermsAndCondition().then(res => {
      // cl(['terms Check', res])
      if(res == 1){
      } else{
        this.termsAndConditionsModal();
      }
    });

    if(this.router.getCurrentNavigation().extras.state){
      this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
      // cl('AIO:'+testEmogi,this.memory);
      if(this.memory.messageStatus === "edit-message"){
        this.memoryName = this.memory.memoryName;
        this.memoryBody = this.memory.memoryBody;
        this.memoryNoteNameStatus = false;
      }
    }

    // this.user.get().then((userObj)=>{
    //   this.userId = userObj['id'];
    //   this.token= userObj['token']
    //   this.route.queryParams.subscribe(params => {
    //     // if (params && params.voiceNoteId){
    //     //   this.memory = params;
    //     // }
    //     cl(this.router.getCurrentNavigation())
    //   });
    //   if(this.platform.is('android')) {
    //     this.platform.ready().then(() => {
    //       // this.file.checkDir(this.filePath, 'Audio');
    //     });
    //   }
    //   // cl(momentString())
    //   // cl(randomString())
    //   // cl(this.userId);
    // });

    this.memory.reminder = undefined;
    this.memory.deliveryDate = 'now';
    this.memory.repeatDelivery = undefined;

    this.recordedFile = false

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

  
  createReminder(duration){
    cl(duration)
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

  captureVideo() {

 
    console.log('Start Recording');
  //  let options: CaptureVideoOptions = { 
  //   limit: 1
  //   };
    
    this.mediaCapture.captureVideo()
    .then(
      (data: MediaFile[]) => {

        cl(['videoCapture', data[0]])
        let capturedFile = data[0];
        
        this.videoMessageStatus = true;

        // this.videoFilePath = this.sanitizer.bypassSecurityTrustUrl(capturedFile.fullPath);

        this.videoPlayUrl = Capacitor.convertFileSrc(capturedFile.fullPath);

        this.videoName = 'loved1zvideo_'+this.userId+'_'+randomString()+'.mp4';
        
        this.videoFilePath = capturedFile.fullPath;
        let params = {
          localFilePath: this.videoFilePath,
          fileName: this.videoName,
          fileType: capturedFile.type,
        }

        this.user.uploadFile(params).then((response) => { 
          cl(response)
        })
        
        this.nextStatus = false;

        // let fileName = capturedFile.name;
        // let dir = capturedFile['localURL'].split('/');
        // dir.pop();
        // let fromDirectory = dir.join('/');      
        // var toDirectory = this.file.dataDirectory;
        
        // this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
        //   // this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
        //   console.log(data)
        // });
      },
       (err: CaptureError) => console.error(err)
     );
   }

   deleteRecordedVideo(){
    this.videoMessageStatus = false;
    this.videoFilePath = null;
  }

   recordStop(){
    if(trimString(this.ionicForm.value.memoryName)==''){
      this.videoNoteNameStatus = false;
    }else{
      if(this.recordAudioStopIcon == 'mic-circle'){
        this.startRecord = true;
        // this.recordAudioStopIcon = 'heart-circle';
        cl('record')
        this.recordAudio();
      } else if(this.recordAudioStopIcon == 'trash'){
        this.nextStatus = true;
        this.audioRecordingStatus = false;
        this.startRecord = false;
        this.recordAudioStopIcon = 'mic-circle';
      }
    }
  }

  playPause(){
    if(this.playPauseIcon == 'play'){
      // this.playPauseIcon = 'pause';
      this.playAudio();
      // this.recordAudio();
    }
  }

  playAudio(){
    let options: StreamingAudioOptions = {
      successCallback: () => { console.log() },
      errorCallback: () => { console.log() },
      initFullscreen: true
    }
    // this.audioUri = this.audioFilePath+this.audioName+'.mp3';
    cl(this.audioUri)
    this.streamingMedia.playAudio( this.audioUri , options);
  }


  recordAudio() {
    this.mediaCapture.captureAudio().then(
      (data: MediaFile[]) => {
        const metadata = {
          contentType: 'audio/mp3',
        };
        if (data.length > 0) {
          this.audioName = 'loved1zAudio_'+this.userId+'_'+randomString()+'.mp3';
          this.audioUri = data[0].fullPath;
          let params = {
            localFilePath: data[0].fullPath,
            fileName: this.audioName,
            fileType: data[0].type,
          }
  
          this.user.uploadFileAudio(params).then((response) => { })
          this.audioFullName = this.audioName ;
          this.nextStatus = false;
          this.audioRecordingStatus = true;
          this.recordAudioStopIcon = 'trash';
          // cl(['nextStatus', this.nextStatus])
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }
  




  onChangeVoiceNoteName(e){
    if(trimString(this.ionicForm.value.memoryName)==''){
      this.memoryNoteNameStatus = true;
    }else{
      this.memoryNoteNameStatus = false;
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

  toogleOptions(option: string, e: any){
    if(option == 'reminder'){
      if(e.detail.checked){
        this.createRemainderStatus = false;
      }else{
        this.memory.reminder = undefined;
        this.createReminderDaily = false;
        this.createReminderWeekly = false;
        this.createReminderMonthly = false;
        this.createRemainderStatus = true;
      }
    } else if(option == 'deliveryDate'){
      cl(e.detail.checked)
      if(e.detail.checked){

        this.deliveryDateStatus = false;
      }else{
        this.deliveryDateStatus = true;
      }
    } else if(option == 'repeatDelivery'){
      if(e.detail.checked){
        this.repeatDeliveryStatus = false;
      }else{
        this.memory.repeatDelivery = undefined;
        this.repeatDeliveryDaily = false;
        this.repeatDeliveryWeekly = false;
        this.repeatDeliveryMonthly = false;
        this.repeatDeliveryYearly = false;
        this.repeatDeliveryStatus = true;
      }
    } else if(option == 'setLocation'){
      if(e.detail.checked){
        this.locationStatus = false;
        this.location = `0.0, 0.0`;
      }else{
        
        this.location = this.deviceLocation;
        this.locationStatus = true;
      }
      // cl('locationStatus',  this.locationStatus)
    }
  }


  submitForm(){
    this.memory.memoryType = 'all-in-one';
    this.memory.messageStatus = 'createAllInOne';
    this.memory.memoryName =  this.ionicForm.value.memoryName;
    this.memory.memoryBody = this.ionicForm.value.memoryBody;
    this.memory.videoMemory = this.videoName;
    this.memory.voiceMemory = this.audioFullName;
    
    this.memory.audioLocalUrl = this.audioUri;
    this.memory.videoLocalUrl = this.videoFilePath;
    this.memory.videoMemoryPath = this.videoName;
    this.memory.location = this.location;

    this.memory.voiceMemoryPath = this.audioName;
    this.memory.videoMemoryPath = this.videoName;



    if(this.memory.videoMemory == undefined){
      this.memory.videoMemory = 'dev_test_video'
    } 
    if(this.memory.voiceMemory == undefined){
      this.memory.voiceMemory = 'dev_test_voice'
    }

    
    if(this.deliveryDateStatus==false){
      if(this.ionicForm.value.deliveryDate !== ""){
        this.memory.deliveryDate = this.ionicForm.value.deliveryDate;
      }
    }else{
      this.memory.deliveryDate = 'now';
    }

    // cl(this.memory)

    if(!isUndefinedString(this.memory.memoryName)){
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
