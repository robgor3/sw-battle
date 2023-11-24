import { Injectable } from '@angular/core';

@Injectable()
export class BattleService {
  constructor() {
    console.log('init BattleService');
  }

  public fight(): void {
    console.log('fight');
  }

  public resetGame(): void {
    console.log('reset game');
  }
}
