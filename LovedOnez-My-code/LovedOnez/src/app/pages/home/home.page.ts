import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Authentication, User } from '../../glob.module';
import { cl } from 'src/app/globUtils';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
import { DatabaseService } from 'src/app/services/database.service';

const { PushNotifications } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  loggedin: boolean;
  id = null;

  constructor(
    private route: Router,
    private aRoute: ActivatedRoute,
    private authentication: Authentication,
    private platform: Platform,
    private file: File,
    private androidPermissions: AndroidPermissions,
    private storage: Storage,
    private user: User,
    private databaseService: DatabaseService,
    ) {

  }

  ngOnInit() {

    this.storage.get('userId').then((userId) => {
      this.user.get().then(userData=>{

       // alert('local user id ' + userId);

        if(userId != userData['id']){
          this.databaseService.renewLocalDB()
        }
      })
   }).catch(err=>{
      this.user
   });

    this.aRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      cl('home_menu_param', this.id)
    });
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
    // let path = this.file.dataDirectory;
    // cl(123);
    // this.platform.ready().then(() => {
    // //   this.file.checkDir(path, 'Loved1z').then(
    // //     (exists)=>{
    // //       if(!exists){
    // //         this.file.createDir(path, 'Loved1z', false).then(
    // //           (dirEntry) => {
    // //             dirEntry.
    // //           },
    // //           (err) => {
    // //             console.log('CreateDir error: ' + err);
    // //           }
    // //       }
    // //     }
    // //   );
    // });
  }

  public async createDirectory(dirPath: string): Promise<void> {
    const path = await this.file.resolveDirectoryUrl(this.file.externalDataDirectory);
    await new Promise((resolve, reject) => {
      path.getDirectory(dirPath, { create: true }, resolve, reject);
    });
  }

  goToCreateMessage(){
    this.route.navigate(['/menu/create-new-message']);
  }

  goToViewMessages(){
    this.route.navigate(['/menu/view-message']);
  }

  goToViewTutorial(){
    this.route.navigate(['/welcome-video']);
  }


  resetBadgeCount() {
    PushNotifications.removeAllDeliveredNotifications();
  }

  toCard(){
    this.route.navigate(['/menu/pay-card'])
  }

}
