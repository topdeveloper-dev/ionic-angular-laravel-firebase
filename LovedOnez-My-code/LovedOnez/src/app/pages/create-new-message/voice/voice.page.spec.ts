import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VoicePage } from './voice.page';

describe('VoicePage', () => {
  let component: VoicePage;
  let fixture: ComponentFixture<VoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
