import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BattleStateModel } from './models/battle-state-model';
import { Contender } from './models/contender';
import { GameMode } from './models/game-mode';
import { BattleState } from './state/battle.state';

@Injectable()
export class BattleService {
  public readonly firstContender$: Observable<Contender> = this.store.select(
    ({ firstContender }: BattleStateModel) => firstContender,
  );
  public readonly secondContender$: Observable<Contender> = this.store.select(
    ({ secondContender }: BattleStateModel) => secondContender,
  );
  public gameMode$: Observable<GameMode> = this.store.select(({ gameMode }: BattleStateModel) => gameMode);

  constructor(private readonly store: BattleState) {}

  public init(): void {
    this.store.getGameMetadata();
  }

  public fight(): void {
    console.log('fight');
  }

  public resetGame(): void {
    this.store.resetStateWithoutMetadata();
  }
}
