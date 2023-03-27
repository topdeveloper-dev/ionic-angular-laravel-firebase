import { Router, RouterEvent } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Authentication, IonUtils, User } from '../../glob.module';
import { Storage } from '@ionic/storage';
import { SymService } from 'src/app/services/sym.service';
import { cl, rootFileUrl, stringToJson } from 'src/app/globUtils';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

// import { FcmProvider } from 'src/providers/fcm/fcm';
import { ToastController } from '@ionic/angular';
 import { tap } from 'rxjs/operators';
// import { FCM } from '@ionic-native/fcm/ngx';




@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home-outline'
    },
    {
      title: 'Create New Message',
      url: '/menu/create-new-message',
      icon: 'send-outline'
    },
    {
      title: 'View Message',
      url: '/menu/view-message',
      icon: 'mail-open-outline'
    },
    {
      title: 'Received Message',
      url: '/menu/received-message',
      icon: 'mail-unread-outline'
    },
    {
      title: 'Profile',
      url: '/menu/profile',
      icon: 'person-outline'
    },
    {
      title: 'Settings',
      url: '/menu/settings',
      icon: 'settings-outline'
    },
    {
      title: 'Timeline',
      url: '/menu/timeline',
      icon: 'hourglass-outline'
    },
    {
      title: 'Contact Us',
      url: '/menu/contact-us',
      icon: 'call-outline'
    }
  ];

  selectedPath = '';
  profilePic: string;
  appLogo: string;
  lastName: any;
  firstName: any;
  symId: string;
  myImage: string;
  userName: any;
  userInfo: any;

  constructor(
    private router: Router,
    private authentication: Authentication,
    private user: User,
    private storage: Storage,
    private symService: SymService,
    private ionUtils: IonUtils,
    private androidPermissions: AndroidPermissions, // err
    // private fcm: FCM,
    private toastCtrl: ToastController,
    ) {

  }

  ngOnInit() {

    // console.log('fcm', 12345678);
    // cl(sPro)
    // this.authentication.getToken().then((res)=>{
    //   cl(['vongani',res])
    // });

    // let userInfo = this.authentication.getToken();
    // cl(userInfo)
    // this.fcm.getToken().then(token => {
    //   console.log('fcm', 123);
    // });


    // this.fcm.getToken();

    // this.fcm.listenToNotifications().pipe(
    //   tap(msg=>{
    //     const toast = this.toastCtrl.create({
    //       message: msg.body,
    //       duration: 3000
    //     });
    //   })
    // ).subscribe()


    this.profilePic = '../assets/img/profile/avatar_male.png';
      this.appLogo = '../assets/img/app_logo.png';
      this.symId = '1';

      if(this.router.getCurrentNavigation().extras.state){
        this.userInfo = stringToJson(this.router.getCurrentNavigation().extras.state.userInfo);


      }

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        result => {
          // this.checkSession();
          console.log('Has permission?',result.hasPermission);
        },
        err => {
          // this.checkSession();
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
          }
      );

      this.checkSession();

      // var permissions = this.androidPermissions.PERMISSION;
      // var list = [
      //   permissions.CAMERA,
      //   permissions.GET_ACCOUNTS,
      //   permissions.RECORD_AUDIO,
      //   permissions.READ_PHONE_STATE,
      //   permissions.READ_EXTERNAL_STORAGE,
      //   permissions.WRITE_EXTERNAL_STORAGE,
      // ];

      // list.forEach(element => {
      //   permissions.checkPermission(element, function(status) {
      //     if (status.hasPermission) console.warn("Yes :D -> " + element);
      //     else permissions.requestPermission(element, null, null);
      //   }, null);
      // });

      // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);



      this.router.events.subscribe((event: RouterEvent)=>{
        // console.log(event);
        this.selectedPath = event.url;
      });
  }

  updateMenuState(status) {
    // cl('close menu', x)
    if(status){
      this.checkSession();
    }
      //code to execute when menu has closed
  }

  // menuOpened() {

  //   cl('Open menu', x)
  //   //code to execute when menu ha opened
  // }

  checkSession(){
    // cl('menu');
    this.storage.get('userAuth').then((res) => {
      cl('check_user_info', res)
      // this.ionUtils.alertSuccess({
        //   header: 'Alert',
        //   subHeader: '',
        //   message: res,
        // });
    if(!res){
      cl('menu_false');
      // this.router.navigate(['/login']);
    }else{
      // cl('menu_true');
      this.user.get().then((userObj)=>{
        // cl(['menu_true', userObj]);
        // cl(userObj)
        this.firstName = 'firstName';
        this.lastName = 'lastName';
        // cl(userObj)
        if(userObj['filePath'] != 'no_profileImage'){
          this.profilePic = rootFileUrl+userObj['filePath'];
        }
        this.firstName = userObj['firstName'];
        this.lastName = userObj['lastName'];
        this.userName = this.firstName +' '+ this.lastName;

        // this.ionUtils.alertSuccess({
        //   header: 'Alert',
        //   subHeader: userObj['firstName']+'_'+userObj['lastName'],
        //   message: rootFileUrl+userObj['filePath'],
        // });

        cl('menu data', userObj)
      });
    }
  }).catch(err=>{
    cl('menu session Error:', err)
    // cl(1233333, cl('check_user_info', err))
  });
  }
  async logout(){
    this.authentication.logout();
  }
}
