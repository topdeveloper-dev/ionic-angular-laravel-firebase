import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import { Plugins, PluginListenerHandle } from '@capacitor/core';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { FcmService } from './services/fcm.service';
import { User } from './glob.module';
import { DatabaseService } from './services/database.service';
import { Router } from '@angular/router';
import { AnimationOptions } from '@ionic/angular/providers/nav-controller';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
// import { AnimationOptions, NavController } from '@ionic/angular/providers/nav-controller';

const { Network } = Plugins;
@Component({
  templateUrl: 'app.component.html',
  selector: 'app-root',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  networkStatus: any;
  networkListener: PluginListenerHandle;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private permissions: AndroidPermissions,
    private fcmService: FcmService,
    private user: User,
    private databaseService: DatabaseService,
    private router: Router,
    private navCtrl: NavController,
    private diagnostic: Diagnostic,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.diagnostic.requestRuntimePermission('WRITE_EXTERNAL_STORAGE');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcmService.ngOnInit;
      this.user.setSettings();
      // this.databaseService.connection();
      this.databaseService.init();
      this.backButtonEvent();

      this.permissions.checkPermission(this.permissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result)=>{
        if(!result.hasPermission){
          this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_COARSE_LOCATION)
        }

      }, (err)=>{

      })

      this.permissions.checkPermission(this.permissions.PERMISSION.CAMERA).then(
        result => {
          if(!result.hasPermission){
            this.permissions.requestPermissions([this.permissions.PERMISSION.CAMERA, this.permissions.PERMISSION.GET_ACCOUNTS]);
          }
        },
        err => this.permissions.requestPermission(this.permissions.PERMISSION.CAMERA)
      );

      this.permissions.checkPermission(this.permissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        result => {
          if(!result.hasPermission){
            this.permissions.requestPermissions([this.permissions.PERMISSION.READ_EXTERNAL_STORAGE]);
          }
        },
        err => this.permissions.requestPermission(this.permissions.PERMISSION.READ_EXTERNAL_STORAGE)
      );

      this.permissions.checkPermission(this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          if(!result.hasPermission){
            this.permissions.requestPermissions([this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
          }
        },
        err => this.permissions.requestPermission(this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );

      // this.permissions.requestPermissions([this.permissions.PERMISSION.CAMERA, this.permissions.PERMISSION.GET_ACCOUNTS]);
    });
  }

  backButtonEvent() {
    if (this.platform.is('android')) {
        this.platform.backButton.subscribeWithPriority(0, (res) => {
          if (this.router.url === '/menu/home' || this.router.url === '/login' || this.router.url === '/') {
            navigator['app'].exitApp();
          }  else {
          console.log('this.router.url', this.router.url);
          let animations:AnimationOptions={
            animated: true,
            animationDirection: "back"
          }
          this.navCtrl.back(animations)
        }
      });
    }
  }
}
