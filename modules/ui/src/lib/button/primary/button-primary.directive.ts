import { Directive, OnInit } from '@angular/core';
import { ButtonComponent } from '../button.component';

@Directive({
  standalone: true,
  selector: 'sw-battle-ui-button[swBattleButtonPrimary]',
})
export class ButtonPrimaryDirective implements OnInit {
  private readonly color: string = 'primary';

  constructor(private readonly buttonComponent: ButtonComponent) {}

  public ngOnInit(): void {
    this.buttonComponent.color = this.color;
  }
}
