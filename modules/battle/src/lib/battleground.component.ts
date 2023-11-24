import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, ButtonPrimaryDirective, ButtonWarnDirective } from '@sw-battle/ui';
import { Observable } from 'rxjs';
import { BattleService } from './battle.service';
import { Contender } from './models/contender';
import { GameMode } from './models/game-mode';
import { PlayerComponent } from './player/player.component';
import { BattleAdapterService } from './state/api/battle-adapter.service';
import { BattleApiService } from './state/api/battle-api.service';
import { BattleState } from './state/battle.state';

@Component({
  imports: [CommonModule, PlayerComponent, ButtonComponent, ButtonPrimaryDirective, ButtonWarnDirective],
  providers: [BattleService, BattleState, BattleApiService, BattleAdapterService],
  standalone: true,
  selector: 'sw-battle-battleground',
  templateUrl: './battleground.component.html',
  styleUrl: './battleground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlegroundComponent {
  public readonly firstContender$: Observable<Contender> = this.battleService.firstContender$;
  public readonly secondContender$: Observable<Contender> = this.battleService.secondContender$;
  public readonly gameMode$: Observable<GameMode> = this.battleService.gameMode$;

  constructor(private readonly battleService: BattleService) {
    this.battleService.init();
  }

  public onFightButtonClick(): void {
    this.battleService.fight();
  }

  public onResetButtonClick(): void {
    this.battleService.resetGame();
  }
}
