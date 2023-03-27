
// import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { apiUrl, cl, jsonToString, rootFileUrl, stringToJson } from './globUtils';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { SymService } from './services/sym.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Entry, File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

// import { userInfo } from 'os';
// import { Injectable } from '@angular/core';

@Injectable()
export class Authentication {
    isLoggedIn: boolean;
    user: any;
    constructor(
        private route: Router,
        private storage: Storage,
        // private androidPermissions: AndroidPermissions,
    ) {

    }

    async login(cred, callback) {
        await this.storage.set('userAuth', true);
        await  this.storage.set('userCredL', JSON.stringify(cred));
        this.isLoggedIn = true;
        callback(this.isLoggedIn);
        // await this.getUserData().then((res)=> {
        // });
    }

    async setDeviceToken(str){
        await this.storage.set('deviceToken', str);
    }
    // checkPermissions(){
    //     this.androidPermissions.requestPermissions(
    //         [
    //             this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    //             this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
    //         ]
    //     );
    // }
     async getUserData(callback) {
        await this.storage.get('userCredL').then((res2) => {
           const userObj = JSON.parse(res2);
        callback(userObj);
        });
    }


    async firstDbSync(callback) {
        await this.storage.get('localDbSync').then((res) => {
        callback(res);
        });
    }

    getSLength() {
        return new Promise(resolve => {
          this.storage.get('userCredL').then((data) => {
            if(data){
              resolve(data);
            }
          });
        });
    }

    async logout() {
        this.storage.remove('userCredL').then(x=>{
            this.storage.remove('userAuth').then(y=>{
                this.isLoggedIn = false;
                this.route.navigate(['/login']);
            });
        });
    }

    getUser() {
        return this.user;
    }




    isNewUser(){
        let newUserStat = this.storage.get('newUser');
        return newUserStat['__zone_symbol__value'];
    }

}
@Injectable()
export class User {
    isLoggedIn: boolean;
    user: any;
    constructor(
        private storage: Storage,
        private authentication: Authentication,
        private symService: SymService,
        private file: File,
        private filePath: FilePath,

    ) {

    }


    get(): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.authentication.getUserData((res)=>{
               // cl('cgeck user ', res);
                resolve(res);
                
            });
        }))
    }


    async setSettings(): Promise<Object> {
        return new Promise<Object>((async resolve => {
            await this.storage.remove('appSettings');
            await this.storage.remove('settings');
            this.authentication.getUserData(async (res)=>{
                const formData = new FormData();
                // cl('123', res)
                if(res!=null){
                    formData.append('action', 'getAppSettings');
                    formData.append('userId', res['id']);
                    await this.symService.easyService(formData, res['token']).subscribe(async res =>{
                        const settings = jsonToString(res['response'][0])
                        await this.storage.set('appSettings', settings);
                    })
                }
            });
        }))
    }

    async getAppSettings(): Promise<Object> {
        return new Promise<Object>((async resolve => {
            await this.storage.get('appSettings').then((data) => {
                if(data){
                    const settings = stringToJson(data);
                    resolve(settings);
                }else{
                    resolve('not_set');
                }
              });
        }));
    }

    async getDeviceToken(): Promise<Object> {
        return new Promise<Object>((async resolve => {
            await this.storage.get('deviceToken').then((data) => {
                if(data){
                    // const settings = stringToJson(data);
                    resolve(data);
                }else{
                    resolve('xx:yy');
                }
              });
        }));
    }

    async updateSettings(body): Promise<Object> {
        return new Promise<Object>((async resolve => {
            await this.storage.remove('appSettings');
            const settings = jsonToString(body)
            await this.storage.set('appSettings', settings);
            resolve(body)
        }));
    }

    device(): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.storage.get('deviceToken').then((data) => {
                let res;
                if(data){
                    res = data;
                }else{
                    res = 'not_set';
                }
                resolve(res);
              });
        }))
    }

    async update(cred): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.storage.remove('userCredL');
            this.storage.set('userCredL', JSON.stringify(cred));
            resolve(true);
        }))
    }

    async acceptTermsAndCondition(): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.storage.set('termsAndCondition', 1);
            resolve(true);
        }))
    }

