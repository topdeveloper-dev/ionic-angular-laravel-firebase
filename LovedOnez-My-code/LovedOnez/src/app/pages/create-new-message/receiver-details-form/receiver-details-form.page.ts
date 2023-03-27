import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Authentication } from 'src/app/glob.module';
import { cl, isUndefinedString, jsonToString, stringToJson } from 'src/app/globUtils';

@Component({
  selector: 'app-receiver-details-form',
  templateUrl: './receiver-details-form.page.html',
  styleUrls: ['./receiver-details-form.page.scss'],
})
export class ReceiverDetailsFormPage implements OnInit {
  ionicForm: FormGroup;
  memory: any;
  receiverName: String;
  receiverSurname: String;
  receiverEmail: String;
  receiverContactNumber: String;
  senderId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authentication: Authentication,
  ) { 
    this.route.queryParams.subscribe(params => {
      // if (params && params.messageId){
      //   this.memory = params;
      // }
      if(this.router.getCurrentNavigation().extras.state){
        this.memory = stringToJson(this.router.getCurrentNavigation().extras.state.memory);

        
        if(this.memory.receiverName != undefined){
            this.receiverName = this.memory.receiverName;
          // this.ionicForm.get('receiverName').setValue(this.memory.receiverName);
        }
        if(this.memory.receiverSurname != undefined){
            this.receiverSurname = this.memory.receiverSurname;
          // this.ionicForm.get('receiverSurname').setValue(this.memory.receiverSurname);
        }
        if(this.memory.receiverEmail != undefined){
            this.receiverEmail = this.memory.receiverEmail;
          // this.ionicForm.get('receiverEmail').setValue(this.memory.receiverEmail);
        }
        if(this.memory.receiverContactNumber != undefined){
              this.receiverContactNumber = this.memory.receiverContactNumber;
          // this.ionicForm.get('receiverContactNumber').setValue(this.memory.receiverContactNumber);
        }
        if(this.memory.messageStatus === "edit-message"){
          this.receiverName = this.memory.receiverName;
          this.receiverSurname = this.memory.receiverSurname;
        }

          // alert(this.memory.videoLocalUrl);    
        // cl(this.memory);
      }else{
        this.router.navigate(['/menu/create-new-message']);
      }
    });
  }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      receiverName: ['', [Validators.required]],
      receiverSurname: ['', [Validators.required]],
      receiverEmail: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      receiverContactNumber: ['', [Validators.required]]
    });
  }

  previousPage(){
    
    this.memory.receiverName = this.ionicForm.value.receiverName;
    this.memory.receiverSurname = this.ionicForm.value.receiverSurname;
    this.memory.receiverEmail = this.ionicForm.value.receiverEmail;
    this.memory.receiverContactNumber = this.ionicForm.value.receiverContactNumber;
    // this.memory.senderId =  this.senderId;
    
    let data = jsonToString(this.memory);
    let navigationExtras: NavigationExtras = {
      state: {
        memory: data
      }
    };
    this.router.navigate(['/menu/create-new-message/'+this.memory.memoryType], navigationExtras);
  }

  submitForm(){

    this.memory.receiverName = this.ionicForm.value.receiverName;
    this.memory.receiverSurname = this.ionicForm.value.receiverSurname;
    this.memory.receiverEmail = this.ionicForm.value.receiverEmail;
    this.memory.receiverContactNumber = this.ionicForm.value.receiverContactNumber;
    // cl(['receiverPage', this.memory])


    if(!isUndefinedString(this.memory.receiverName) && !isUndefinedString(this.memory.receiverSurname) && !isUndefinedString(this.memory.receiverEmail)  && !isUndefinedString(this.memory.receiverContactNumber)){

      cl('receiver-info page', this.memory)
      let data = jsonToString(this.memory);
      let navigationExtras: NavigationExtras = {
        state: {
          memory: data
        }
      };
      this.router.navigate(['/menu/create-new-message/message-summary'], navigationExtras);
    }else{
    }

  }

}
