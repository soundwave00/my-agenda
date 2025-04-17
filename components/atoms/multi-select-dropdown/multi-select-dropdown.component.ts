import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from "@angular/core";
import { DropdownOption } from "../../../models/multiselect-dropdown.model";

@Component({
  selector: "app-multi-select-dropdown",
  templateUrl: "./multi-select-dropdown.component.html",
  styleUrl: "./multi-select-dropdown.component.scss",
})
export class MultiSelectDropdownComponent {
  @Input() options: DropdownOption[] = []; // Opzioni passate come prop
  @Input() label: string = "Seleziona";
  selectedOptions: DropdownOption[] = [];
  @Output() selectedOptionsChange = new EventEmitter<DropdownOption[]>(); // Comunica al padre
  isOpen = false;

  constructor(private eRef: ElementRef) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: DropdownOption) {
    if (!this.selectedOptions.includes(option)) {
      this.selectedOptions.push(option);
      this.selectedOptionsChange.emit(this.selectedOptions);
    }
  }

  removeOption(option: DropdownOption) {
    this.selectedOptions = this.selectedOptions.filter((o) => o !== option);
    this.selectedOptionsChange.emit(this.selectedOptions); // Notifica il padre
  }

  isSelected(option: DropdownOption): boolean {
    return this.selectedOptions.includes(option);
  }

  // Chiude il dropdown quando si clicca fuori
  @HostListener("document:click", ["$event"])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
