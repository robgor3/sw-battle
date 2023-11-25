import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaginationPayload, ApiPaginationResponse, ApiResponse } from '@sw-battle/shared/models';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { GameMetadata } from '../../models/game-metadata';
import { Person } from '../../models/person';
import { PersonApi } from '../../models/person-api';
import { Starship } from '../../models/starship';
import { StarshipApi } from '../../models/starship-api';
import { BattleAdapterService } from './battle-adapter.service';

@Injectable()
export class BattleApiService {
  constructor(private readonly http: HttpClient, private readonly battleAdapterService: BattleAdapterService) {}

  public getGameMetadata$(): Observable<GameMetadata> {
    const peopleMetadata: Observable<number> = this.getHighestIdFromResource$('people');
    const starshipsMetadata: Observable<number> = this.getHighestIdFromResource$('starships');

    return forkJoin([peopleMetadata, starshipsMetadata]).pipe(
      map(([maxPeopleId, maxStarshipsId]: [number, number]) => ({
        maxPeopleId,
        maxStarshipsId,
      })),
    );
  }

  public getPerson$(id: number): Observable<Person | null> {
    return this.http.get<ApiResponse<PersonApi>>(`people/${id}`).pipe(
      map((response: ApiResponse<PersonApi>) => this.battleAdapterService.adaptPerson(response)),
      catchError(() => of(null)),
    );
  }

  public getStarship$(id: number): Observable<Starship | null> {
    return this.http.get<ApiResponse<StarshipApi>>(`starships/${id}`).pipe(
      map((response: ApiResponse<StarshipApi>) => this.battleAdapterService.adaptStarship(response)),
      catchError(() => of(null)),
    );
  }

  private getHighestIdFromResource$(resourceUrl: string): Observable<number> {
    return this.http.get<ApiPaginationResponse>(resourceUrl).pipe(
      switchMap((response: ApiPaginationResponse) => {
        const totalRecordsCount: number = response.total_records;

        return this.http.get<ApiPaginationResponse>(`${resourceUrl}?page=1&limit=${totalRecordsCount}`).pipe(
          map((response: ApiPaginationResponse) => {
            const lastRecord: ApiPaginationPayload = response.results[totalRecordsCount - 1];

            return +lastRecord.uid;
          }),
        );
      }),
    );
  }
}
