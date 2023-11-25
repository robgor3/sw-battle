import { BattleStateModel } from '../models/battle-state-model';
import { GameMode } from '../models/game-mode';

const DEFAULT_BATTLE_STATE_MODEL: BattleStateModel = {
  gameMode: GameMode.PEOPLE,
  firstContender: null,
  secondContender: null,
  result: {
    firstContenderWins: 0,
    secondContenderWins: 0,
  },
  gameMetadata: {
    totalPeopleCount: 0,
    totalStarshipsCount: 0,
  },
};

export function getDefaultBattleState(): BattleStateModel {
  return DEFAULT_BATTLE_STATE_MODEL;
}
