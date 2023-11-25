import { Person } from './person';
import { Starship } from './starship';

export type Contender = Person | Starship | null;
export type ExistingContender = NonNullable<Contender>;
