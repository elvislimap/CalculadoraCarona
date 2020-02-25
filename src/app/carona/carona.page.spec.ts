import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CaronaPage } from './carona.page';

describe('CaronaPage', () => {
  let component: CaronaPage;
  let fixture: ComponentFixture<CaronaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaronaPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CaronaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
