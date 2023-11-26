import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { BattleStateModel } from '../models/battle-state-model';
import { GameMetadata } from '../models/game-metadata';
import { GameMode } from '../models/game-mode';
import { GameResult } from '../models/game-result';
import { getDefaultBattleState } from './get-default-battle-state';

@Injectable()
export class BattleStore {
  private readonly state$: BehaviorSubject<BattleStateModel> = new BehaviorSubject<BattleStateModel>(
    getDefaultBattleState(),
  );

  public setFightInProgress(isFightInProgress: boolean): void {
    this.patchState({ isFightInProgress });
  }

  public setGameMode(gameMode: GameMode): void {
    this.patchState({ gameMode });
  }

  public setGameResult({ winnerId, firstContender, secondContender }: GameResult): void {
    const { firstContenderWinsCount, secondContenderWinsCount }: BattleStateModel = this.getCurrentStateValue();
    const firstContenderWins: number =
      winnerId === firstContender.id ? firstContenderWinsCount + 1 : firstContenderWinsCount;
    const secondContenderWins: number =
      winnerId === secondContender.id ? secondContenderWinsCount + 1 : secondContenderWinsCount;

    this.patchState({
      firstContender,
      secondContender,
      currentWinnerId: winnerId,
      firstContenderWinsCount: !!winnerId ? firstContenderWins : firstContenderWinsCount,
      secondContenderWinsCount: !!winnerId ? secondContenderWins : secondContenderWinsCount,
      isFightInProgress: false,
    });
  }

  public select<T>(selector: (state: BattleStateModel) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }

  public setState(state: BattleStateModel): void {
    this.state$.next(state);
  }

  public patchState(state: Partial<BattleStateModel>): void {
    const currentValue: BattleStateModel = this.getCurrentStateValue();

    this.state$.next({
      ...currentValue,
      ...state,
    });
  }

  public resetState(): void {
    this.state$.next(getDefaultBattleState());
  }

  public resetStateWithoutMetadata(): void {
    const gameMetadata: GameMetadata = this.getCurrentStateValue().gameMetadata;

    this.state$.next({
      ...getDefaultBattleState(),
      gameMetadata,
    });
  }

  private getCurrentStateValue(): BattleStateModel {
    return this.state$.getValue();
  }
}
