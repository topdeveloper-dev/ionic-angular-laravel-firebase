import { Injectable, OnInit } from '@angular/core';
import { Authentication } from '../glob.module';
import {
  Plugins,
  //PushNotification,
  //PushNotificationToken,
  //PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
// import { FCM } from '@ionic-native/fcm/ngx';
import { cl } from '../globUtils';
import { DatabaseService } from './database.service';

 
//const { PushNotifications } = Plugins;
 
@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnInit {
 
  constructor(
    private router: Router,
    private authentication: Authentication,
    private storage: Storage,
    private databaseService: DatabaseService,

    // private fcm: FCM,
    ) { }
  ngOnInit(): void {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        this.authentication.setDeviceToken(JSON.stringify(token));
        this.storage.set('deviceToken', token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
       alert('Push received: ' + JSON.stringify(notification));
      
      await this.databaseService.getLatestMemoryId(res=>{

         console.log('Push received: ', notification);
       })
     }
   );

   // Method called when tapping on a notification
   PushNotifications.addListener('pushNotificationActionPerformed',
      async  (notification: ActionPerformed) => {
       alert('Push action performed: ' + JSON.stringify(notification));
   
      await this.databaseService.getLatestMemoryId(res=>{
          console.log('pushNotificationActionPerformed: ', notification);
          this.router.navigateByUrl(`menu/home`);
        })
       // cl('Michael PushTest',notification)

       // if (data.detailsId) {
       // }
     }
   );
 }
 
/*old code

  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }
 
  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    }).catch(err=>{
      cl(err)
    });
 
    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        this.authentication.setDeviceToken(JSON.stringify(token));
        this.storage.set('deviceToken', token.value);
      });
  //     PushNotifications.addListener('registration', 
  //   (token: PushNotificationToken) => {
  //   }
  // );
      
      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error: ' + JSON.stringify(error));
      });
      
      PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: any) => {
        // cl(['123-123',notification])
        await this.databaseService.getLatestMemoryId(res=>{

          console.log('Push received: ', notification);
        })
      }
    );
 
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        await this.databaseService.getLatestMemoryId(res=>{
          console.log('pushNotificationActionPerformed: ', notification);
          this.router.navigateByUrl(`menu/home`);
        })
        // cl('Michael PushTest',notification)

        // if (data.detailsId) {
        // }
      }
    );
  }

  // getToken(){
  //   this.fcm.getToken().then(token => {
  //     backend.registerToken(token);
  //   });
  // }
  */
}

