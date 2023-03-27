import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute,Router } from '@angular/router';
import { SymService } from 'src/app/services/sym.service';
import { cl, rootFileUrl, stringToJson } from 'src/app/globUtils';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { Plugins } from '@capacitor/core';
import { CameraResultType } from '@capacitor/camera';

const { Camera } = Plugins;
// import { ImageCropperModule } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { IonUtils, User } from 'src/app/glob.module';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DomSanitizer } from '@angular/platform-browser';
// import { AlertController } from '@ionic/angular';
// import { CLIENT_RENEG_LIMIT } from 'tls';
// import { SelectSearchableComponent } from 'ionic-select-searchable';


// class Port {
//   public name: number;
//   public code: string;
// }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firstName: string;
  lastName: string;
  profilePic: any;
  ionicForm: FormGroup;
  isSubmitted: boolean;
  createAccountStatus: boolean;
  emailStatus: boolean
  passwordStatus: boolean;
  passName: string;
  myImage: string;
  uEmail: string;
  croppedImage: any;
  cropCard: boolean;
  countries: any;
  userId: any;
  symId: string;
  userType: string;
  profilePic2: string;
  // ports: Port[];
  //   port: Port;

  constructor(
    private storage: Storage, //err
    private router: Router,
    private symService: SymService,
    public formBuilder: FormBuilder,
    // public camera: Camera, // err
    public actionSheetController: ActionSheetController,
    public user: User,
    public ionUtils: IonUtils,
    public dms: DomSanitizer,

  ) {


  }

  ngOnInit() {
    // this.ionUtils.alertSuccess({
    //   header: 'Alert',
    //   subHeader: 'test1',
    //   message: 'test1',
    // });
      this.storage.get('userAuth').then((res) => {
      if(!res){
        this.router.navigate(['/login']);
      }else{

        // this.ionUtils.alertSuccess({
        //   header: 'Alert',
        //   subHeader: 'test2',
        //   message: 'test2',
        // });
        this.user.get().then((userObj)=>{

          this.profilePic = '../assets/img/profile/avatar_male.png';
          this.profilePic2 = '../assets/img/profile/avatar_male.png';
          this.passName = 'Password';
          this.symId = '1';
          this.userType = '1';

          // this.ionUtils.alertSuccess({
          //   header: 'Alert',
          //   subHeader: userObj['firstName']+'_'+userObj['lastName'],
          //   message: rootFileUrl+userObj['filePath'],
          // });

          const formData = new FormData();
          this.userId = userObj['id'];
          this.symId = userObj['symId'];

          // let credIn = {
          //   symId: this.symId,
          //   userId: this.userId,
          //   userType: this.userType,
          //   profileImage: this.myImage,
          // };

          // this.user.updateProfileImage(credIn).then(res=>{
          //   cl(res)
          //   this.profilePic = rootFileUrl+res['filePath'];
          // });



          formData.append('action', 'getOneUser');
          formData.append('userId', userObj['id']);
          formData.append('symId', this.symId);

          if(userObj['filePath']!='no_profileImage'){
            this.profilePic = rootFileUrl+userObj['filePath'];
          }
          // this.ionUtils.alertSuccess({
          //     header: 'Alert',
          //     subHeader: this.profilePic,
          //     message: 'Your Profile has been updated.',
          //   });
            this.firstName = userObj['firstName'].replace(/\s/g, '');
            this.lastName = userObj['lastName'];

            this.ionicForm.get('firstname').setValue(userObj['firstName']);
            this.ionicForm.get('lastname').setValue(userObj['lastName']);
            this.ionicForm.get('userName').setValue(userObj['userName']);
            this.ionicForm.get('email').setValue(userObj['userEmail']);
            this.ionicForm.get('mobileNumber').setValue(userObj['mobileNumber']);
            this.ionicForm.get('dateOfBirth').setValue(userObj['dateOfBirth']);
            this.ionicForm.get('country').setValue(userObj['country']);

            this.ionicForm.controls.oldPassword.disable();

            this.emailStatus = true;
            this.passwordStatus = false;

            // this.ionUtils.alertSuccess({
            //   header: 'Alert',
            //   subHeader: this.profilePic,
            //   message: this.profilePic,
            // });
        });
      }
    });
    let passValidator = [];
    this.ionicForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', []],
      dateOfBirth: ['', []],
      country: ['', []],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      memoriesMade: ['', []],
      oldPassword: ['', passValidator],
      newPassword: ['', passValidator],
      passwordConfirm: ['', passValidator]
    });

    const formData2 = new FormData();
      formData2.append('action', 'getCountries');
      this.user.get().then((userObj)=>{
        let userData = stringToJson(userObj);
        // cl('change profile', userObj['token'])
        this.symService.easyService(formData2, userObj['token']).subscribe(res=>{
          this.countries = res.response;
        });
      })

  }
  get errorControl() {
    return this.ionicForm.controls;
  }

