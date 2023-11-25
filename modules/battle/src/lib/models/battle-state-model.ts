import { Contender } from './contender';
import { GameMetadata } from './game-metadata';
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
