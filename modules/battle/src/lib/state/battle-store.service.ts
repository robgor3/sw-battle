import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { BattleStateModel } from '../models/battle-state-model';
import { Contender } from '../models/contender';
import { GameMetadata } from '../models/game-metadata';
import { GameMode } from '../models/game-mode';
import { getDefaultBattleState } from './get-default-battle-state';

@Injectable()
export class BattleStore {
  private readonly state$: BehaviorSubject<BattleStateModel> = new BehaviorSubject<BattleStateModel>(
    getDefaultBattleState(),
  );

  constructor() {
    // TODO dev only, remove
    this.state$
      .pipe(
        tap((state: BattleStateModel) => {
          console.log(state);
        }),
      )
      .subscribe();
  }

  public setGameMode(gameMode: GameMode): void {
    this.patchState({ gameMode });
  }

  public setContenders([firstContender, secondContender]: [Contender, Contender]): void {
    this.patchState({ firstContender, secondContender });
  }

  public select<T>(selector: (state: BattleStateModel) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }

  public setState(state: BattleStateModel): void {
    this.state$.next(state);
  }

  public patchState(state: Partial<BattleStateModel>): void {
    const currentValue: BattleStateModel = this.state$.getValue();

    this.state$.next({
      ...currentValue,
      ...state,
      result: {
        ...currentValue.result,
        ...state.result,
      },
    });
  }

  public resetState(): void {
    this.state$.next(getDefaultBattleState());
  }

  public resetStateWithoutMetadata(): void {
    const gameMetadata: GameMetadata = this.state$.getValue().gameMetadata;

    this.state$.next({
      ...getDefaultBattleState(),
      gameMetadata,
    });
  }
}
