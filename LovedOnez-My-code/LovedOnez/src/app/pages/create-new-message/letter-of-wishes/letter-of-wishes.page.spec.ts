import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LetterOfWishesPage } from './letter-of-wishes.page';

describe('LetterOfWishesPage', () => {
  let component: LetterOfWishesPage;
  let fixture: ComponentFixture<LetterOfWishesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfWishesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LetterOfWishesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
