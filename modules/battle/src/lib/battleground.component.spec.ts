import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, ButtonPrimaryDirective, ButtonWarnDirective, SelectComponent } from '@sw-battle/ui';
import { MockComponents, MockDirectives } from 'ng-mocks';
import { of } from 'rxjs';
import { BattleService } from './battle.service';
import { BattlegroundComponent } from './battleground.component';
import { PlayerComponent } from './player/player.component';
import MockedObject = jest.MockedObject;

describe(BattlegroundComponent, () => {
  let component: BattlegroundComponent;
  let fixture: ComponentFixture<BattlegroundComponent>;
  let battleService: MockedObject<BattleService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BattlegroundComponent,
        MockComponents(PlayerComponent, ButtonComponent, SelectComponent),
        MockDirectives(ButtonPrimaryDirective, ButtonWarnDirective),
      ],
      providers: [{ provide: BattleService, useValue: {} }],
    }).compileComponents();

    TestBed.overrideComponent(BattlegroundComponent, {
      set: {
        providers: [
          {
            provide: BattleService,
            useValue: {
              getGameMetadata$: jest.fn(() => of(undefined)),
              setGameMode: jest.fn(),
              fight$: jest.fn(() => of(undefined)),
              resetGame: jest.fn(),
            },
          },
        ],
      },
    });

    fixture = TestBed.createComponent(BattlegroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    battleService = fixture.componentRef.injector.get(BattleService) as MockedObject<BattleService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get game metadata on init', () => {
    expect(battleService.getGameMetadata$).toHaveBeenCalledTimes(1);
  });

  describe('#onFightButtonClick', () => {
    it('should start fight', () => {
      component.onFightButtonClick();

      expect(battleService.fight$).toHaveBeenCalledTimes(1);
    });
  });

  describe('#onResetButtonClick', () => {
    it('should reset game', () => {
      component.onResetButtonClick();

      expect(battleService.resetGame).toHaveBeenCalledTimes(1);
    });
  });
});
