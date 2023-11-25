import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaginationResponse, ApiResponse } from '@sw-battle/shared/models';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
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
    const peopleMetadata = this.http
      .get<ApiPaginationResponse>('people')
      .pipe(map((response: ApiPaginationResponse) => response.total_records));

    const starshipsMetadata = this.http
      .get<ApiPaginationResponse>('starships')
      .pipe(map((response: ApiPaginationResponse) => response.total_records));

    return forkJoin([peopleMetadata, starshipsMetadata]).pipe(
      map(([totalPeopleCount, totalStarshipsCount]: [number, number]) => ({
        totalPeopleCount,
        totalStarshipsCount,
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
}
