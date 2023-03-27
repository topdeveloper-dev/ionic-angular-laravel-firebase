import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotification,
  Token,
} from '@capacitor/push-notifications';
import { AppControl, IonUtils, User } from 'src/app/glob.module';
import { cl, rootFileUrl, IiconData, ImessageStatData, isAfterDateTime, momentParseDateString, jsonToString } from 'src/app/globUtils';
import { DatabaseService } from 'src/app/services/database.service';
const { PushNotifications } = Plugins;

@Component({
  selector: 'app-received-message',
  templateUrl: './received-message.page.html',
  styleUrls: ['./received-message.page.scss'],
})
export class ReceivedMessagePage implements OnInit {
  allMessages = [
    {
      id: '1',
      name: 'Message Name 1',
      type: 'received',
      date: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '2',
      name: 'Message Name 2',
      type: 'received',
      date: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '3',
      name: 'Message Name 3',
      type: 'sent',
      date: '02/05/2019',
      memoryType: 'mic',
      iconData: this.getIconData('audio'),
      viewStatus: this.messageViewStatus(1)
    },
    {
      id: '4',
      name: 'Message Name 4',
      type: 'received',
      date: '02/05/2019',
      memoryType: 'videocam',
      iconData: this.getIconData('video'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '5',
      name: 'Message Name 5',
      type: 'received',
      date: '02/05/2019',
      memoryType: 'cube',
      iconData: this.getIconData('allInOne'),
      viewStatus: this.messageViewStatus(1)
    },
    {
      id: '6',
      name: 'Message Name 6',
      type: 'received',
      date: '02/05/2019',
      memoryType: 'mic',
      iconData: this.getIconData('audio'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '7',
      name: 'Message Name 7',
      type: 'received',
      date: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '8',
      name: 'Message Name 8',
      type: 'saved',
      date: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    }
  ];
  messages: any;
  memory: any;
  id: any;

  constructor(
    private router: Router,
    private ionUtils: IonUtils,
    private appControl: AppControl,
    private user: User,
    private databaseService: DatabaseService,
    private aRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // this.ionUtils.loading();
    // this.ionUtils.loadingDismiss();
    this.aRoute.queryParams.subscribe(params => {
      // cl('received_memories_params',this.router.getCurrentNavigation().extras.state)
      if(this.router.getCurrentNavigation().extras.state){
        this.id = this.router.getCurrentNavigation().extras.state.id;
      }
    })

    
    this.databaseService.getMemories(res=>{
      let memoriesList = res;
      this.allMessages = memoriesList;
      // cl(this.allMessages);
      this.user.get().then(user => {
        // cl(user['id'])
        this.messages = this.allMessages.filter(item=>{
          return item['recipientId'] == user['id'];
        });
        cl(1233445,this.messages)
        cl('')
      });

    });
  }

  getdate(x){
    return momentParseDateString(x);
  }

  checkMemoryStatus(x, date, sendStatus){

    let status = 'sent';

    if(date == 'not_applicable' || date == 'now'){
      status = 'sent';
      // cl([date, momentComparison(date)])
    }else{
      if(sendStatus == 1){
        status = 'sent';
      }else{
        status = 'saved';
      }
    }
    return status;
  }

  deliveryStatus(date, sendStatus){
    let status;
    if(date == 'not_applicable' || date == 'now'){
      // cl([date, isAfterDateTime(date), sendStatus])
      // cl([date, momentComparison(date)])
      status = true;
    } else{
      if(isAfterDateTime(date) == true){
        status = true;
      } else{
        status = false;
      }
    }
    return status;
  }

  messageViewStatus(x){
    let result: ImessageStatData = {id: 0, color: ''};
    if(x==0){
      result = {id: x, color: '#ffffff'};
    }else if(x == 1){
      result = {id: x, color: '#f2f2f2'};
    }
    return result;
  }

  getIconData(x){
    // cl(x)
    let result: IiconData = {icon: '', color: ''};
    if(x == 'text'){
        result = {
          icon: 'document-text',
          color: '#0B5170'
        };
      } else if(x == 'voice'){
        result = {
          icon: 'mic',
          color: '#EE6C6D'
        };
      } else if(x == 'video'){
        result = {
          icon: 'videocam',
          color: '#74A6D1'
        };
      } else if(x == 'all-in-one'){
        result = {
          icon: 'cube',
          color: '#C0A3B2'
        };
      }else if(x == 'letter-of-wishes'){
        result = {
          icon: 'star',
          color: '#4fb7c0'
        };
      }
      return result;
  }


  viewMessage(memoryid){
    // cl(memoryid)
    this.memory = this.allMessages.filter(item=>{
      return item['memoryid'] == memoryid;
      // return item['type'] == 'saved';
    });
    this.memory[0].messageStatus= "received-message"
    cl(this.memory[0].viewStatus)
    if(this.memory[0].viewStatus == 0){
      // this.databaseService.memoryViewed
      // this.appControl.memoryViewed(id).then(res=>{

      //   cl(res)

      //   })
    }


  
        // this.memory =  {
        //   memoryType: "letterOffWishes",
        //   messageBody: "Hi, How are you?",
        //   messageName: "Greeting",
        //   receiverContactNumber: "0123456789",
        //   receiverEmail: "kmnheyera@gmail.com",
        //   receiverFirstname: "John",
        //   receiverLastname: "Doe",
        //   messageStatus: "viewMessage"
        // }
        // this.memory.senderName = 'Kuda Nheyera';

        
        let data = jsonToString(this.memory[0]);
        let navigationExtras: NavigationExtras = {
          state: {
            memory: data
          }
        };
        this.router.navigate(['/menu/view-message/message'], navigationExtras);

  }

}
