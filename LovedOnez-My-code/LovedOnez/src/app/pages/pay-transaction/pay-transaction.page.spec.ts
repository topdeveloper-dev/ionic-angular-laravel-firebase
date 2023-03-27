import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayTransactionPage } from './pay-transaction.page';

describe('PayTransactionPage', () => {
  let component: PayTransactionPage;
  let fixture: ComponentFixture<PayTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayTransactionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
