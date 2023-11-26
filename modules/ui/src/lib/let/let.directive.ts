import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LetContext } from '../models/let-context';

@Directive({
  standalone: true,
  selector: '[swBattleLet]',
})
export class LetDirective<T> {
  private _context: LetContext<T> = { swBattleLet: null };

  constructor(_viewContainer: ViewContainerRef, _templateRef: TemplateRef<LetContext<T>>) {
    _viewContainer.createEmbeddedView(_templateRef, this._context);
  }

  @Input() public set swBattleLet(value: T) {
    this._context.swBattleLet = value;
  }
}
