import { Observable } from 'rxjs';
import { GameMetadata } from './game-metadata';
import { GameMode } from './game-mode';

export interface GameParams {
  metadata$: Observable<GameMetadata>;
  mode$: Observable<GameMode>;
}
