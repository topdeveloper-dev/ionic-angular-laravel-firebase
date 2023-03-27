import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-welcome-video',
  templateUrl: './welcome-video.page.html',
  styleUrls: ['./welcome-video.page.scss'],
})
export class WelcomeVideoPage implements OnInit {
  appLogo: string;
  videoUrl: string;
  constructor(
    private route: Router,
    public  sanitizer:DomSanitizer
    ) { 
    this.appLogo = '../assets/img/app_logo.png';
  }

  ngOnInit() {
  }

  async playVideo(){
    // try{
    //   this.videoOptions = {
    //     volume: 0.7
    //   };
    //   this.videoUrl = 'https://www.youtube.com/watch?v=YTt4jtiD_M4';
    //   // this.videoPlayer.play(this.videoUrl, this.videoOptions)
    // }catch(e){
    //   console.error(e);
    // }
  }

  goToLogin(){
    this.route.navigate(['/login']); 
  }

}
