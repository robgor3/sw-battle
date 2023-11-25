import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Contender } from '../models/contender';
import { GameMetadata } from '../models/game-metadata';
import { GameMode } from '../models/game-mode';
import { Person } from '../models/person';
import { Starship } from '../models/starship';
import { BattleApiService } from '../state/api/battle-api.service';
import { BattleStore } from '../state/battle-store.service';

export interface GameParams {
  metadata$: Observable<GameMetadata>;
  mode$: Observable<GameMode>;
}

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
          this.store.patchState({ gameMetadata: { maxPeopleId: 0, maxStarshipsId: 0 } });
        },
      }),
    );
  }

  public getPlayers$({ metadata$, mode$ }: GameParams): Observable<[Contender, Contender]> {
    return combineLatest([mode$, metadata$]).pipe(
      switchMap(([mode, metadata]: [GameMode, GameMetadata]) => {
        console.log(mode);

        return mode === GameMode.PEOPLE
          ? this.getPeopleContenders$(metadata.maxPeopleId)
          : this.getStarshipContenders$(metadata.maxStarshipsId);
      }),
    );
  }

  private getPeopleContenders$(rangeLimit: number): Observable<[Contender, Contender]> {
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
            map((anotherContender: Person | null) => [firstContender, anotherContender] as [Contender, Contender]),
          );
        }

        return of([firstContender, secondContender] as [Contender, Contender]);
      }),
    );
  }

  private getStarshipContenders$(rangeLimit: number): Observable<[Contender, Contender]> {
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
            map((anotherContender: Starship | null) => [firstContender, anotherContender] as [Contender, Contender]),
          );
        }

        return of([firstContender, secondContender] as [Contender, Contender]);
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

        return this.apiService.getPerson$(newId);
      }),
    );
  }

  private getStarshipContender$(id: number, opponentId: number, rangeLimit: number): Observable<Starship | null> {
    return this.apiService.getStarship$(id).pipe(
      switchMap((person: Starship | null) => {
        if (!!person) {
          return of(person) as Observable<Starship>;
        }

        const newId: number = this.generateNewIdForDuplicate(opponentId, rangeLimit);

        return this.apiService.getStarship$(newId);
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
}
