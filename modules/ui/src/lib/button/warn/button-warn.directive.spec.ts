import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../button.component';
import { ButtonWarnDirective } from './button-warn.directive';

@Component({
  standalone: true,
  imports: [ButtonComponent, ButtonWarnDirective],
  selector: 'sw-battle-test',
  template: '<sw-battle-ui-button #button [text]="text" swBattleWarnPrimary></sw-battle-ui-button>',
})
class TestComponent {
  @ViewChild('button') public buttonComponent: ButtonComponent | undefined;
  public text: string = 'text';
}

describe(ButtonWarnDirective, () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, ButtonComponent, ButtonWarnDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should apply warn color for button component', () => {
    const expectedButtonColor: string = 'warn';

    expect(component.buttonComponent?.color).toEqual(expectedButtonColor);
  });
});
