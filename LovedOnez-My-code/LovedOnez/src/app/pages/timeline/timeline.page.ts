import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppControl, IonUtils, User } from 'src/app/glob.module';
import { cl, momentParseDateString } from 'src/app/globUtils';
// import { NavController } from 'ionic-angular';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {
  items: any;
  userId: any;

  constructor(
    private navController: NavController,
    private ionUtils: IonUtils,
    private appControl: AppControl,
    private user: User,
  ) { }

  ngOnInit() {
      this.ionUtils.loading();
      this.appControl.getAllMemories(res => {
        cl('getMemories_m1',res);
        let memoriesList = res['response'];
        this.user.get().then(user => {
          // cl(user['id'])
          // this.messages = this.allMessages.filter(item=>{
          //   return item['recipientId'] == user['id'];
          // });
          this.userId = user['id'];
          this.items = memoriesList;
          cl('check items',this.items)
          this.ionUtils.loadingDismiss();
        });
      });
    }

    getdate(x){
      return momentParseDateString(x);
    }

    getMessageStatus(senderId, sendStatus, recipientId, viewStatus){
        // cl([senderId, this.userId]);
        let mess;
        if(senderId == this.userId){
          if(recipientId == this.userId){
            if(sendStatus == 1){
              mess = 'received';
            }else if(sendStatus == 0){
              mess = 'saved';
            }
          }else{
            if(sendStatus == 1){
              if(viewStatus == 0){
                mess = 'sent';
              }else{
                mess = 'delivered';
              }
            }else if(sendStatus == 0){
              mess = 'saved';
            }
          }
        }else{

          mess = 'received';

        }
        return mess;
    }
    // for (let i = 0; i < 100; i++) {
    //   let x = {title: 'Hi, How are you doing today', time: {created: '01/12/2020', due: '05/12/2020'}};
    //   this.items.push(x);
    // }
}