//-------------------------------------------------------------------------------------------------------//
    //Upload file
    async uploadFile(body): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.symService.upload(body, response => {
                resolve(response);
            })
            //resolve(body['localFilePath']);
        }))
    }

    //Upload file
    async uploadFileAudio(body): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.symService.uploadFileAudio(body, response => {
                resolve(response);
            })
            //resolve(body['localFilePath']);
        }))
    }

    //Donloadfile
    async dowloadFile(memory): Promise<Object> {
        return new Promise<Object>((async resolve => {
            let result;
            let splitName =  memory[Object.keys(memory)[0]].split('_');
            let fileObj = {
                serverUrl: rootFileUrl+'lovedOnesFiles/'+Object.keys(memory)[0]+'/'+splitName[1]+'/'+memory[Object.keys(memory)[0]],
                folderName: Object.keys(memory)[0],
                filename: memory[Object.keys(memory)[0]],
            };


           await this.checkDirectory(fileObj.folderName).then(async (directoryName) => {
                fileObj['localUrl'] = directoryName+memory[Object.keys(memory)[0]];

                // cl('local file url', fileObj['localUrl'])
                // Check if file exists..
                    await this.file.resolveLocalFilesystemUrl(fileObj['localUrl']).then(res => {
                        result = fileObj['localUrl'];
                    }).catch(async err => {
                       // alert(err.message);
                        if(err.message=='NOT_FOUND_ERR' || err.message== 'ENCODING_ERR'){
                           await this.symService.download(fileObj).then((newRes)=>{
                                result = newRes;
                            })
                        }
                    })
                    resolve(result);
            })
        }))
    }

    async checkFile(filePath): Promise<Object> {
        return new Promise<Object>((async resolve => {
            let result;
            await this.file.resolveLocalFilesystemUrl(filePath).then(res => {
                result = res;
            }).catch(err => {
                 result = err;
            })
                resolve(result);
        }))
    }



    async checkDirectory(typeFolder): Promise<Object> {
        return new Promise<Object>((async resolve => {
            let baseFolder = this.file.externalRootDirectory;
            let result = '' ;
          //  alert(baseFolder);
            await this.file.resolveLocalFilesystemUrl(baseFolder+'lovedOnesbd/'+typeFolder).then((entry: Entry) => {
                // console.log(entry.fullPath);

                result = baseFolder+'lovedOnesbd/'+typeFolder+'/';
                // resolve(result);

            },async err => {
                //  console.log(err);
               // alert('type' + err.message);
                 if (err.message == 'NOT_FOUND_ERR' || err.message== 'ENCODING_ERR'){
                    // cl(['loved1ns folder exists',exists])
                    await this.file.createDir(baseFolder, 'lovedOnesbd/'+typeFolder, true).then(
                          (dirEntry) => {

                              result = baseFolder+'lovedOnesbd/'+typeFolder+'/';

                            // cl(['dirEntry', result]);
                            // resolve(result);
                           // alert( jsonToString(result) );

                        },
                        err => {

                            result = err;
                            // resolve(result);
                            // console.log('CreateDir error: ' + err);
                          //  alert('erro 1 ' + jsonToString(result) );
                        }
                        ).catch( exception => {

                            result = exception;
                            // resolve(result);
                            //  console.log(exception);
                           // alert('erro 2 ' + jsonToString(result) );

                            } );
                 }
             });
           //  alert( jsonToString(result) );
            resolve(result);
        }))
    }

//-------------------------------------------------------------------------------------------------------//

    async checkTermsAndCondition(): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.storage.get('termsAndCondition').then((data) => {

                let res;

                if(data){
                    res = data;
                }else{
                    res = 'not_set';
                }
                resolve(res);

              });

        }))
    }

    updateProfileImage(cred): Promise<Object> {
        return new Promise<Object>((resolve => {
            let formData11 = new FormData();
            formData11.append('action', 'updateProfileImage');
            formData11.append('profileImage', cred.profileImage);
            formData11.append('userType', cred.userType);
            formData11.append('symId', cred.symId);
            formData11.append('userId', cred.userId );
            this.symService.easyService(formData11 ,cred.token).subscribe(res=>{
            // this.ionUtils.loadingDismiss();
                this.authentication.getUserData(res2=>{
                    let sessData = res2;
                    sessData['filePath'] = res['response']['filePath']
                    this.updateAndGet(sessData).then(res3=>{
                        resolve(res3);
                    });
                });
            });
        }))
    }

    updateAndGet(cred): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.update(cred).then((res)=>{
                if(res){
                    this.get().then((res2)=>{
                        resolve(res2);
                    })
                }
            })
        }))
    }



}

