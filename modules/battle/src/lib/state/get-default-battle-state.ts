import { BattleStateModel } from '../models/battle-state-model';
import { GameMode } from '../models/game-mode';

const DEFAULT_BATTLE_STATE_MODEL: BattleStateModel = {
  gameMode: GameMode.PEOPLE,
  firstContender: null,
  secondContender: null,
  currentWinnerId: null,
  firstContenderWinsCount: 0,
  secondContenderWinsCount: 0,
  isFightInProgress: false,
  gameMetadata: {
    maxPeopleId: 0,
    maxStarshipsId: 0,
  },
};

export function getDefaultBattleState(): BattleStateModel {
  return DEFAULT_BATTLE_STATE_MODEL;
}
