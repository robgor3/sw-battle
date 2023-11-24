import { Injectable } from '@angular/core';

export interface GameParams {}

export interface GameResult {}

@Injectable()
export class BattleEngineService {
  public play(_: GameParams): GameResult {
    throw new Error('Not implemented yet, called with');
  }
}