@Injectable()
export class AppControl {

    constructor(
        //   private alertController: AlertController,
      private platform: Platform,
      private loadingController: LoadingController,
      private symService: SymService,
      private authentication: Authentication,
      private user: User,
      private fileTransfer: FileTransfer,
      private ionUtils: IonUtils,
      ) {
          //   this.getAllMemories();
        }

        createMemory(cred): Promise<Object> {
            return new Promise<Object>((resolve => {
                this.user.get().then(useRes => {
                    // cl(['useRes', useRes]);
                    cred.senderId = useRes['id'];
                    // cl(['send', cred]);
                    let formData = this.convData(cred);
                this.symService.easyService(formData, useRes['token']).subscribe(res=>{
                    // cl('serverResult', res)
                    resolve(res['response'][0]);
                });
            });
        }))
    }

    getSubscriptionTypes(): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.user.get().then(useRes => {
                let formData = new FormData();
                formData.append('action', 'getSubscriptionsTypes');
                this.symService.easyService(formData, useRes['token']).subscribe(res=>{
                    resolve(res['response']);
                });
            });
        }))
    }

    syncMemoriesToServer(memoryData: string): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.user.get().then(useRes => {
                let formData = new FormData();
                formData.append('action', 'syncMemories');
                formData.append('memoryData', memoryData);
                this.symService.easyService(formData, useRes['token']).subscribe(res=>{
                    resolve(res['response']);
                });
            });
        }))
    }
      getLatestMemories(memory): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.user.get().then(useRes => {
                let formData = new FormData();
                formData.append('action', 'getLatestMemories');
                formData.append('id', memory['id']);
                formData.append('senderId', memory['senderId']);
                formData.append('receipientId', memory['receipientId']);
                this.symService.easyService(formData, useRes['token']).subscribe(res=>{
                    resolve(res['response']);
                });
            });
        }))
    }

    deleteMemory(data): Promise<Object> {
        return new Promise<Object>((resolve => {
            this.user.get().then(useRes => {
                // cl('deleteMemory__yes', data);
                data.senderId = useRes['id'];
                // cl('deleteMemory__yes', data);
                let formData = new FormData();
                formData.append('action', 'deleteMemory');
                formData.append('id', data.id);
                this.symService.easyService(formData, useRes['token']).subscribe(res=>{
                    resolve(res['response']);
                });
            });
        }))
    }

    getReceivedMemories(){

    }

    memoryViewed(id): Promise<Object>{
        return new Promise<Object>((resolve => {
            let formData = new FormData();
            formData.append('action', 'memoryViewed');
            formData.append('id', id);
            this.user.get().then(useRes => {
                this.symService.easyService(formData, useRes['token']).subscribe(res=>{
                    // cl(['serverResult', res])
                    resolve(res);
                });
            })
        }))
    }
    getAllMemories(callback){
        this.user.get().then(useRes => {
            let formData = new FormData();
            formData.append('action', 'getAllMemories');
            formData.append('senderId', useRes['id']);
            this.symService.easyService(formData, useRes['token']).subscribe(res=>{
                //cl("qwert",res)
                // if(res[])
                callback(res);
            }, err=>{
                cl(err)
                if(err==='failed_to_authenticate'){

                    this.authentication.logout();
                    this.ionUtils.loadingDismiss();
                }
            });
        })
    }
