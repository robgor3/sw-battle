import { Directive, OnInit } from '@angular/core';
import { ButtonComponent } from '../button.component';

@Directive({
  standalone: true,
  selector: 'sw-battle-ui-button[swBattleWarnPrimary]',
})
export class ButtonWarnDirective implements OnInit {
  private readonly color: string = 'warn';

  constructor(private readonly buttonComponent: ButtonComponent) {}

  public ngOnInit(): void {
    this.buttonComponent.color = this.color;
  }
}