//   portChange(event: {
//     component: SelectSearchableComponent,
//     value: any
// }) {
//     // console.log('port:', event.value);
// }
async pickImage(sourceType) {
 

  // const options: CameraOptions = {
  //   quality: 70,
  //   destinationType: this.camera.DestinationType.DATA_URL,
  //   targetWidth:  320,
  //   targetHeight: 240,
  //   encodingType: this.camera.EncodingType.JPEG,
  //   mediaType: this.camera.MediaType.PICTURE,
  //   sourceType: sourceType
  // }
  // // this.ionUtils.alertSuccess({
  // //   header: 'Alert',
  // //   subHeader: 'data',
  // //   message: 'TEST',
  // // });
  // await this.camera.getPicture(options).then((imageData) => {
  //   // this.ionUtils.loading();
  //   // this.profilePic = (<any>window).Ionic.WebView.convertFileSrc(imageData);
  //   this.profilePic = this.display(imageData);
  //   // imageData is either a base64 encoded string or a file URI
  //   this.myImage = 'data:image/jpeg;base64,' + imageData;

  //   //  this.myImage = imageData;
  //   //  this.profilePic = this.myImage;
  //    let credIn = {
  //     symId: this.symId,
  //     userId: this.userId,
  //     userType: this.userType,
  //     profileImage: this.myImage,
  //   };

  //   cl(['image_uri', this.myImage])
  //   // this.ionUtils.alertSuccess({
  //   //   header: 'Alert',
  //   //   subHeader: 'data',
  //   //   message: this.myImage ,
  //   // });

  //   this.user.updateProfileImage(credIn).then(res=>{
  //     this.profilePic = rootFileUrl+res['filePath'];
  //     this.ionUtils.loadingDismiss();
  //   });
  // }, (err) => {
  //   console.log(err);
  // });
}

async selectImage() {
cl('Camera_on')

try{

  const image = await Camera.getPhoto({
    quality:70,
    allowEditing: true,
    resultType: CameraResultType.Base64
  });
  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  var imageUrl = image.base64String;
  this.myImage = 'data:image/jpeg;base64,' + imageUrl;

  // Can be set to the src of an image now
  let credIn = {
    symId: this.symId,
    userId: this.userId,
    userType: this.userType,
    profileImage: this.myImage,
  };

  this.user.updateProfileImage(credIn).then(res=>{
    this.profilePic = rootFileUrl+res['filePath'];
    this.ionUtils.loadingDismiss();
  });
} catch (err) {
  cl(err);
}



  // const actionSheet = await this.actionSheetController.create({
  //   header: "Select Image source",
  //   buttons: [{
  //     text: 'Load from Library',
  //     handler: () => {
  //       this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
  //     }
  //   },
  //   {
  //     text: 'Use Camera',
  //     handler: () => {
  //       this.pickImage(this.camera.PictureSourceType.CAMERA);
  //     }
  //   },
  //   {
  //     text: 'Cancel',
  //     role: 'cancel'
  //   }
  //   ]
  // });
  // await actionSheet.present();
}

