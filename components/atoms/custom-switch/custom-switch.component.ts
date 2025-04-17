import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

@Component({
  selector: "app-custom-switch",
  templateUrl: "./custom-switch.component.html",
  styleUrl: "./custom-switch.component.scss",
})
export class CustomSwitchComponent {
  @Input() label: string = ""; // Etichetta da visualizzare accanto al switch
  @Input() ngModel: boolean = false; // Stato del switch (true/false)
  @Output() ngModelChange = new EventEmitter<boolean>(); // Evento per il cambio di stato
  @Output() onChange = new EventEmitter<any>(); // Evento onChange

  private onChangeFn: any = () => {}; // Funzione di callback per onChange
  private onTouchedFn: any = () => {}; // Funzione di callback per onTouched

  writeValue(value: boolean): void {
    // Quando il valore cambia, aggiorna il modello
    if (value !== undefined) {
      this.ngModel = value;
    }
  }

  registerOnChange(fn: any): void {
    // Registra la funzione di callback per il cambiamento del valore
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    // Registra la funzione di callback quando il controllo è toccato
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Abilita o disabilita il componente (opzionale)
    // Puoi aggiungere logica per disabilitare il controllo, se necessario
  }

  handleChange(event: any) {
    this.onChangeFn(this.ngModel); // Propaga il cambiamento di ngModel
    this.onChange.emit(event); // Propaga l'evento onChange
  }
}
