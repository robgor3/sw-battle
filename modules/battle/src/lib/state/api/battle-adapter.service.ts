import { Injectable } from '@angular/core';
import { Person } from '../../models/person';
import { PersonApi } from '../../models/person-api';
import { Starship } from '../../models/starship';
import { StarshipApi } from '../../models/starship-api';

@Injectable()
export class BattleAdapterService {
  public adaptPerson(person: PersonApi): Person {
    return { ...person };
  }

  public adaptStarship(starship: StarshipApi): Starship {
    return { ...starship };
  }
}
