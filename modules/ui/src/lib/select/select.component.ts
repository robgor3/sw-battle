import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { GameMode } from '@sw-battle/battle';

@Component({
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule],
  selector: 'sw-battle-ui-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO implement CVA
export class SelectComponent<T> {
  @Output() public selectionChange: EventEmitter<T> = new EventEmitter<T>();
  protected readonly GameMode: typeof GameMode = GameMode;

  public changeGameMode(mode: MatSelectChange) {
    this.selectionChange.emit(mode.value as T);
  }
}
