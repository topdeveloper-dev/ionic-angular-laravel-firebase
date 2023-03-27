import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReceivedMessagePage } from './received-message.page';

describe('ReceivedMessagePage', () => {
  let component: ReceivedMessagePage;
  let fixture: ComponentFixture<ReceivedMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceivedMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
