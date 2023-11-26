import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SetValueFn } from '@sw-battle/shared/models';
import { tap } from 'rxjs';
import { SelectOption } from '../models/select-option';

@Component({
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, NgIf, NgFor, ReactiveFormsModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }],
  selector: 'sw-battle-ui-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> implements OnInit, ControlValueAccessor {
  @Input() public options: SelectOption<T>[] = [];
  @Input() public label: string | null = null;
  @Input() public set disabled(isDisabled: boolean) {
    if (!this.selectControl) {
      return;
    }

    if (isDisabled) {
      this.selectControl.disable();
    } else {
      this.selectControl.enable();
    }
  }

  @Output() public selectionChange: EventEmitter<T> = new EventEmitter<T>();
  protected readonly selectControl: FormControl<T | null> = new FormControl<T | null>(null);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private onChange: SetValueFn<T> | null = null;
  private onTouched: VoidFunction | null = null;

  public ngOnInit(): void {
    this.selectControl.valueChanges
      .pipe(
        tap((value: T | null) => {
          if (value === null) {
            return;
          }

          this.onChange?.(value);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public writeValue(value: T): void {
    this.selectControl.setValue(value);
  }

  public registerOnChange(fn: SetValueFn<T>): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }
}
