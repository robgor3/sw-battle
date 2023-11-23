import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  selector: 'sw-battle-start-battle-button',
  templateUrl: './start-battle-button.component.html',
  styleUrl: './start-battle-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartBattleButtonComponent {
  @Output() public startBattle: EventEmitter<void> = new EventEmitter<void>();

  public onClick(): void {
    this.startBattle.emit();
  }
}
