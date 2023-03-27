//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { StreamingAudioOptions, StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { Platform } from '@ionic/angular';
import { User, IonUtils } from 'src/app/glob.module';
import { cl, isUndefinedString, jsonToString, stringToJson } from 'src/app/globUtils';

declare var google;
@Component({
  selector: 'app-message-summary',
  templateUrl: './message-summary.page.html',
  styleUrls: ['./message-summary.page.scss'],
})
export class MessageSummaryPage implements OnInit, AfterContentInit {
  memory: any;
  @ViewChild('mapElement') mapElement;
  
  receiverName: string;
  receiverEmail: string;
  receiverContactNumber: any;
  memoryType: any;
  messageName: any;
  messageBody: any;
  memoryTypeDisplay: any;
  messageBodyStatus: boolean = false;
  audioStatus: boolean = false;
  videoStatus: boolean = false;
  videoPlayUrl: string;
  checkvideoUrl: string;
  receiverSurname: string;
  location: any;
  map: any;
  voicePlayUrl:string;
  showMapStatus: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user: User,
    private ionUtils: IonUtils,
    private streamingMedia: StreamingMedia,
    private platform: Platform,
  ) { 
    this.receiverName = '';
    this.receiverEmail = '';
    this.receiverContactNumber = '';
    this.memoryType = '';
    this.messageName = '';
    this.messageBody = '';
    this.memory = {};
    this.voicePlayUrl = '';
    
    this.route.queryParams.subscribe(params => {
      // if (params && params.messageId){
      //   this.memory = params;
      // }
      if(this.router.getCurrentNavigation().extras.state){

        this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
        this.receiverName = this.memory.receiverName;
        this.receiverSurname = this.memory.receiverSurname;
        this.receiverEmail = this.memory.receiverEmail;
        this.receiverContactNumber = this.memory.receiverContactNumber;
        this.memoryType = this.memory.memoryType;
        this.location = this.memory.location;


        // cl(['memory', this.memory])
        if(this.memory.memoryType == 'letter-of-wishes'){
          // cl(this.memory.messageName+"----"+this.memory.messageBody)
          this.memoryTypeDisplay = 'Letter Of Wishes';
          this.messageName = this.memory.messageName;
          this.messageBody = this.memory.messageBody;
          this.messageBodyStatus = true;
        }else if(this.memory.memoryType == 'text'){
          this.memoryTypeDisplay = 'Text';
          this.messageName = this.memory.memoryName;
          this.messageBody = this.memory.memoryBody;
          this.messageBodyStatus = true;
        } else if(this.memory.memoryType == 'all-in-one'){
          this.memoryTypeDisplay = 'All In One';
          this.messageName = this.memory.memoryName;
          this.messageBody = this.memory.memoryBody;
          //this.ionUtils.loading();
         // alert(this.memory.videoLocalUrl);
          //this.voicePlayUrl =  Capacitor.convertFileSrc(this.memory.audioLocalUrl);   
          this.videoPlayUrl = Capacitor.convertFileSrc(this.memory.videoLocalUrl);

         // alert(this.videoPlayUrl);
         // this.videoPlayUrl = Capacitor.convertFileSrc(this.memory.videoLocalUrl);
          // cl(['videoLocalUrl',this.memory, this.memory.videoLocalUrl, this.videoPlayUrl])
          this.messageBodyStatus = true;
          this.audioStatus = true;
          this.videoStatus = true;
        } else if(this.memory.memoryType == 'voice'){
          this.memoryTypeDisplay = 'Voice';
          this.messageName = this.memory.memoryName;
          this.audioStatus = true;
        }else if(this.memory.memoryType == 'video'){
          this.memoryTypeDisplay = 'Video';
          this.messageName = this.memory.memoryName;
          //this.videoPlayUrl = Capacitor.convertFileSrc(this.memory.videolocalUrl);
          //this.checkvideoUrl = Capacitor.convertFileSrc(this.memory.videolocalUrl);
           
          this.videoPlayUrl = Capacitor.convertFileSrc(this.memory.videoLocalUrl);
          //this.videoPlayUrl = this.memory.videoLocalUrl;
          //alert(this.checkvideoUrl);
          this.videoStatus = true;
        }
      }else{
        this.router.navigate(['/menu/create-new-message']);
       }
    });
  }

  ngAfterContentInit(): void {
    this.platform.ready().then(()=>{
      if(!isUndefinedString(this.location)){
        let latLngArr = this.location.split(',');
        const latitude = parseFloat(latLngArr[0])
        const longitude = parseFloat(latLngArr[1])

        if(latitude == 0 && longitude == 0){
          this.showMapStatus = false;
        }else{
          this.showMapStatus = true;
        }

  
        cl('latLng', `${latitude}, ${longitude}`)
          let latLng = new google.maps.LatLng(latitude, longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
          // var mapOPtions = {
          //   center: {lat: latitude, lng: longitude},
          //   zoom: 6
          // }
    
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

          let infoWindow = new google.maps.InfoWindow({
            content: "<h4>Information!</h4>"
          });

          let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
          });
      
          google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
          });
      
          google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
          });
  
        //   const infoWindow = new google.maps.infoWindow({
        //     content:'',
        //     maxWidth:200,
        //     pixelOffSet: new google.maps.Size(0,20)
        // });
          const pos = {
            lat: latitude,
            lng:longitude
          };
  
          // infoWindow.setPosition(pos);
          // infoWindow.setContent('Location found.');
          // infoWindow.open(this.map);
          this.map.setCenter(pos)
  
          // cl('isready', this.map)

      }




     
    })
  }

  ngOnInit() {
    this.user.get().then((userObj)=>{
      this.memory.senderId = userObj['id'];
    })
  }

  previewMemory(){
    this.user.get().then((userObj)=>{
      this.memory.senderName = userObj['firstName']+' '+userObj['lastName'];
      let data = jsonToString(this.memory);
      // cl(data)
      let navigationExtras: NavigationExtras = {
        state: {
          memory: data
        }
      };
      this.router.navigate(['/menu/view-message/message'], navigationExtras);
    })
  }

  playAudio(audioUri){
    let options: StreamingAudioOptions = {
      successCallback: () => { console.log() },
      errorCallback: () => { console.log() },
      initFullscreen: true
    }
     //var   faudioUri = this.memory.audioFilePath+this.memory.audioName+'.mp3';
     

    // var fgaudioUri = Capacitor.convertFileSrc(this.memory.audioLocalUrl);

    // alert(fgaudioUri);
    /*this.user.dowloadFile({video: this.memory.videoMemoryPath}).then(fil => { 
      // cl(['videoObj', fil])
      this.videoPlayUrl = Capacitor.convertFileSrc(fil.toString());
      this.ionUtils.loadingDismiss();
    });*/
    
    this.streamingMedia.playAudio( audioUri , options);
  }

  finished(){
    // cl('memory-summary', this.memory)
    let data = jsonToString(this.memory);
      let navigationExtras: NavigationExtras = {
        state: {
          memory: data
        }
      };
      this.router.navigate(['/menu/create-new-message/message-options'], navigationExtras);
  }
}
