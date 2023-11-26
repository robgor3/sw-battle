import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Contender, ExistingContender } from '../models/contender';
import { GameMetadata } from '../models/game-metadata';
import { GameMode } from '../models/game-mode';
import { GameParams } from '../models/game-params';
import { GameResult } from '../models/game-result';
import { Person } from '../models/person';
import { Starship } from '../models/starship';
import { BattleApiService } from '../state/api/battle-api.service';
import { BattleStore } from '../state/battle-store.service';
import { getDefaultBattleState } from '../state/get-default-battle-state';

type GetPlayerFn = (id: number) => Observable<Contender>;

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
      switchMap(([mode, metadata]: [GameMode, GameMetadata]) =>
        mode === GameMode.PEOPLE
          ? this.getPeopleContenders$(metadata.maxPeopleId)
          : this.getStarshipContenders$(metadata.maxStarshipsId),
      ),
      map(([firstContender, secondContender]: [ExistingContender, ExistingContender]) => ({
        winnerId: this.chooseWinner(firstContender, secondContender),
        firstContender,
        secondContender,
      })),
    );
  }

  private getPeopleContenders$(rangeLimit: number): Observable<[ExistingContender, ExistingContender]> {
    const [firstContenderId, secondContenderId]: [number, number] = this.getContendersIds(rangeLimit);

    const firstContender$: Observable<Person> = this.getPersonContender$(
      firstContenderId,
      secondContenderId,
      rangeLimit,
    ) as Observable<Person>;

    const secondContender$: Observable<Person> = this.getPersonContender$(
      secondContenderId,
      firstContenderId,
      rangeLimit,
    ) as Observable<Person>;

    return forkJoin([firstContender$, secondContender$]).pipe(
      switchMap(([firstContender, secondContender]: [Person | null, Person | null]) => {
        if (firstContender?.name === secondContender?.name) {
          return this.getPersonContender$(secondContenderId, firstContenderId, rangeLimit).pipe(
            map(
              (anotherContender: Person | null) =>
                [firstContender, anotherContender] as [ExistingContender, ExistingContender],
            ),
          );
        }

        return of([firstContender, secondContender] as [ExistingContender, ExistingContender]);
      }),
    );
  }

  private getStarshipContenders$(rangeLimit: number): Observable<[ExistingContender, ExistingContender]> {
    const [firstContenderId, secondContenderId]: [number, number] = this.getContendersIds(rangeLimit);

    const firstContender$: Observable<Starship> = this.getStarshipContender$(
      firstContenderId,
      secondContenderId,
      rangeLimit,
    ) as Observable<Starship>;

    const secondContender$: Observable<Starship> = this.getStarshipContender$(
      secondContenderId,
      firstContenderId,
      rangeLimit,
    ) as Observable<Starship>;

    return forkJoin([firstContender$, secondContender$]).pipe(
      switchMap(([firstContender, secondContender]: [Starship | null, Starship | null]) => {
        if (firstContender?.name === secondContender?.name) {
          return this.getStarshipContender$(secondContenderId, firstContenderId, rangeLimit).pipe(
            map(
              (anotherContender: Starship | null) =>
                [firstContender, anotherContender] as [ExistingContender, ExistingContender],
            ),
          );
        }

        return of([firstContender, secondContender] as [ExistingContender, ExistingContender]);
      }),
    );
  }

  private getPersonContender$(id: number, opponentId: number, rangeLimit: number): Observable<Person | null> {
    return this.apiService.getPerson$(id).pipe(
      switchMap((person: Person | null) => {
        if (!!person) {
          return of(person) as Observable<Person>;
        }

        const newId: number = this.generateNewIdForDuplicate(opponentId, rangeLimit);

        return this.getPersonContender$(newId, opponentId, rangeLimit);
      }),
    );
  }

  private getStarshipContender$(id: number, opponentId: number, rangeLimit: number): Observable<Starship | null> {
    return this.apiService.getStarship$(id).pipe(
      switchMap((starship: Starship | null) => {
        if (!!starship) {
          return of(starship) as Observable<Starship>;
        }

        const newId: number = this.generateNewIdForDuplicate(opponentId, rangeLimit);

        return this.getStarshipContender$(newId, opponentId, rangeLimit);
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

  private chooseWinner(firstContender: Contender, secondContender: Contender): number {
    if (!firstContender || !secondContender) {
      throw new Error('Unknown error during contenders draw');
    }

    if ('mass' in firstContender && 'mass' in secondContender) {
      const winner: Contender = firstContender.mass > secondContender.mass ? firstContender : secondContender;
      return winner.id;
    }
    if ('crew' in firstContender && 'crew' in secondContender) {
      const winner: Contender = firstContender.crew > secondContender.crew ? firstContender : secondContender;
      return winner.id;
    }

    throw new Error('Unknown contender type');
  }

  private getPlayerMethod(mode: GameMode): GetPlayerFn {
    return mode === GameMode.PEOPLE ? this.apiService.getPerson$ : this.apiService.getStarship$;
  }
}
