import { Injectable } from '@angular/core';
import { SelectOption } from '@sw-battle/ui';
import { Observable, tap } from 'rxjs';
import { BattleEngineService } from './engine/battle-engine.service';
import { BattleStateModel } from './models/battle-state-model';
import { Contender } from './models/contender';
import { GameMetadata } from './models/game-metadata';
import { GameMode } from './models/game-mode';
import { GameResult } from './models/game-result';
import { BattleStore } from './state/battle-store.service';

@Injectable()
export class BattleService {
  public readonly firstContender$: Observable<Contender> = this.store.select(
    ({ firstContender }: BattleStateModel) => firstContender,
  );
  public readonly secondContender$: Observable<Contender> = this.store.select(
    ({ secondContender }: BattleStateModel) => secondContender,
  );
  public readonly firstContenderWinsCount$: Observable<number> = this.store.select(
    ({ firstContenderWinsCount }: BattleStateModel) => firstContenderWinsCount,
  );
  public readonly secondContenderWinsCount$: Observable<number> = this.store.select(
    ({ secondContenderWinsCount }: BattleStateModel) => secondContenderWinsCount,
  );
  public readonly winnerId$: Observable<number | null> = this.store.select(
    ({ currentWinnerId }: BattleStateModel) => currentWinnerId,
  );
  public readonly gameMode$: Observable<GameMode> = this.store.select(({ gameMode }: BattleStateModel) => gameMode);
  public readonly gameMetadata$: Observable<GameMetadata> = this.store.select(
    ({ gameMetadata }: BattleStateModel) => gameMetadata,
  );
  public readonly gameModeOptions: SelectOption<GameMode>[] = this.createGameModeSelectOptions();
  public readonly isFightInProgress$: Observable<boolean> = this.store.select(
    ({ isFightInProgress }: BattleStateModel) => isFightInProgress,
  );

  constructor(private readonly store: BattleStore, private readonly battleEngineService: BattleEngineService) {}

  public getGameMetadata$(): Observable<GameMetadata> {
    return this.battleEngineService.getGameMetadata$();
  }

  public fight$(): Observable<GameResult> {
    this.store.setFightInProgress(true);

    return this.battleEngineService.playGame$({ metadata$: this.gameMetadata$, mode$: this.gameMode$ }).pipe(
      tap((result: GameResult) => {
        this.store.setGameResult(result);
      }),
    );
  }

  public setGameMode(gameMode: GameMode): void {
    this.store.setGameMode(gameMode);
  }

  public resetGame(): void {
    this.store.resetStateWithoutMetadata();
  }

  private createGameModeSelectOptions(): SelectOption<GameMode>[] {
    const x: (SelectOption<GameMode> | null)[] = Object.entries(GameMode)
      .map(([key, value]: [string, string | GameMode]) => {
        if (typeof value === 'string') {
          return null;
        }

        return {
          value: value as GameMode,
          label: this.formatGameModeLabel(key),
        };
      })
      .filter(Boolean);

    return x as SelectOption<GameMode>[];
  }

  private formatGameModeLabel(label: string): string {
    const lowercaseLabel: string = label.toLowerCase();

    return lowercaseLabel.charAt(0).toUpperCase() + lowercaseLabel.slice(1);
  }
}
