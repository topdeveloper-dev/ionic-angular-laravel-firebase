import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { StreamingAudioOptions, StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Storage } from '@ionic/storage';
import { IonUtils, User } from 'src/app/glob.module';
import { cl, isUndefinedString, jsonToString, randomString, secondsToHHMMSS, stringToJson, trimString } from 'src/app/globUtils';
import { MemoryModalComponent } from 'src/app/memory-modal/memory-modal.component';
import { Platform, LoadingController } from '@ionic/angular';

import { Base64 } from '@ionic-native/base64/ngx';

import { Plugins} from "@capacitor/core";

const { Geolocation } = Plugins;
// import { parse } from 'path';


const MEDIA_FILES_KEY = 'mediaFiles';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.page.html',
  styleUrls: ['./voice.page.scss'],
})
export class VoicePage implements OnInit {
  files = [];
  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;
  memory: any = {};
  ionicForm: any;
  memoryName: string = '';
  voiceNoteBody: string = '';
  testAudio: string;
  // curr_playing_file: MediaObject;

  title: any;
  artist: any;
  image: string = '';
  filename: any = 'Baba O`reily';
  duration: any = -1;
  curr_playing_file: MediaObject;
  storageDirectory: any;
  play_The_track: string = "../assets/sound/test.amr"; //note this specific url format is used in android only
  position: any = 0;
  get_position_interval: any;
  is_playing = false;
  is_in_play = false;
  is_ready = false;
  get_duration_interval: any;
  display_position: any = '00:00';
  display_duration: any = '00:00';

