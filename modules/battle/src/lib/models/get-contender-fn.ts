import { Observable } from 'rxjs';
import { Contender } from './contender';

export type GetContenderFn = (id: number) => Observable<Contender>;
