import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PessoaPage } from './pessoa.page';

describe('PessoaPage', () => {
  let component: PessoaPage;
  let fixture: ComponentFixture<PessoaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PessoaPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
