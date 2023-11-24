import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Contender } from '../models/contender';

@Component({
  standalone: true,
  imports: [MatCardModule],
  selector: 'sw-battle-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  @Input({ required: true }) public contender: Contender | null = null;
}
