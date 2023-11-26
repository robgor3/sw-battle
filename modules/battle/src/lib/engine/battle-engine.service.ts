import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Contender, ExistingContender } from '../models/contender';
import { GameMetadata } from '../models/game-metadata';
import { GameMode } from '../models/game-mode';
import { GameParams } from '../models/game-params';
import { GameResult } from '../models/game-result';
import { GetContenderFn } from '../models/get-contender-fn';
import { Person } from '../models/person';
import { BattleApiService } from '../state/api/battle-api.service';
import { BattleStore } from '../state/battle-store.service';
import { getDefaultBattleState } from '../state/get-default-battle-state';

type GetContenderParams = {
  getContenderFn: GetContenderFn;
  id: number;
  opponentId: number;
  rangeLimit: number;
};

@Injectable()
export class BattleEngineService {
  constructor(private readonly apiService: BattleApiService, private readonly store: BattleStore) {}

  public getGameMetadata$(): Observable<GameMetadata> {
    return this.apiService.getGameMetadata$().pipe(
      tap({
        next: (gameMetadata: GameMetadata) => {
          this.store.patchState({ gameMetadata });
        },
        error: () => {
          const defaultMetadataValue: GameMetadata = getDefaultBattleState().gameMetadata;
          this.store.patchState({ gameMetadata: { ...defaultMetadataValue } });
        },
      }),
    );
  }

  public playGame$({ metadata$, mode$ }: GameParams): Observable<GameResult> {
    return combineLatest([mode$, metadata$]).pipe(
      switchMap(([mode, metadata]: [GameMode, GameMetadata]) => {
        const getContenderFn: GetContenderFn = this.resolveGetContenderFn(mode);
        const rangeLimit: number = mode === GameMode.PEOPLE ? metadata.maxPeopleId : metadata.maxStarshipsId;

        return this.getContenders$(getContenderFn, rangeLimit);
      }),
      map(([firstContender, secondContender]: [ExistingContender, ExistingContender]) => ({
        winnerId: this.chooseWinner(firstContender, secondContender),
        firstContender,
        secondContender,
      })),
    );
  }

  private getContenders$(
    getContender: GetContenderFn,
    rangeLimit: number,
  ): Observable<[ExistingContender, ExistingContender]> {
    const [firstContenderId, secondContenderId]: [number, number] = this.getContendersIds(rangeLimit);

    const firstContender$: Observable<Person> = this.getContender$({
      getContenderFn: getContender,
      id: firstContenderId,
      opponentId: secondContenderId,
      rangeLimit,
    }) as Observable<Person>;

    const secondContender$: Observable<Person> = this.getContender$({
      getContenderFn: getContender,
      id: secondContenderId,
      opponentId: firstContenderId,
      rangeLimit,
    }) as Observable<Person>;

    return forkJoin([firstContender$, secondContender$]).pipe(
      switchMap(([firstContender, secondContender]: [Contender, Contender]) => {
        if (firstContender?.name === secondContender?.name) {
          return this.getContender$({
            getContenderFn: getContender,
            id: secondContenderId,
            opponentId: firstContenderId,
            rangeLimit,
          }).pipe(
            map(
              (anotherContender: Contender) =>
                [firstContender, anotherContender] as [ExistingContender, ExistingContender],
            ),
          );
        }

        return of([firstContender, secondContender] as [ExistingContender, ExistingContender]);
      }),
    );
  }

  private getContender$({ getContenderFn, id, opponentId, rangeLimit }: GetContenderParams): Observable<Contender> {
    return getContenderFn(id).pipe(
      switchMap((contender: Contender) => {
        if (!!contender) {
          return of(contender);
        }

        const newId: number = this.generateNewIdForDuplicate(opponentId, rangeLimit);

        return this.getContender$({ getContenderFn, id: newId, opponentId, rangeLimit });
      }),
    );
  }

  private getContendersIds(rangeLimit: number): [number, number] {
    const firstContenderId: number = this.getRandomContenderId(rangeLimit);
    const secondContenderId: number = this.getRandomContenderId(rangeLimit);

    if (firstContenderId === secondContenderId) {
      return this.getContendersIds(rangeLimit);
    }

    return [firstContenderId, secondContenderId];
  }

  private getRandomContenderId(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private generateNewIdForDuplicate(opponentId: number, rangeLimit: number): number {
    const newId: number = this.getRandomContenderId(rangeLimit);

    if (newId === opponentId) {
      return this.generateNewIdForDuplicate(opponentId, rangeLimit);
    }

    return newId;
  }

  private chooseWinner(firstContender: Contender, secondContender: Contender): number | null {
    if (!firstContender || !secondContender) {
      throw new Error('Unknown error during contenders draw');
    }

    const firstContenderStrength: number = this.getContenderStrength(firstContender);
    const secondContenderStrength: number = this.getContenderStrength(secondContender);

    if (firstContenderStrength === secondContenderStrength) {
      return null;
    }

    const winner: Contender = firstContenderStrength > secondContenderStrength ? firstContender : secondContender;

    return winner.id;
  }

  private resolveGetContenderFn(mode: GameMode): GetContenderFn {
    return mode === GameMode.PEOPLE
      ? this.apiService.getPerson$.bind(this.apiService)
      : this.apiService.getStarship$.bind(this.apiService);
  }

  private getContenderStrength(contender: Contender): number {
    if (!contender) {
      throw new Error('At this point contender should be known!');
    }

    if ('mass' in contender) {
      return contender.mass;
    }
    if ('crew' in contender) {
      return contender.crew;
    }

    throw new Error('Cannot assert the winner, unknown contender type!');
  }
}
