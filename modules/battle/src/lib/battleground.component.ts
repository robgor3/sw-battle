import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, ButtonPrimaryDirective, ButtonWarnDirective } from '@sw-battle/ui';
import { BattleService } from './battle.service';
import { PlayerComponent } from './player/player.component';

@Component({
  imports: [CommonModule, PlayerComponent, ButtonComponent, ButtonPrimaryDirective, ButtonWarnDirective],
  providers: [BattleService],
  standalone: true,
  selector: 'sw-battle-battleground',
  templateUrl: './battleground.component.html',
  styleUrl: './battleground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlegroundComponent {
  constructor(private readonly battleService: BattleService) {}

  public onFightButtonClick(): void {
    this.battleService.fight();
  }

  public onResetButtonClick(): void {
    this.battleService.resetGame();
  }
}