//--------------------------------------------------------------------------------------

    // getCard(callback){
    //     this.user.get().then(useRes => {
    //         let formData = new FormData();
    //         formData.append('action', 'getCardData');
    //         cl(useRes['token'])
    //         this.symService.easyService(formData, useRes['token']).subscribe(res=>{
    //             //cl("qwert",res)
    //             // if(res[])
    //             callback(res);
    //         }, err=>{
    //             cl(err)
    //             if(err==='failed_to_authenticate'){

    //                 this.authentication.logout();
    //                 this.ionUtils.loadingDismiss();
    //             }
    //         });
    //     })
    // }

    getCard(userId): Promise<Object> {
      return new Promise<Object>((resolve => {
        this.user.get().then(useRes => {
          let formData = new FormData();
          formData.append('action', 'getCard');
          formData.append('userId', userId);
          cl(useRes['token'])
          this.symService.easyService(formData, useRes['token']).subscribe(res=>{
              //cl("qwert",res)
              // if(res[])
              resolve(res);
          }, err=>{
              cl(err)
              if(err==='failed_to_authenticate'){

                  this.authentication.logout();
                  this.ionUtils.loadingDismiss();
              }
          });
      })
      }))
  }

    //------------------------------------------------------------------------------------------

    uploadFile(obj,callback){
        // this.fileTransfer.create
        // this.fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
        //     console.log('download complete: ' + entry.toURL());
        //   }, (error) => {
        //     // handle error
        //   });
    }

    convData(cred){
        let formData = new FormData();
        formData.append('action', 'addMemory');
        if(cred.memoryType == 'text'){

            formData.append('memoryName', cred.memoryName);
            formData.append('memoryBody', cred.memoryBody);
            formData.append('memoryType', cred.memoryType);
            formData.append('videoMemoryPath', 'not_applicable' );
            formData.append('voiceMemoryPath', 'not_applicable' );
            formData.append('imageMemoryPath', 'not_applicable' );

        } else if(cred.memoryType == 'voice'){

            formData.append('memoryName', cred.memoryName);
            formData.append('memoryBody', 'not_applicable');
            formData.append('memoryType', cred.memoryType);
            formData.append('videoMemoryPath', 'not_applicable' );
            formData.append('voiceMemoryPath', cred.voiceMemoryPath );
            formData.append('imageMemoryPath', 'not_applicable' );

        } else if(cred.memoryType == 'video'){

            formData.append('memoryName', cred.memoryName);
            formData.append('memoryBody', 'not_applicable');
            formData.append('memoryType', cred.memoryType);
            formData.append('videoMemoryPath', cred.videoMemoryPath);
            formData.append('voiceMemoryPath', 'not_applicable' );
            formData.append('imageMemoryPath', 'not_applicable' );

        } else if(cred.memoryType == 'all-in-one'){

            formData.append('memoryName', cred.memoryName);
            formData.append('memoryBody', cred.memoryBody);
            formData.append('memoryType', cred.memoryType);
            formData.append('videoMemoryPath', cred.videoMemoryPath );
            formData.append('voiceMemoryPath', cred.voiceMemoryPath );
            formData.append('imageMemoryPath', 'not_applicable' );

        } else if(cred.memoryType == 'letter-of-wishes'){

            formData.append('memoryName', cred.memoryName);
            formData.append('memoryBody', cred.memoryBody);
            formData.append('memoryType', cred.memoryType);
            formData.append('videoMemoryPath', 'not_applicable' );
            formData.append('voiceMemoryPath', 'not_applicable' );
            formData.append('imageMemoryPath', 'not_applicable' );
        }

        cred.reminder == undefined ?  formData.append('reminder', 'not_applicable' ) : formData.append('reminder', cred.reminder );
        cred.repeatDelivery == undefined ?  formData.append('repeatDelivery', 'not_applicable' ) : formData.append('repeatDelivery', cred.repeatDelivery );
        cred.deliveryDate == undefined ?  formData.append('deliveryDate', 'not_applicable' ) : formData.append('deliveryDate', cred.deliveryDate );
        formData.append('senderId', cred.senderId );
        formData.append('receiverName', cred.receiverSurname );
        formData.append('receiverSurname', cred.receiverSurname );
        formData.append('receiverEmail', cred.receiverEmail );
        formData.append('receiverContactNumber', cred.receiverContactNumber);
        formData.append('sendStatus', cred.sendStatus);
        formData.append('location', cred.location);

        return formData;
    }
}
@Injectable()
export class IonUtils  {
    constructor(
      private alertController: AlertController,
      private platform: Platform,
      private loadingController: LoadingController,
      ) {

    }
    async alertSuccess(vals){
        const alert = await this.alertController.create({
            header: vals.header,
            subHeader: vals.subHeader,
            message: vals.message,
            buttons: ['OK']
          });
          await alert.present();
    }
    loading(){
        this.platform.ready().then(()=>{
            this.loadingController.create({
              message: 'Loading...'
            }).then((loadingElement)=>{
              loadingElement.present()
            });
          });
    }
    async loadingDismiss(){
        const popover = await this.loadingController.getTop();
        if (popover)
            await this.loadingController.dismiss();
        // this.loadingController.dismiss();
    }
}
