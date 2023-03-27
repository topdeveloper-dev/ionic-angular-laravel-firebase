import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CaptureVideoOptions, MediaCapture, CaptureError, MediaFile } from '@ionic-native/media-capture/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
//import { FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer/ngx';
//import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { IonUtils, User } from 'src/app/glob.module';
import { cl, isUndefinedString, jsonToString, randomString, secondsToHHMMSS, stringToJson, trimString } from 'src/app/globUtils';
import { MemoryModalComponent } from 'src/app/memory-modal/memory-modal.component';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';

import { Plugins} from "@capacitor/core";

const { Geolocation } = Plugins;

// import { Diagnostic } from '@ionic-native/diagnostic/ngx';
// import { VideoCapturePlus, VideoCapturePlusOptions } from '@ionic-native/video-capture-plus';
@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {

  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;

  memory: any = {};
  memoryName: string = '';
  videoNoteBody: string = '';
  memoryNameStatus: boolean = true;
  nextStatus: boolean = true;
  ionicForm: any;
  userId: any;
  videoTime: string;
  startRecord: boolean;
  recordedFile: boolean;
  playPauseIcon: string;
  videoTimeInt: any;
  videoName: string;
  videoUri: string;
  videoFilePath: any='';
  videoFile: any;
  videoUploadres: any;
  status: string;
  curr_playing_file: any;
  get_duration_interval: any;
  duration: any;
  display_duration: string;
  is_playing: boolean;
  position: any;
  display_position: string;
  recordedVideo: any;

  recordStopIcon: string = 'videocam';

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
  recordedvideo: string;
  videoMessageStatus: boolean = false;
  videoPlayUrl: string;
  locationStatus: boolean = false;
  location: string = `0.0, 0.0`;
  deviceLocation: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private mediaCapture: MediaCapture, 
    private media: Media,  
    //private file: File,
    private storage: Storage, 
    public navCtrl: NavController,
    private ionUtils: IonUtils,
    public platform: Platform,
    public streamingMedia: StreamingMedia,
    public user: User,
    public diagnostic: Diagnostic,
    private sanitizer: DomSanitizer
   // private transfer: FileTransfer
  ) { 
    this.ionicForm = formBuilder.group({
      memoryName: new FormControl('', Validators.required),
      deliveryDate: new FormControl('', Validators.required)
    });
  }

  

  ngOnInit() {
    this.diagnostic.requestRuntimePermission('WRITE_EXTERNAL_STORAGE');
    this.user.checkTermsAndCondition().then(res => {
      // cl(['terms Check', res])
      if(res == 1){
      } else{
        this.termsAndConditionsModal();
      }
    })

    //alert(2);

    this.user.get().then((userObj)=>{
      this.userId = userObj['id'];
      cl( 'checking user id ', this.userId );
     // alert( 'checking user id ' + this.userId );
      this.route.queryParams.subscribe(params => {
        // if (params && params.videoNoteId){
        //   this.memory = params;
        // }
        cl(this.router.getCurrentNavigation())
        if(this.router.getCurrentNavigation() != null ){
          if(this.router.getCurrentNavigation().extras.state){
            this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
            // cl(this.memory);
          }
        }
      });
      if(this.platform.is('android')) {
        this.platform.ready().then(() => {
          // this.file.checkDir(this.filePath, 'video');
        });
      }
      // cl(momentString())
      // cl(randomString())
      // cl(this.userId);
      
    });

    const coordinates = Geolocation.getCurrentPosition().then(coordinates => {
      this.deviceLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;
    })


    this.memory.reminder = undefined;
    this.memory.deliveryDate = 'now';
    this.memory.repeatDelivery = undefined;

    if(this.router.getCurrentNavigation().extras.state){
      this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
      // cl('memory=> '+testEmogi,this.memory);

      if(this.memory.messageStatus === "edit-message"){
        this.memoryName = this.memory.memoryName;
        this.memoryNameStatus = false;
      }
      
    }

    /*this.ionicForm = new FormGroup({
      memoryName: new FormControl('', Validators.required),
      deliveryDate: new FormControl('', Validators.required)
    });*/

    

    /*
    this.ionicForm = this.formBuilder.group({
      memoryName: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]]
    });*/

    
    // this.videoTime = this.toHHMMSS(0);
    
  }



  // recordStop(){
  //   if(trimString(this.ionicForm.value.memoryName)==''){
  //     this.memoryNameStatus = true;
  //   }else{
  //     if(this.recordStopIcon == 'videocam'){
  //       this.startRecord = true;
  //       this.recordStopIcon = 'heart-circle';
  //       // this.recordVideo();
  //     }else if(this.recordStopIcon == 'heart-circle'){
  //       // cl(123)
  //       clearInterval(this.videoTimeInt);
  //       this.nextStatus = false;
  //       this.recordedFile = true;
  //       this.recordStopIcon = 'trash';
  //       // this.stopRecording();
  //     }else if(this.recordStopIcon == 'trash'){
  //       this.nextStatus = true;
  //       this.recordedFile = false;
  //       this.startRecord = false;
  //       this.recordStopIcon = 'videocam';
  //       this.videoTime = secondsToHHMMSS(0);
  //     }
  //   }
  // }

  // playPause(){
  //   if(this.playPauseIcon == 'play'){
  //     this.playPauseIcon = 'pause';
  //     this.playvideo();
  //     // this.recordvideo();
  //   }else if(this.playPauseIcon == 'pause'){
  //     this.recordedFile = true;
  //     this.playPauseIcon = 'play';
  //     this.pausevideo();
  //     // this.stopRecording();
  //   }
  // }

  onChangememoryName(e){
  console.log(e.key);
    //if(trimString(this.ionicForm.value.memoryName)==''){
	if(trimString(e.key)==''){
      this.memoryNameStatus = true;
    }else{
      this.memoryNameStatus = false;
    }
  }

  // recordVideo(){
  //   let secs = 0;
  //   this.videoTimeInt = setInterval(() => { 
  //     secs++;
  //     this.videoTime = secondsToHHMMSS(secs);
  //     // cl(this.toHHMMSS(secs));
  //   }, 1000);
  //   this.videoName = 'loved1zvideo_'+this.userId+'_'+randomString();
  //   // if(this.platform.is('android')) {
	// 	// 	this.file.checkDir(this.file.dataDirectory, 'mydir');
  //   // }
  //   if (this.platform.is('ios')) {
  //     this.videoUri = this.
  //     videoFilePath.replace(/file:\/\//g, '')+this.videoName+'.m4a';
  //   } else if (this.platform.is('android')){
  //     this.videoUri = this.videoFilePath.replace(/file:\/\//g, '')+this.videoName+'.3gp';
  //   }
  //   cl(['video-Uri',this.videoUri])
  //   this.videoFile = this.media.create(this.videoUri);
  //   this.videoFile.startRecord();
  //   this.status = "recording...";
  // }

  // stopRecording(){
  //   clearInterval(this.videoTimeInt);
  //   this.videoFile.stopRecord()
  //   this.status = "Stopped";

  //   // cl(this.status)

  //   if (this.platform.is('ios')) {
  //     this.file.readAsDataURL(this.file.tempDirectory, this.videoName+'.m4a').then((base64File) => {
  //       console.log(base64File);
  //       this.recordedvideo = base64File;
  //     }).catch((error) => { console.log("file error", error) })
  //   } else if (this.platform.is('android')) {
  //     this.file.readAsDataURL(this.file.externalRootDirectory, this.videoName+'.3gp').then((base64File) => {
  //       console.log(base64File);
  //       this.recordedvideo = base64File;
  //     }).catch((error) => { console.log("file error", error) })
  //   }
  // }

  // startVideo(){
  //   // this.videoUri = this.videoFilePath.replace(/file:\/\//g, '')+this.videoName+'.3gp';
  //   let options: StreamingVideoOptions = {
  //     successCallback: () => { console.log('Video played') },
  //     errorCallback: (e) => { console.log('Error streaming') },
  //     orientation: 'landscape',
  //     shouldAutoClose: true,
  //     controls: false
  //   }

  //   this.streamingMedia.playVideo(this.videoFilePath , options);
  // }


  // stop(){

  // }

  // play() {
  //   this.curr_playing_file.play();
  // }

  // pause() {
  //   this.curr_playing_file.pause();
  // }

  // toHHMMSS(secs) {
  //   var sec_num = parseInt(secs, 10)
  //   var minutes = Math.floor(sec_num / 60) % 60
  //   var seconds = sec_num % 60

  //   return [minutes, seconds]
  //     .map(v => v < 10 ? "0" + v : v)
  //     .filter((v, i) => v !== "00" || i >= 0)
  //     .join(":")
  // }

  

  // capturevideo() {
  //   this.mediaCapture.capturevideo().then(res => {
      
  //     this.storeMediaFiles(res);
  //   }, (err: CaptureError) => console.error(err));
  // }

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

        /*let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: this.videoName,
          chunkedMode: false,
          //mimeType: "multipart/form-data",
          params : {'fileName': this.videoName},
          headers: {}
    
       }*/

      // const fileTransfer: FileTransferObject = this.transfer.create();

   // var uloadurl = 'https://lovedonez.etopick.com/apiupload.php';
    /*fileTransfer.upload(this.videoFilePath, uloadurl, options, true).then((result) => {
      alert(result);
    }, (err) => {
      // error
      alert(err);
    }); 

    fileTransfer.onProgress((data) => {
      alert(Math.round((data.loaded/data.total) * 100)) ;
    });*/

        this.user.uploadFile(params).then((response) => { 
		    //  alert(response);
          cl(response)
          this.videoUploadres = response;
          this.nextStatus = false;
        })
        
       

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
       (err: CaptureError) =>  alert(err) //console.error(err)
     );
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

  deleteRecordedVideo(){
    this.videoMessageStatus = false;
    this.videoFilePath = null;
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

  if(option == 'reminder'){
    if(e.detail.checked){
      this.createRemainderStatus = false;
    }else{
      this.createReminderWeekly = false;
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
  } else if(option == 'repeatDelivery'){
    if(e.detail.checked){
      this.repeatDeliveryStatus = false;
    }else{
      this.repeatDeliveryYearly = false;
      this.repeatDeliveryYearly = false;
      this.repeatDeliveryMonthly = false;
      this.repeatDeliveryYearly = false;
      this.repeatDeliveryStatus = true;
    }
  }else if(option == 'setLocation'){
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


// next(){
//   this.submitForm();
// }

  submitForm(){
   // alert(this.videoUploadres);
   
    this.memory.memoryType    = 'video';
    this.memory.messageStatus = 'createVideoNote'
    this.memory.memoryName =  this.ionicForm.value.memoryName;
    this.memory.videoMemory = this.videoName;
    this.memory.videoLocalUrl = this.videoFilePath;
    this.memory.location = this.location;
    this.memory.videoMemoryPath = this.videoName;
     //alert(this.memory.videoLocalUrl);

    if(this.memory.videoMemory == undefined){
      this.memory.videoMemory = 'video_memory_devTest';
    }

    if(this.ionicForm.value.deliveryDate !== ""){
      this.memory.deliveryDate = this.ionicForm.value.deliveryDate;
    }
    
    // cl([123, this.memory])
    if(!isUndefinedString(this.memory.memoryName) && this.nextStatus == false){
      let data = jsonToString(this.memory);
      let navigationExtras: NavigationExtras = {
        state: {
          memory: data
        }
      };
      this.router.navigate(['/menu/create-new-message/receiver-details-form'], navigationExtras);
    //} else{
      // alert('Video file not uploaded');
     }
  }

}
