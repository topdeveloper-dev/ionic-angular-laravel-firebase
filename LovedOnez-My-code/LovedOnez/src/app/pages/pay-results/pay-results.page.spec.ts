import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayResultsPage } from './pay-results.page';

describe('PayResultsPage', () => {
  let component: PayResultsPage;
  let fixture: ComponentFixture<PayResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayResultsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
