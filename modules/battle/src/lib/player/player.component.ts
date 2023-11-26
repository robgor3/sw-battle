import { NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Contender, ExistingContender } from '../models/contender';
import { Person } from '../models/person';

@Component({
  standalone: true,
  imports: [MatCardModule, TitleCasePipe, NgIf],
  selector: 'sw-battle-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  @Input({ required: true }) public set contender(value: Contender | null) {
    this.player = value;
    this.isPersonPlayer = !!this.player ? this.isContenderPerson(this.player) : null;
    this.paramName = this.resolveParamName(this.isPersonPlayer);
    this.strength = this.resolveContenderStrength(this.player);
  }
  @Input({ required: true }) public winsCount: number | null = null;
  @Input({ required: true }) public winnerId: number | null = null;
  protected player: Contender | null = null;
  protected paramName: string | null = null;
  protected isPersonPlayer: boolean | null = null;
  protected strength: number | null = null;
  protected readonly personParamName: string = 'mass';
  protected readonly starshipParamName: string = 'crew';

  private resolveParamName(isPersonPlayer: boolean | null): string | null {
    const isPlayerKindDefined: boolean = typeof isPersonPlayer === 'boolean';

    if (!isPlayerKindDefined) {
      return null;
    }

    return isPersonPlayer ? this.personParamName : this.starshipParamName;
  }

  private resolveContenderStrength(contender: Contender): number | null {
    if (!contender) {
      return null;
    }

    return this.isContenderPerson(contender) ? contender.mass : contender.crew;
  }

  private isContenderPerson(contender: ExistingContender): contender is Person {
    return 'mass' in contender;
  }
}
