import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayConformationComponent } from './pay-conformation.component';

describe('PayConformationComponent', () => {
  let component: PayConformationComponent;
  let fixture: ComponentFixture<PayConformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayConformationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayConformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
