import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestDemoPage } from './test-demo.page';

describe('TestDemoPage', () => {
  let component: TestDemoPage;
  let fixture: ComponentFixture<TestDemoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDemoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
