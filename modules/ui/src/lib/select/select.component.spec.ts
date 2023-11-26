import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { GameMode } from '@sw-battle/battle';
import { MockModule } from 'ng-mocks';
import { SelectComponent } from './select.component';
import spyOn = jest.spyOn;

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

  describe('#changeGameMode', () => {
    it('should emit change gane mode event', () => {
      const selectedGameMode: GameMode = GameMode.STARSHIPS;

      spyOn(component.selectionChange, 'emit');

      component.changeGameMode({ source: {} as unknown as MatSelect, value: selectedGameMode });

      expect(component.selectionChange.emit).toHaveBeenCalledWith(selectedGameMode);
    });
  });
});
