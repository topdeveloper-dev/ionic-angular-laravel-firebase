import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessageOptionsPage } from './message-options.page';

describe('MessageOptionsPage', () => {
  let component: MessageOptionsPage;
  let fixture: ComponentFixture<MessageOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
