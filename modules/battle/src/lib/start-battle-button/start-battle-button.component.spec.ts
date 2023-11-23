import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartBattleButtonComponent } from './start-battle-button.component';
import spyOn = jest.spyOn;

describe(StartBattleButtonComponent, () => {
  let fixture: ComponentFixture<StartBattleButtonComponent>;
  let component: StartBattleButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StartBattleButtonComponent] }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartBattleButtonComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('#onClick', () => {
    it('should emit start battle event', () => {
      spyOn(component.startBattle, 'emit');

      component.onClick();

      expect(component.startBattle.emit).toHaveBeenCalledTimes(1);
    });
  });
});
