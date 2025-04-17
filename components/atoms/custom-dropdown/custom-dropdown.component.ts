import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-custom-dropdown",
  templateUrl: "./custom-dropdown.component.html",
  styleUrls: ["./custom-dropdown.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true,
    },
  ],
})
export class CustomDropdownComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() optionLabel: string = "";
  @Input() styleClass: string = "";
  @Input() placeholder: string = "";
  @Input() isImage: boolean = false;
  @Input() isTextOnly: boolean = false;
  @Input() icon: string = "";
  @Input() addDropdownBoxClass: boolean = false;
  @Output() valueChanged = new EventEmitter<any>();

  value: any = null;
  isDisabled: boolean = false;

  private onChangeFn: (value: any) => void = () => { };
  private onTouchedFn: () => void = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  handleChange(event: any): void {
    this.value = event.value;

    this.onChangeFn(this.value);
    this.onTouchedFn();
    this.valueChanged.emit(this.value);
  }
}
