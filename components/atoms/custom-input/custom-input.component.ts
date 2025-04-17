import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-custom-input",
  templateUrl: "./custom-input.component.html",
  styleUrls: ["./custom-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() id: string = "";
  @Input() name: string = "";
  @Input() styleClass: string = "";
  @Input() placeholder: string = "";
  @Input() isImage: boolean = false;
  @Input() icon: string = "";

  @Output() onChangeEvent: EventEmitter<string> = new EventEmitter<string>();

  inputValue: string = "";

  // Definizione dei tipi per le funzioni
  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: string): void {
    this.inputValue = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleChange(event: Event | null): void {
    this.inputValue = ""
    if (event != null) {
      const input = event.target as HTMLInputElement;
      this.inputValue = input.value;
    }
    this.onChange(this.inputValue);
    this.onChangeEvent.emit(this.inputValue);
  }
}
