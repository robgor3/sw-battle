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

    return { name: personProps.name, mass: +personProps.mass };
  }

  public adaptStarship(response: ApiResponse<StarshipApi>): Starship | null {
    if (response.message === ApiResponseStatus.NOT_FOUND || !response.result?.properties) {
      return null;
    }

    const personProps: StarshipApi = response.result.properties;

    return { name: personProps.name, crew: +personProps.crew };
  }
}
