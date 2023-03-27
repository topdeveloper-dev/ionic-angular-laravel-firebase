import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateNewMessagePage } from './create-new-message.page';

describe('CreateNewMessagePage', () => {
  let component: CreateNewMessagePage;
  let fixture: ComponentFixture<CreateNewMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
