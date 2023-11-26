import { Contender } from './contender';
import { GameMetadata } from './game-metadata';
import { GameMode } from './game-mode';

export interface BattleStateModel {
  gameMode: GameMode;
  firstContender: Contender;
  secondContender: Contender;
  currentWinnerId: number | null;
  firstContenderWinsCount: number;
  secondContenderWinsCount: number;
  gameMetadata: GameMetadata;
  isFightInProgress: boolean;
}
