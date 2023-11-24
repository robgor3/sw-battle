import { GameMetadata } from '../state/api/battle-api.service';
import { Contender } from './contender';
import { GameMode } from './game-mode';

export interface BattleStateModel {
  gameMode: GameMode;
  firstContender: Contender;
  secondContender: Contender;
  result: {
    firstContenderWins: number;
    secondContenderWins: number;
  };
  gameMetadata: GameMetadata;
}
