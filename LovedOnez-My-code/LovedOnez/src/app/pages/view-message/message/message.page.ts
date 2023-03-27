import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { StreamingAudioOptions, StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { Platform } from '@ionic/angular';
import { User, IonUtils } from 'src/app/glob.module';
import { cl, rootFileUrl, IiconData, ImessageStatData, stringToJson, jsonToString, isUndefinedString } from 'src/app/globUtils';
import { SymService } from 'src/app/services/sym.service';

declare var google;

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit, AfterContentInit {
  @ViewChild('mapElement') mapElement;
  massageId: any;
  memory: any;
  senderName: any;
  messageBody: any;
  messageName: any;
  voiceMessage: any;
  voiceMessageStatus: boolean = false;
  textMessageStatus: boolean = false;
  videoMessageStatus: boolean = false;
  videoPlayUrl: string = null; 
  audioNotDownLoaded: boolean = true;
  videoNotDownLoaded: boolean = true;
  audioFileError: any;
  audioFileErrorStatus: boolean = false;
  location: any;
  showMapStatus: boolean = true;
  map: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private symService: SymService,
    private streamingMedia: StreamingMedia,
    private file: StreamingMedia,
    private user: User,
    private ionUtils: IonUtils,
    private platform: Platform,
  ) { 
   
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

  
        // cl('latLng', `${latitude}, ${longitude}`)
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
    this.route.queryParams.subscribe(params => {
      if (params && params.messageId){
        this.massageId = params.messageId
      }
      if(this.router.getCurrentNavigation().extras.state){
        this.massageId = this.router.getCurrentNavigation().extras.state.messageId;
        this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);

        this.senderName = this.memory['senderName'];
        this.messageName = this.memory['memoryName'];
        this.messageBody = this.memory['memoryBody'];
        this.location = this.memory.location;

       // alert(this.memory.memoryType);

        cl(['preview', this.memory])
        if(this.memory.messageStatus == 'createVoiceNote'){
          this.videoNotDownLoaded = true;
        }
        
        if(this.memory.memoryType == 'letter-of-wishes' && this.memory.messageStatus == 'createMessage'){
          
        } else if(this.memory.memoryType == 'all-in-one' && this.memory.messageStatus == 'createMessage'){

          this.messageName = this.memory['memoryName'];
          this.messageBody = this.memory['memoryBody'];

          this.voiceMessageStatus = true;
          this.textMessageStatus = true;

        }else if(this.memory.memoryType == 'text' && this.memory.messageStatus == 'createMessage'){

          this.textMessageStatus = true;
          this.messageName = this.memory['memoryName'];
          this.messageBody = this.memory['memoryBody'];


        } else if(this.memory.memoryType == 'letterOffWishes' && this.memory.messageStatus == 'view-message'){
          
          this.messageBody = this.memory['memoryBody'];

          this.textMessageStatus = true;

        } else if(this.memory.memoryType == 'text' && this.memory.messageStatus == 'view-message'){

          this.messageName = this.memory['memoryName'];
          this.messageBody = this.memory['memoryBody'];
          this.textMessageStatus = true;

        } else if(this.memory.memoryType == 'all-in-one' && this.memory.messageStatus == 'view-message'){

          this.ionUtils.loading();
          this.user.dowloadFile({video: this.memory.videoMemoryPath}).then(fil => { 
            // cl(['videoObj', fil])
            this.videoPlayUrl = Capacitor.convertFileSrc(fil.toString());
            this.videoNotDownLoaded = true;
            this.user.dowloadFile({audio: this.memory.voiceMemoryPath}).then(fil => { 
              // cl(['audioObj', fil])
              this.memory.audioLocalUrl = fil;

              this.audioNotDownLoaded = true;
              this.textMessageStatus = true;
              this.videoMessageStatus = true;
              this.voiceMessageStatus = true;

             

              this.ionUtils.loadingDismiss();
            })
          })

          this.messageName = this.memory['memoryName'];
          this.messageBody = this.memory['memoryBody'];


        } else if(this.memory.memoryType == 'video' && this.memory.messageStatus == 'view-message'){
           
         // alert(this.memory.videoMemoryPath);

          cl(['video', this.memory])
          this.ionUtils.loading();
          this.user.dowloadFile({video: this.memory.videoMemoryPath}).then(fil => { 
            // cl(['videoObj', fil]) 
            this.videoPlayUrl = Capacitor.convertFileSrc(fil.toString());

            this.videoNotDownLoaded = true;
            this.videoMessageStatus = true;

              this.ionUtils.loadingDismiss();
          })


        } else if(this.memory.memoryType == 'voice' && this.memory.messageStatus == 'view-message'){

          cl(['voice', this.memory])
          this.ionUtils.loading();
          this.user.dowloadFile({audio: this.memory.voiceMemoryPath}).then(fil => { 
            cl('audioObj', fil)
            // cl(['audioObj', Object.keys(fil)[0]])
            if(typeof fil === 'string'){
              this.memory.audioLocalUrl = fil;
  
              this.audioNotDownLoaded = true;
              // this.textMessageStatus = true;
              // this.videoMessageStatus = true;
              this.voiceMessageStatus = true;
  
              this.ionUtils.loadingDismiss();
            }else{
              this.audioFileError = fil['error'];
              this.audioFileErrorStatus = true;
              this.ionUtils.loadingDismiss();
            }
          })


        } else if(this.memory.memoryType == 'voice' && this.memory.messageStatus == 'createVoiceNote'){

          this.messageName = this.memory['voiceNoteName'];
          this.voiceMessage = this.memory['memoryBody'];

          this.voiceMessageStatus = true;

        } else if(this.memory.memoryType == 'video' && this.memory.messageStatus == 'createVideoNote'){

          this.messageName = this.memory['videoNoteName'];
          this.voiceMessage = this.memory['memoryBody'];
          this.videoPlayUrl = Capacitor.convertFileSrc(this.memory.videoLocalUrl);

          this.videoMessageStatus = true;

        }else if(this.memory.memoryType == 'all-in-one' && this.memory.messageStatus == 'createAllInOne'){

          this.messageName = this.memory['memoryName'];
          this.messageBody = this.memory['textBody'];
          cl('video url',this.memory.videoLocalUrl)
          this.videoPlayUrl = Capacitor.convertFileSrc(this.memory.videoLocalUrl);

          this.textMessageStatus = true;
          this.videoMessageStatus = true;
          this.voiceMessageStatus = true;
          //alert(this.videoPlayUrl);

        }
      }else{
        this.router.navigate(['/menu/home']);
      }

      
    });
  }

  playAudio(audioUri){
    let options: StreamingAudioOptions = {
      successCallback: () => { console.log() },
      errorCallback: () => { console.log() },
      initFullscreen: true
    }
    // this.audioUri = this.audioFilePath+this.audioName+'.mp3';
    // cl(this.audioUri)
    this.streamingMedia.playAudio( audioUri , options);
  }

  

  goToPreviousPage(){
    let data = jsonToString(this.memory);
      let navigationExtras: NavigationExtras = {
        state: {
          memory: data
        }
      };
      if(this.memory.messageStatus == 'createMessage'|| this.memory.messageStatus == 'createVoiceNote' || this.memory.messageStatus == 'createVideoNote'|| this.memory.messageStatus == 'createVideo' || this.memory.messageStatus == 'createAllInOne'){
        this.router.navigate(['/menu/create-new-message/message-summary'], navigationExtras);
      }else{
        this.router.navigate(['/menu/'+this.memory.messageStatus]);
      }
  }

}
