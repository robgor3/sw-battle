import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BattleService } from './battle.service';
import { PlayerComponent } from './player/player.component';
import { StartBattleButtonComponent } from './start-battle-button/start-battle-button.component';

@Component({
  imports: [CommonModule, PlayerComponent, StartBattleButtonComponent],
  providers: [BattleService],
  standalone: true,
  selector: 'sw-battle-battleground',
  templateUrl: './battleground.component.html',
  styleUrl: './battleground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlegroundComponent {
  constructor(private readonly battleService: BattleService) {}
}