display(b64: string) {
  return this.dms.bypassSecurityTrustUrl("data:image/jpeg;base64," + b64);
}



  captureImage() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   this.myImage = 'data:image/jpeg;base64,' + imageData;
    //   // this.profilePic = this.myImage;
    //   this.cropCard = true;
    // });
  }

  doneCroping(){
    this.croppedImage="";
    this.cropCard = false;
  }

  convertFileDataToURLviaFileReader(url: string){
    return Observable.create(observer =>{
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.onload = function(){
        let reader: FileReader = new FileReader();
        reader.onloadend = function () {
          observer.next(reader.result);
          observer.complete();
        }
        reader.readAsDataURL(xhr.response)
      };
      xhr.open('Get' ,url)
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  updatePassword(){
    this.ionicForm.controls.email.enable();
    if(this.passwordStatus == false){
      this.storage.get('userCredL').then((res2) => {
        const formData = new FormData();
        formData.append('action', 'getOneUser');
        formData.append('id', res2['id']);
        this.symService.easyService(formData).subscribe((res3)=>{
          this.passwordStatus = true;
          this.passName = 'Old Password';
          // this.uEmail = res3['response'][0]['userEmail'];
          this.ionicForm.controls.oldPassword.enable();

          let passValidator = [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')];
          this.ionicForm = this.formBuilder.group({
            firstname: [this.ionicForm.value.firstname, [Validators.required, Validators.minLength(2)]],
            lastname: [this.ionicForm.value.lastname, [Validators.required, Validators.minLength(2)]],
            userName: [this.ionicForm.value.userName, []],
            dateOfBirth: [this.ionicForm.value.dateOfBirth, []],
            country: [this.ionicForm.value.country, []],
            email: [this.ionicForm.value.email],
            mobileNumber: [this.ionicForm.value.mobileNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
            memoriesMade: ['', []],
            oldPassword: ['', passValidator],
            newPassword: ['', passValidator],
            passwordConfirm: ['', passValidator]
          });
        });
      })
    } else{
      this.storage.get('userCredL').then((res2) => {
        const formData = new FormData();
        formData.append('action', 'getOneUser');
        formData.append('id', res2['id']);
        this.symService.easyService(formData, res2['token']).subscribe((res3)=>{
          this.passwordStatus = false;
          this.passName = 'Password';
          this.ionicForm.get('oldPassword').setValue('');
          this.ionicForm.get('newPassword').setValue('');
          this.ionicForm.get('passwordConfirm').setValue('');
          this.ionicForm.controls.oldPassword.disable();
          let passValidator = [];
          this.ionicForm = this.formBuilder.group({
            firstname: [this.ionicForm.value.firstname, [Validators.required, Validators.minLength(2)]],
            lastname: [this.ionicForm.value.lastname, [Validators.required, Validators.minLength(2)]],
            userName: [this.ionicForm.value.userName, []],
            dateOfBirth: [this.ionicForm.value.dateOfBirth, []],
            country: [this.ionicForm.value.country, []],
            email: [this.ionicForm.value.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
            mobileNumber: [this.ionicForm.value.mobileNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
            memoriesMade: ['', []],
            oldPassword: ['', passValidator],
            newPassword: ['', passValidator],
            passwordConfirm: ['', passValidator]
          });
        });
      })
    }
  }

  submitForm(){
    this.isSubmitted = true;
    let password = '';
    this.myImage = undefined;
    if(this.ionicForm.value.password == undefined){
      password = 'no_password';
    } else{
      password = this.ionicForm.value.password;
    }

    // console.log(this.myImage)
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      // this.ionUtils.alertSuccess({
      //   header: 'Alert',
      //           subHeader: '',
      //           message: this.myImage,
      // });
      let formData = new FormData();
      formData.append('action', 'updateAccount');
      formData.append('profileImage', this.myImage);
      formData.append('firstName', this.ionicForm.value.firstname);
      formData.append('lastName', this.ionicForm.value.lastname);
      formData.append('userName', this.ionicForm.value.userName);
      formData.append('userEmail', this.ionicForm.value.email);
      formData.append('mobileNumber', this.ionicForm.value.mobileNumber);
      formData.append('dateOfBirth', this.ionicForm.value.dateOfBirth);
      formData.append('country', this.ionicForm.value.country);
      formData.append('userPassword', password);
      formData.append('img', 'empty');
      formData.append('userType', '1');
      formData.append('symId', '1');
      formData.append('userId', this.userId );
      // formData.append('activationStatus', '0');
      cl(this.myImage);
      this.storage.get('userCredL').then((res2) => {
        let userData = stringToJson(res2);

        cl('123',userData)
        this.symService.easyService(formData, userData['token']).subscribe(res=>{

          cl('serve response', res)

          // return

          if(res['response']['activationStatus']  == 1){
            this.user.updateAndGet(res['response']).then((res2)=>{
              // cl(res2);
              if(this.myImage != undefined){
                this.profilePic = rootFileUrl+res2['filePath'];
              }
              this.ionUtils.alertSuccess({
                header: 'Alert',
                subHeader: '',
                message: 'Your Profile has been updated.',
              });
            });
          }
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
