import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllInOnePage } from './all-in-one.page';

describe('AllInOnePage', () => {
  let component: AllInOnePage;
  let fixture: ComponentFixture<AllInOnePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInOnePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllInOnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
