import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoPage } from './video.page';

describe('VideoPage', () => {
  let component: VideoPage;
  let fixture: ComponentFixture<VideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