  //audioFile: MediaObject = this.media.create(this.file.externalRootDirectory+'/Recording/audioFile.mp3');
  // filePath: string = this.file.externalRootDirectory+'/Loved1z';
 // audioFilePath: string = this.file.externalRootDirectory;
  status: string = 'recording status';
  recordAudioStopIcon: string = 'mic-circle';
  userId: any;
  audioName: string;
  audioRecordingStatus: boolean = false;
  playPauseIcon: string = 'play';
  startRecord: boolean = false;
  memoryNameStatus: boolean = false;
  nextStatus: boolean = true;
  audioTime: any;
  audioTimeInt: any;
  audioUri: string;
  recordedAudio: string;
  voiceMemoryPath: string;


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
  audioFullName: string;
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
   // private file: File,
    private storage: Storage,
    public navCtrl: NavController,
    private ionUtils: IonUtils,
    public platform: Platform,
    public streamingMedia: StreamingMedia,
    public user: User,
    private base64: Base64,

  ) {
    this.ionicForm = formBuilder.group({
      memoryName: new FormControl('', Validators.required),
      deliveryDate: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    // cl(['nextStatus', this.nextStatus])
    this.memory.reminder = undefined;
    this.memory.deliveryDate = 'now';
    this.memory.repeatDelivery = undefined;

    this.user.checkTermsAndCondition().then(res => {
      // cl(['terms Check', res])
      if(res == 1){
      } else{
        this.termsAndConditionsModal();
      }
    })

    this.user.get().then((userObj)=>{
      this.userId = userObj['id'];
      this.route.queryParams.subscribe(params => {
        // if (params && params.voiceNoteId){
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
          // this.file.checkDir(this.filePath, 'Audio');
        });
      }
      // cl(momentString())
      // cl(randomString())
      // cl(this.userId);
    });

    const coordinates = Geolocation.getCurrentPosition().then(coordinates => {
      this.deviceLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;
    });

    if(this.router.getCurrentNavigation().extras.state){
      this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
      // cl('memory=> '+testEmogi,this.memory);
      if(this.memory.messageStatus === "edit-message"){
        this.memoryName = this.memory.memoryName;
        this.memoryNameStatus = false;
      }
    }

    this.ionicForm = this.formBuilder.group({
      memoryName: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]]
    });



    
    this.audioTime = secondsToHHMMSS(0);
    // this.timerTick();
  }

  recordStop(){
    if(trimString(this.ionicForm.value.memoryName)==''){
      this.memoryNameStatus = false;
    }else{
      if(this.recordAudioStopIcon == 'mic-circle'){
        this.startRecord = true;
        // this.recordAudioStopIcon = 'heart-circle';
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

  onChangememoryName(e){
    if(trimString(this.ionicForm.value.memoryName)==''){
      this.memoryNameStatus = false;
    }else{
      this.memoryNameStatus = true;
    }
  }


recordAudio() {
  this.mediaCapture.captureAudio().then(
    (data: MediaFile[]) => {
      const metadata = {
        contentType: 'audio/amr',
      };
     // let capturedFile = data[0];
      if (data.length > 0) {
        this.audioName = 'loved1zAudio_'+this.userId+'_'+randomString()+'.amr';
        this.audioUri = data[0].fullPath;
        let params = {
          localFilePath: data[0].fullPath,
          fileName: this.audioName,
          fileType: data[0].type,
        }

        this.user.uploadFileAudio(params).then((response) => { 
          //alert(response);
        })
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




copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    var newName = `${d}.${ext}`;
    this.audioName = 'loved1zAudio_'+this.userId+'_'+randomString();

    newName = this.audioName;

    cl(['audio_newName', newName])

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
   // const copyTo = this.file.dataDirectory ;

   /* this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();
      },
      error => {
        console.log('error: ', error);
      }
    );*/
  }

  openFile(f: FileEntry) {
    if (f.name.indexOf('.wav') > -1) {
      // We need to remove file:/// from the path for the audio plugin to work
      const path =  f.nativeURL.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();
    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(f.nativeURL);
    } else if (f.name.indexOf('.jpg') > -1) {
      // E.g: Use the Photoviewer to present an Image
      // this.photoViewer.show(f.nativeURL, 'MY awesome image');
    }
  }

  deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
   /* this.file.removeFile(path, f.name).then(() => {
      this.loadFiles();
    }, err => console.log('error remove: ', err));*/
  }

  loadFiles() {
    /*this.file.listDir(this.file.dataDirectory, MEDIA_FILES_KEY).then(
      res => {
        this.files = res;
      },
      err => console.log('error loading files: ', err)
    );*/
  }

  // ___________________________________________________________________________________


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

  pauseAudio(){
    this.streamingMedia.pauseAudio();
  }

  stop(){

  }

  prepareAudioFile() {
    this.platform.ready().then((res) => {
      this.getDuration();
    });
  }

  getDuration() {
    this.curr_playing_file = this.media.create(this.play_The_track);
    // on occassions, the plugin only gives duration of the file if the file is played
    // at least once
    this.curr_playing_file.play();

    this.curr_playing_file.setVolume(0.0);  // you don't want users to notice that you are playing the file
    const self = this;
    // The plugin does not give the correct duration on playback start
    // Need to check for duration repeatedly
    let temp_duration = self.duration;
    this.get_duration_interval = setInterval(() => {
      if (self.duration === -1 || !self.duration) {
        self.duration = ~~(self.curr_playing_file.getDuration());  // make it an integer
      } else {
        if (self.duration !== temp_duration) {
          temp_duration = self.duration;
        }
        else {
          self.curr_playing_file.stop();
          self.curr_playing_file.release();

          clearInterval(self.get_duration_interval);
          this.display_duration = secondsToHHMMSS(self.duration);
          self.setToPlayback();
        }
      }
    }, 100);
  }

  setToPlayback() {
    this.curr_playing_file = this.media.create(this.play_The_track);
    this.curr_playing_file.onStatusUpdate.subscribe(status => {
      switch (status) {
        case 1:
          break;
        case 2:   // 2: playing
          this.is_playing = true;
          break;
        case 3:   // 3: pause
          this.is_playing = false;
          break;
        case 4:   // 4: stop
        default:
          this.is_playing = false;
          break;
      }
    });
    this.is_ready = true;
    this.getAndSetCurrentAudioPosition();
  }

  getAndSetCurrentAudioPosition() {
    const diff = 1;
    const self = this;
    this.get_position_interval = setInterval(() => {
      const last_position = self.position;
      self.curr_playing_file.getCurrentPosition().then((position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            self.curr_playing_file.seekTo(last_position * 1000);

          } else {
            // update position for display
            self.position = position;
            this.display_position = secondsToHHMMSS(self.position);
          }
        } else if (position >= self.duration) {
          self.stop();
          self.setToPlayback();
        }
      });
    }, 100);
  }

  play() {
    this.curr_playing_file.play();
  }

  pause() {
    this.curr_playing_file.pause();
  }

  // stop() {
  //   this.curr_playing_file.stop();
  //   this.curr_playing_file.release();
  //   clearInterval(this.get_position_interval);
  //   this.position = 0;
  // }


  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }

  controlSeconds(action) {
    const step = 5;
    const numberRange = this.position;
    switch (action) {
      case 'back':
        this.position = numberRange < step ? 0.001 : numberRange - step;
        break;
      case 'forward':
        this.position = numberRange + step < this.duration ? numberRange + step : this.duration;
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.stop();
  }

  // secondsToHHMMSS(secs) {
  //   var sec_num = parseInt(secs, 10)
  //   var minutes = Math.floor(sec_num / 60) % 60
  //   var seconds = sec_num % 60

  //   return [minutes, seconds]
  //     .map(v => v < 10 ? "0" + v : v)
  //     .filter((v, i) => v !== "00" || i >= 0)
  //     .join(":")
  // }



  captureAudio() {
    alert('start record');
    this.mediaCapture.captureAudio().then(res => {

      this.storeMediaFiles(res);
    }, (err: CaptureError) => console.error(err));
  }

  captureVideo() {
    alert('start record 2');
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
     // var toDirectory = this.file.dataDirectory;

      /*this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
        this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
      },err => {
        console.log('err: ', err);
      });*/
          },
    (err: CaptureError) => console.error(err));
  }

  // play(myFile) {
  //   if (myFile.name.indexOf('.amr') > -1) {
  //     const audioFile: MediaObject = this.media.create(myFile.localURL);
  //     audioFile.play();
  //   } else {
  //     let path = this.file.dataDirectory + myFile.name;
  //     let url = path.replace(/^file:\/\//, '');
  //     let video = this.myVideo.nativeElement;
  //     video.src = url;
  //     video.play();
  //   }
  // }

  storeMediaFiles(files) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
        this.ionUtils.alertSuccess({
          header: 'Alert',
          subHeader: 'data',
          message: jsonToString(arr),
        });
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files));
        this.ionUtils.alertSuccess({
          header: 'Alert',
          subHeader: 'data',
          message: jsonToString(files),
        });
      }
      this.mediaFiles = this.mediaFiles.concat(files);


    })
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

   async convertAudioToBase64(aAudioRecording): Promise<{}> {
    return new Promise(async resolve => {
      // cl(['convertAudioToBase64_check',aAudioRecording[0]])
    //  let lAudioSource: any = await this.file.resolveLocalFilesystemUrl(aAudioRecording[0].fullPath);
      // cl(['resolve_Url',aAudioRecording[0]])
      // let resolveDirectoryUrl: any = await this.file.resolveDirectoryUrl(aAudioRecording);

      /*lAudioSource.file(resFile => {
        // cl(resFile)
        let lReader = new FileReader();
        lReader.readAsDataURL(resFile);
        lReader.onloadend = async (evt: any) => {
          // cl(evt);
          // return;
                let lEncodingType: string;

                if (this.platform.is('ios')) {
                    lEncodingType = "data:audio/mp3;base64,";
                } else if(this.platform.is('android')) {
                    lEncodingType = "data:audio/x-m4a;base64,";
                }
                
                let lOriginalBase64 = evt.target.result.split(",")[1]; // Remove the "data:video..." string.
                let lDecodedBase64 = atob(lOriginalBase64); // Decode the incorrectly encoded base64 string.
                let lEncodedBase64 = btoa(lDecodedBase64); // re-encode the base64 string (correctly).
                let lNewBase64 = lEncodingType + lEncodedBase64; // Add the encodingType to the string.
                resolve(lNewBase64);
            };
        }); */
    });
}

