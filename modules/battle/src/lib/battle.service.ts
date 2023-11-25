import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BattleStateModel } from './models/battle-state-model';
import { Contender } from './models/contender';
import { GameMode } from './models/game-mode';
import { GameMetadata } from './state/api/battle-api.service';
import { BattleState } from './state/battle.state';

@Injectable()
export class BattleService {
  public readonly firstContender$: Observable<Contender> = this.store.select(
    ({ firstContender }: BattleStateModel) => firstContender,
  );
  public readonly secondContender$: Observable<Contender> = this.store.select(
    ({ secondContender }: BattleStateModel) => secondContender,
  );
  public readonly gameMode$: Observable<GameMode> = this.store.select(({ gameMode }: BattleStateModel) => gameMode);
  public readonly gameMetadata$: Observable<GameMetadata> = this.store.select(
    ({ gameMetadata }: BattleStateModel) => gameMetadata,
  );

  constructor(private readonly store: BattleState) {}

  public init(): void {
    this.store.getGameMetadata();
  }

  public fight(): void {
    console.log('fight');
  }

  public setGameMode(gameMode: GameMode): void {
    this.store.setGameMode(gameMode);
  }

  public resetGame(): void {
    this.store.resetStateWithoutMetadata();
  }
}
