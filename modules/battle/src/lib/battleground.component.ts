import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  ButtonPrimaryDirective,
  ButtonWarnDirective,
  LetDirective,
  SelectComponent,
  SelectOption,
} from '@sw-battle/ui';
import { Observable, take, tap } from 'rxjs';
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
    LetDirective,
    ReactiveFormsModule,
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
  public readonly firstContenderWinsCount$: Observable<number> = this.battleService.firstContenderWinsCount$;
  public readonly secondContenderWinsCount$: Observable<number> = this.battleService.secondContenderWinsCount$;
  public readonly winnerId$: Observable<number | null> = this.battleService.winnerId$;
  public readonly gameModeOptions: SelectOption<GameMode>[] = this.battleService.gameModeOptions;
  public readonly gameModeControl: FormControl<GameMode> = new FormControl<GameMode>(GameMode.PEOPLE, {
    nonNullable: true,
  });
  public readonly isFightInProgress$: Observable<boolean> = this.battleService.isFightInProgress$;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private readonly battleService: BattleService) {}

  public ngOnInit(): void {
    this.battleService.getGameMetadata$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

    this.gameModeControl.valueChanges
      .pipe(
        tap((mode: GameMode) => {
          this.battleService.setGameMode(mode);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onFightButtonClick(): void {
    this.battleService.fight$().pipe(take(1)).subscribe();
  }

  public onResetButtonClick(): void {
    this.battleService.resetGame();
  }
}