createReminder(duration){
  this.memory.reminder = duration;
  if(duration == 'daily'){
    this.createReminderWeekly = true;
    this.createReminderWeekly = false;
    this.createReminderMonthly = false;
  } else if(duration == 'weekly'){
    this.createReminderWeekly = false;
    this.createReminderWeekly = true;
    this.createReminderMonthly = false;
  } else if(duration == 'monthly'){
    this.createReminderWeekly = false;
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


// next(){
//   this.submitForm();
// }

  submitForm(){


    this.memory.memoryType = 'voice';
    this.memory.messageStatus = 'createVoiceNote'
    this.memory.memoryName =  this.ionicForm.value.memoryName;
    this.memory.voiceNote = this.recordedAudio;
    this.memory.audioLocalUrl = this.audioUri;
    this.memory.location = this.location;
    this.memory.voiceMemoryPath = this.audioFullName;
    //alert(this.voiceMemoryPath);

    if(this.memory.voiceNote == undefined){
      this.memory.voiceNote = 'dev_test_audio';
    }
    // cl(['voiceNote', this.memory])

    if(this.ionicForm.value.deliveryDate !== ""){
      this.memory.deliveryDate = this.ionicForm.value.deliveryDate;
    }
    cl(this.memory)
    // cl([123, this.memory])
    if(!isUndefinedString(this.memory.memoryName)){
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
