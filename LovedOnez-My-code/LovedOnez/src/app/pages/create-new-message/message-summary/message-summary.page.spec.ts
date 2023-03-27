import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessageSummaryPage } from './message-summary.page';

describe('MessageSummaryPage', () => {
  let component: MessageSummaryPage;
  let fixture: ComponentFixture<MessageSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
