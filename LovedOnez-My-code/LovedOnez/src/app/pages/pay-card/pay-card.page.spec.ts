import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayCardPage } from './pay-card.page';

describe('PayCardPage', () => {
  let component: PayCardPage;
  let fixture: ComponentFixture<PayCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
