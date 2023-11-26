import { Injectable } from '@angular/core';
import { ApiResponse, ApiResponseStatus } from '@sw-battle/shared/models';
import { Person } from '../../models/person';
import { PersonApi } from '../../models/person-api';
import { Starship } from '../../models/starship';
import { StarshipApi } from '../../models/starship-api';

@Injectable()
export class BattleAdapterService {
  public adaptPerson(response: ApiResponse<PersonApi>): Person | null {
    if (response.message === ApiResponseStatus.NOT_FOUND || !response.result?.properties) {
      return null;
    }

    const personProps: PersonApi = response.result.properties;

    return { id: +response.result.uid, name: personProps.name, mass: this.resolveBattleParam(personProps.mass) };
  }

  public adaptStarship(response: ApiResponse<StarshipApi>): Starship | null {
    if (response.message === ApiResponseStatus.NOT_FOUND || !response.result?.properties) {
      return null;
    }

    const starshipProps: StarshipApi = response.result.properties;

    return { id: +response.result.uid, name: starshipProps.name, crew: this.resolveBattleParam(starshipProps.crew) };
  }

  private resolveBattleParam(input: string): number {
    const param: number = +input;

    return isNaN(param) ? 0 : Math.floor(param);
  }
}
