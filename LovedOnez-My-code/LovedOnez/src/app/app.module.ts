import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Authentication, User, IonUtils, AppControl } from './glob.module';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
// import { Camera } from '@ionic-native/camera/ngx';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { MediaCapture } from '@ionic-native/media-capture/ngx';

// import { VideoCapturePlus } from '@ionic-native/video-capture-plus/';

import { Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
//import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
//import { TimelineComponent, TimelineTimeComponent } from './timeline/timeline.component'; Uncomment
// import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Network } from '@ionic-native/network/ngx';

// import 'capacitor-gpay-plugin' // for web support
//import { GPayNativePlugin } from 'capacitor-gpay-plugin'
import { Plugins } from '@capacitor/core';

//const GPayNative = Plugins.GPayNative as GPayNativePlugin;

import { WebIntent } from '@ionic-native/web-intent/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { DatabaseService } from './services/database.service';
// import { FirstLoginPage } from './first-login/first-login.page';
// import { VideoCapturePlusOriginal } from '@ionic-native/video-capture-plus';
// import { FCM } from '@ionic-native/fcm/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
// import { ImageCropperModule } from 'ngx-image-cropper';
// import { SelectSearchableModule } from 'ionic-select-searchable';
// import "ng-img-crop-full-extended/compile/unminified/ng-img-crop.js";
// import { StatusBar } from '@ionic-native/status-bar/ngx';


@NgModule({
  declarations: [
    AppComponent,
    // FirstLoginPage,
    // TimelineComponent,
    // TimelineTimeComponent,
    // TimelineTimeComponent,
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot(),],
  providers: [
    StatusBar,
    Authentication,
    User,
    IonUtils,
    // DatabaseService,
    Network,
    AppControl,
    VideoPlayer,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StreamingMedia,
    Media,
    MediaCapture,
    // VideoCapturePlusOriginal,
    // Camera,
    File,
    // FileOpener,
    //WebView,
    NativeStorage,
    Diagnostic,
    AndroidPermissions,
    StatusBar,
    // Base64ToGallery,
    Base64,
    FileTransfer,
    FilePath,
    HTTP,
    SQLite,
    SQLitePorter,
    WebIntent,
    Geolocation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
