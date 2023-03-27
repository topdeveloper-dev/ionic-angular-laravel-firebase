import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirstLoginPage } from './first-login.page';

describe('FirstLoginPage', () => {
  let component: FirstLoginPage;
  let fixture: ComponentFixture<FirstLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
