import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReceiverDetailsFormPage } from './receiver-details-form.page';

describe('ReceiverDetailsFormPage', () => {
  let component: ReceiverDetailsFormPage;
  let fixture: ComponentFixture<ReceiverDetailsFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverDetailsFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiverDetailsFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
