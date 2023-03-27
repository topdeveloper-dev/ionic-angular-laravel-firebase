import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-message',
  templateUrl: './create-new-message.page.html',
  styleUrls: ['./create-new-message.page.scss'],
})
export class CreateNewMessagePage implements OnInit {

  massageTypes = [
    {
      title: 'TEXT',
      url: '/menu/create-new-message/text',
      icon: 'document-text-outline',
      iconBackground: '#0B5170'
    },
    {
      title: 'VOICE',
      url: '/menu/create-new-message/voice',
      icon: 'mic-outline',
      iconBackground: '#EA546C'
    },
    {
      title: 'VIDEO',
      url: '/menu/create-new-message/video',
      icon: 'videocam-outline',
      iconBackground: '#74A6D1'
    },
    {
      title: 'ALL-IN-ONE',
      url: '/menu/create-new-message/all-in-one',
      icon: 'cube-outline',
      iconBackground: '#C0A3B2'
    },
    {
      title: 'LETTER OF WISHES',
      url: '/menu/create-new-message/letter-of-wishes',
      icon: 'star-outline',
      iconBackground: '#4FB7C0'
    },
  ];

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }



}
