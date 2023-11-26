import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MockModule } from 'ng-mocks';
import { SelectComponent } from './select.component';

describe(SelectComponent, () => {
  let fixture: ComponentFixture<SelectComponent<string>>;
  let component: SelectComponent<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, MockModule(MatFormFieldModule), MockModule(MatSelectModule)],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent<string>);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
