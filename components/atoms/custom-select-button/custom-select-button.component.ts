import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SelectButtonValues } from "../../../models/time-slot.model copy";

@Component({
  selector: "app-custom-select-button",
  templateUrl: "./custom-select-button.component.html",
  styleUrl: "./custom-select-button.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectButtonComponent),
      multi: true,
    },
  ],
})
export class CustomSelectButtonComponent {
  @Input() options: any[] = []; // Opzioni disponibili
  @Input() ngModel: SelectButtonValues = {
    value: "",
    imgSrc: "",
  }; // Valore selezionato
  @Input() optionLabel: string = "icon"; // Quale proprietà mostrare
  @Output() ngModelChange = new EventEmitter<any>(); // Per two-way binding

  selectedValue: string = "";
  // Metodi richiesti da ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: string): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleChange(event: any) {
    if (event) {
      this.selectedValue = event.value;
      this.onChange(this.selectedValue);
      this.ngModelChange.emit(this.selectedValue);
    }
  }
}
