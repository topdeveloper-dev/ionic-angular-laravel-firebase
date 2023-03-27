import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { SymService } from '../services/sym.service';


import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
import { CameraResultType } from '@capacitor/camera';

const { Camera } = Plugins;
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { User } from '../glob.module';

// var moment = require('moment'); // require


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  cropperOptions: any;
  croppedImage = null;

  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  appLogo: string;
  ionicForm: FormGroup;
  isSubmitted: boolean;
  createAccountStatus: boolean;
  myphoto: string;

  constructor(
    public formBuilder: FormBuilder,
    private symService: SymService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private user: User,
    // private camera: Camera,
  ) {
    this.appLogo = '../assets/img/app_logo.png'
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };
   }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      passwordConfirm: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]]
    })
  }
  get errorControl() {
    return this.ionicForm.controls;
  }

  async captureImage() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.CAMERA
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   this.myImage = ;
    // });

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.base64String;
    // Can be set to the src of an image now
    this.myImage = 'data:image/jpeg;base64,' + imageUrl;
  }

  // reset() {
  //   this.angularCropper.cropper.reset();
  // }

  // clear() {
  //   this.angularCropper.cropper.clear();
  // }

  // rotate() {
  //   this.angularCropper.cropper.rotate(90);
  // }

  // zoom(zoomIn: boolean) {
  //   let factor = zoomIn ? 0.1 : -0.1;
  //   this.angularCropper.cropper.zoom(factor);
  // }

  // scaleX() {
  //   this.scaleValX = this.scaleValX * -1;
  //   this.angularCropper.cropper.scaleX(this.scaleValX);
  // }

  // scaleY() {
  //   this.scaleValY = this.scaleValY * -1;
  //   this.angularCropper.cropper.scaleY(this.scaleValY);
  // }

  // move(x, y) {
  //   this.angularCropper.cropper.move(x, y);
  // }

  // save() {
  //   let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
  //   this.croppedImage = croppedImgB64String;
  // }



  cropImage() {
    // const options: CameraOptions = {
    //   quality: 70,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    //   saveToPhotoAlbum: false,
    //   allowEdit:true,
    //   targetWidth:300,
    //   targetHeight:300
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64:
    //   this.myphoto = 'data:image/jpeg;base64,' + imageData;
    // }, (err) => {
    //   // Handle error
    // });
  }

  gotoLogin(){
    this.createAccountStatus = false;
    this.route.navigate(['/login']);
  }

  submitForm(){
    this.isSubmitted = true;
    // console.log(this.ionicForm.value)
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      const formData = new FormData();
      formData.append('action', 'createAccount');
      formData.append('firstName', this.ionicForm.value.firstname);
      formData.append('lastName', this.ionicForm.value.lastname);
      formData.append('userEmail', this.ionicForm.value.email);
      formData.append('mobileNumber', this.ionicForm.value.mobileNumber);
      formData.append('userPassword', this.ionicForm.value.password);
      formData.append('img', 'empty');
      formData.append('userType', '1');
      formData.append('symId', '1');
      formData.append('activationStatus', '0');

      this.user.get().then(useRes => {
        this.symService.easyService(formData, 'xx.yy.zz').subscribe(res=>{
          // console.log(res['response']);
          if (res['response'] == null) {
            this.ionicForm.value.firstname = '';
            this.ionicForm.value.lastname = '';
            this.ionicForm.value.email = '';
            this.ionicForm.value.mobileNumber = '';
            this.ionicForm.value.password = '';
            this.createAccountStatus = true;
            // console.log('Account Created.');
          } else if(res['response'] == 'email_exist'){
            this.createAccountStatus = false;
            // console.log('email_exist');
          }

        });

      })
    }
  }
}
