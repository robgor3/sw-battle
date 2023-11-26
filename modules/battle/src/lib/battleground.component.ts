import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent, ButtonPrimaryDirective, ButtonWarnDirective, SelectComponent } from '@sw-battle/ui';
import { Observable, take } from 'rxjs';
import { BattleService } from './battle.service';
import { BattleEngineService } from './engine/battle-engine.service';
import { Contender } from './models/contender';
import { GameMode } from './models/game-mode';
import { PlayerComponent } from './player/player.component';
import { BattleAdapterService } from './state/api/battle-adapter.service';
import { BattleApiService } from './state/api/battle-api.service';
import { BattleStore } from './state/battle-store.service';

@Component({
  imports: [
    CommonModule,
    PlayerComponent,
    ButtonComponent,
    ButtonPrimaryDirective,
    ButtonWarnDirective,
    SelectComponent,
  ],
  providers: [BattleService, BattleStore, BattleApiService, BattleAdapterService, BattleEngineService],
  standalone: true,
  selector: 'sw-battle-battleground',
  templateUrl: './battleground.component.html',
  styleUrl: './battleground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlegroundComponent implements OnInit {
  public readonly firstContender$: Observable<Contender> = this.battleService.firstContender$;
  public readonly secondContender$: Observable<Contender> = this.battleService.secondContender$;
  public readonly gameMode$: Observable<GameMode> = this.battleService.gameMode$;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private readonly battleService: BattleService) {}

  public ngOnInit(): void {
    this.battleService.getGameMetadata$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public setGameMode(mode: GameMode): void {
    this.battleService.setGameMode(mode);
  }

  public onFightButtonClick(): void {
    this.battleService.fight$().pipe(take(1)).subscribe();
  }

  public onResetButtonClick(): void {
    this.battleService.resetGame();
  }
}
