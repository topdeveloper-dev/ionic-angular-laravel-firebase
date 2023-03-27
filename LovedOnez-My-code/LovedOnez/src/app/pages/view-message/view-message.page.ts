import { Component, OnInit } from '@angular/core';
//import { Plugins, ActionSheetOptionStyle } from '@capacitor/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { AppControl, IonUtils, User } from 'src/app/glob.module';
import { cl, rootFileUrl, IiconData, ImessageStatData, jsonToString, momentParseDateString, momentComparison, isAfterDateTime, testEmogi, isUndefinedString, IMemory } from 'src/app/globUtils';
import { DatabaseService } from 'src/app/services/database.service';
import { ActionSheetController } from '@ionic/angular';

//const { Modals } = Plugins;
@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  received: boolean;
  sent: boolean;
  draft: boolean;
  
  allMessages = [
    {
      id: '1',
      memoryName: 'Message Name 1',
      type: 'received',
      dateCreated: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '2',
      memoryName: 'Message Name 2',
      type: 'sent',
      date: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '3',
      memoryName: 'Message Name 3',
      type: 'sent',
      dateCreated: '02/05/2019',
      memoryType: 'mic',
      iconData: this.getIconData('audio'),
      viewStatus: this.messageViewStatus(1)
    },
    {
      id: '4',
      memoryName: 'Message Name 4',
      type: 'sent',
      dateCreated: '02/05/2019',
      memoryType: 'videocam',
      iconData: this.getIconData('video'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '5',
      memoryName: 'Message Name 5',
      type: 'sent',
      dateCreated: '02/05/2019',
      memoryType: 'cube',
      iconData: this.getIconData('allInOne'),
      viewStatus: this.messageViewStatus(1)
    },
    {
      id: '6',
      memoryName: 'Message Name 6',
      type: 'sent',
      dateCreated: '02/05/2019',
      memoryType: 'mic',
      iconData: this.getIconData('audio'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '7',
      memoryName: 'Message Name 7',
      type: 'saved',
      dateCreated: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    },
    {
      id: '8',
      memoryName: 'Message Name 8',
      type: 'saved',
      dateCreated: '02/05/2019',
      memoryType: 'document-text',
      iconData: this.getIconData('text'),
      viewStatus: this.messageViewStatus(0)
    }
  ];
  // id: 8
  // memoryName: "drfgrt"
  // memoryBody: "not_applicable"
  // memoryType: "video"
  // receiverEmail: "dfgdf"
  // receiverName: "dgdfdf"
  // receiverSurname: "dfgdfd"
  // receiverContactNumber: "dgdf"
  // recipientId: "31"
  // sendStatus: 1
  // videoMemoryPath: "video_memory_devTest"
  // viewStatus: 0
  // voiceMemoryPath:
  messages: any;
  memory: any;
  userId: any;
  messageRowStatus: boolean = true;
  clickedMemoryId: number;
  messageTypePage: number;

  // messageRowStatus: boolean = true;

  constructor(
    private router: Router,
    private appControl: AppControl,
    private user: User,
    private databaseService: DatabaseService,
    private ionUtils: IonUtils,
    public actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    // this.ionUtils.loading();


    this.memory = {};
    this.received = false;
    this.sent = true;
    this.draft = false;
    this.databaseService.getMemories(res=>{
      // this.appControl.getAllMemories(res => {
        let memoriesList = res;
        let noneSynceMeor = '';
        this.allMessages = memoriesList;
        // cl(this.allMessages);
        this.user.get().then(userInfo => {
          this.userId = userInfo['id'];
          // alert(this.userId)
          // sent
          // cl('view-memories',this.allMessages)
          let memoryArray = this.allMessages.filter(item=>{
            // cl(item['sendStatus'] +'__'+ 1 && item['recipientId'] +'__'+ userInfo['id'] +'__'+(isUndefinedString(item['isDeleted']) +'__'+ item['isDeleted'] == 0))
            return (item['sendStatus'] == 1 && item['recipientId'] != userInfo['id'] && (item['isDeleted']== 'undefined' || item['isDeleted'] == 0));
          });
          let unsortedArray = memoryArray.sort((a, b) => {
            return moment(a.dateCreated).diff(b.dateCreated);
          });
          this.messages = unsortedArray.reverse()
          this.messageTypePage = 2;
          // this.ionUtils.loadingDismiss();
          // cl('view-memories',this.messages)
        });
      // });
    });
    // this.ionUtils.loadingDismiss();
  }





  async confirmDelete(memoryid) {

    // cl('1234', memoryid)
    const actionSheet = await this.actionSheetController.create({
      header: 'Confirm Delete',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteMemory(memoryid)
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }


  memoryTypeChange(x){
     cl('memoryTypeChange:   ', x);
    if(x == 1){
      // received messages
      this.user.get().then(userInfo => {
        cl('user id :   ', userInfo['id']);
       let normArray = this.allMessages.filter(item=>{
          return item['recipientId'] == userInfo['id'] && (item['isDeleted']== 'undefined' || item['isDeleted'] == 0);
        });
        this.messages = normArray.reverse()
        this.received = true;
        this.sent = false;
        this.draft = false;
        this.messageTypePage = 1;
      });
    } else if(x == 2){
      // sent messages
      this.user.get().then(userInfo => {
        let memoryArray = this.allMessages.filter(item=>{
          console.log(item);
          return (item['sendStatus'] == 1 && item['recipientId'] != userInfo['id'] );
        });
        let unsortedArray = memoryArray.sort((a, b) => {
          return moment(a.dateCreated).diff(b.dateCreated);
        });
        this.messages = unsortedArray.reverse()
       
        this.received = false;
        this.sent = true;
        this.draft = false;
        this.messageTypePage = 2;
      });
    } else if(x == 3){
      // draft me
      this.user.get().then(userInfo => {

      let normArray = this.allMessages.filter(item=>{
        cl('recipientId id :   ', item['recipientId']);
        return item['sendStatus'] == 0 && item['recipientId'] != userInfo['id'] && (item['isDeleted']== 'undefined' || item['isDeleted'] == 0);
        // return item['type'] == 'saved';
      });

      this.messages = normArray.reverse()
      this.received = false;
      this.sent = false;
      this.draft = true;
      this.messageTypePage = 3;
    });
    }
  }

  getdate(x){
    return momentParseDateString(x);
  }

  toggleMessageRow(clickedMemoryId: number){
    this.clickedMemoryId = clickedMemoryId;
    cl(testEmogi,{clickedMemoryId: this.clickedMemoryId, messageRowStatus: this.messageRowStatus})
  }




  checkMemoryStatus(x, date, sendStatus, senderId, recipientId){

    // cl([x, date, sendStatus, senderId])
    let status = 'sent';
    if(recipientId == this.userId){
      status = 'received';
    }else{
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
    // cl(x)
    let result: ImessageStatData = {id: 0, color: ''};
    if(x==0){
      result = {id: x, color: '#ffffff'};
    }else if(x == 1){
      result = {id: x, color: '#f2f2f2'};
    }
    // cl(result)
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


  editMemory(memoryid){
    
    let memoryArr = this.allMessages.filter(item=>{
      return item['memoryid'] == memoryid;
      // return item['type'] == 'saved';
    });

    this.memory = memoryArr[0];

    // cl(testEmogi, this.memory);
    
    this.memory.messageStatus= "edit-message";
      // if(this.memory[0].viewStatus == 0 && stat == 'received'){
      // }
      // this.memory.senderName = 'Kuda Nheyera';
      let data = jsonToString(this.memory);
      let navigationExtras: NavigationExtras = {
        state: {
          memory: data
        }
      };
      
      this.router.navigate([`/menu/create-new-message/${this.memory.memoryType}`], navigationExtras);
  }
  
  deleteMemory(memoryid){
    let memoryArr= this.allMessages.filter(item=>{
      return (item['memoryid'] == memoryid );
    });

    this.clickedMemoryId = null;
    this.databaseService.deleteMemoryById(memoryArr[0]).then(res=>{
      // cl('memoryDeleted', res);
      this.removeMemory(memoryid);
    });
  }

  removeMemory(memoryId: any) {

    for( var i = 0; i < this.messages.length; i++){     
      if ( this.messages[i]['memoryid'] == memoryId) { 
        this.messages.splice(i, 1); 
          i--; 
      }
    }
  }

  viewMessage(memoryid, stat){
     
    cl(testEmogi, [memoryid,stat])

    this.memory = this.allMessages.filter(item=>{
        return item['memoryid'] == memoryid;
        // return item['type'] == 'saved';
      });

      this.memory[0].messageStatus= "view-message";
      if(this.memory[0].viewStatus == 0 && stat == 'received'){
      }

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
