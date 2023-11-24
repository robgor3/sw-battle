import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable, take, tap } from 'rxjs';
import { BattleStateModel } from '../models/battle-state-model';
import { BattleApiService, GameMetadata } from './api/battle-api.service';
import { getDefaultBattleState } from './get-default-battle-state';

@Injectable()
export class BattleState {
  private readonly state$: BehaviorSubject<BattleStateModel> = new BehaviorSubject<BattleStateModel>(
    getDefaultBattleState(),
  );

  constructor(private readonly apiService: BattleApiService) {
    // TODO dev only, remove
    this.state$
      .pipe(
        tap((state: BattleStateModel) => {
          console.log(state);
        }),
      )
      .subscribe();
  }

  public getGameMetadata(): void {
    this.apiService
      .getGameMetadata$()
      .pipe(
        tap({
          next: (gameMetadata: GameMetadata) => {
            this.patchState({ gameMetadata });
          },
          error: () => {
            this.patchState({ gameMetadata: { totalPeopleCount: 0, totalStarshipsCount: 0 } });
          },
        }),
        take(1),
      )
      .subscribe();
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
