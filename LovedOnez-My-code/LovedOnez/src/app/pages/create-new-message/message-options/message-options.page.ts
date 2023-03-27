import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { AppControl } from 'src/app/glob.module';
import { cl, IMemory, isUndefinedString, isUndefinedToString, jsonToString, stringToJson } from 'src/app/globUtils';
import { MemoryModalComponent } from 'src/app/memory-modal/memory-modal.component';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-message-options',
  templateUrl: './message-options.page.html',
  styleUrls: ['./message-options.page.scss'],
})
export class MessageOptionsPage implements OnInit {
  memory: IMemory;
  checmemenory: any;
  options = [
    {
      id: 'send',
      title: 'SEND',
      icon: 'SEND-outline',
      iconBackground: '#0B5170'
    },
    {
      id: 'edit',
      title: 'EDIT',
      icon: 'create-outline',
      iconBackground: '#EA546C'
    },
    {
      id: 'save',
      title: 'SAVE',
      icon: 'save-outline',
      iconBackground: '#74A6D1'
    },
    {
      id: 'delete',
      title: 'DELETE',
      icon: 'trash-outline',
      iconBackground: '#C0A3B2'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private appControl: AppControl,
    private databaseService: DatabaseService,
  ) {
    this.checmemenory = {}
    if(this.router.getCurrentNavigation().extras.state){
      let sampleMemory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);

      cl('options_page', sampleMemory)

     // this.openModal( 'options_page' + jsonToString(sampleMemory) );

      this.checmemenory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);
       // alert( this.checmemenory.videoMemoryPath); 
 
      this.memory = { 
        id: null, 
          memoryName: isUndefinedToString(sampleMemory['memoryName']), 
          memoryBody: isUndefinedToString(sampleMemory['memoryBody']), 
          memoryType: isUndefinedToString(sampleMemory['memoryType']), 
          videoMemoryPath: isUndefinedToString(this.checmemenory.videoMemoryPath), 
          voiceMemoryPath: isUndefinedToString(this.checmemenory.voiceMemoryPath), 
          imageMemoryPath: isUndefinedToString(sampleMemory['imageMemoryPath']), 
          reminder: isUndefinedToString(sampleMemory['reminder']), 
          repeatDelivery: isUndefinedToString(sampleMemory['repeatDelivery']), 
          deliveryDate: isUndefinedToString(sampleMemory['deliveryDate']), 
          senderId: parseInt(sampleMemory['senderId']), 
          recipientId: isUndefinedToString(sampleMemory['recipientId']), 
          dateCreated: isUndefinedToString(sampleMemory['dateCreated']),
          receiverName: isUndefinedToString(sampleMemory['receiverName']),
          receiverSurname: isUndefinedToString(sampleMemory['receiverSurname']),
          receiverEmail: isUndefinedToString(sampleMemory['receiverEmail']),
          receiverContactNumber: isUndefinedToString(sampleMemory['receiverContactNumber']),
          location: isUndefinedToString(sampleMemory['location']),
          
        };
        cl('options_page2', this.memory);

        
        
      }else{
        this.router.navigate(['/menu/create-new-message']);
      }
    }
    
    ngOnInit() {
      // this.openModal();
    }
    
    async openModal(x){
      //  ionic g c memory-modal
      const modal = await this.modalCtrl.create({
        component: MemoryModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {modId: 'mesOptions',type: x, memoryType: this.memory.memoryType}
      });
      await modal.present();
    }
    
    goToOption(option){
       cl(option)
      alert(option);
      if (option == 'edit') {
        // edit
        let data = jsonToString(this.memory);
        // cl(data)
        let navigationExtras: NavigationExtras = {
          state: {
            memory: data
          }
        };
        this.router.navigate(['/menu/create-new-message/letter-of-wishes'], navigationExtras);
      } else if(option == 'send') {
        this.openModal(option);
        // sendStatus = 1 =>send
        this.memory.sendStatus = 1;
        this.memory.syncStatus = false;
        
        cl('options_page', this.memory)
        
        this.databaseService.insertMemory(this.memory).then(res=>{
        }).catch(err=>{
          cl(err);
        })
      // this.appControl.createMemory(this.memory).then(res => {
      //   // cl(['server_result',res])
      // }).catch(err => {
      //   console.log(err)
      // });
      this.router.navigate(['/menu/create-new-message/']);
    }else if(option == 'save') {
      // sendStatus = 0 => draft 
      this.openModal(option);
      this.memory.sendStatus = 0;
      this.databaseService.insertMemory(this.memory).then(res=>{
      }).catch(err=>{
        cl(err);
      })
      // this.appControl.createMemory(this.memory).then(res => {
      // }).catch(err => {
      //   console.log(err)
      // });
      this.router.navigate(['/menu/create-new-message/']);
    }else if(option == 'delete') {
      this.openModal(option);
    }
  }

}
