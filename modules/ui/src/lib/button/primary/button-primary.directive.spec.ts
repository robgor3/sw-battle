import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../button.component';
import { ButtonPrimaryDirective } from './button-primary.directive';

@Component({
  standalone: true,
  imports: [ButtonComponent, ButtonPrimaryDirective],
  selector: 'sw-battle-test',
  template: '<sw-battle-ui-button #button [text]="text" swBattleButtonPrimary></sw-battle-ui-button>',
})
class TestComponent {
  @ViewChild('button') public buttonComponent: ButtonComponent | undefined;
  public text: string = 'text';
}

describe(ButtonPrimaryDirective, () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, ButtonComponent, ButtonPrimaryDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should apply primary color for button component', () => {
    const expectedButtonColor: string = 'primary';

    expect(component.buttonComponent?.color).toEqual(expectedButtonColor);
  });
});
