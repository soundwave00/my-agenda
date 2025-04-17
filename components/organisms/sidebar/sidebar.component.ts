import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CalendarEvent } from "../../../models/calendar-event.model";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnChanges, OnInit {
  @Input() showDialog = false;
  @Input() mode: "new" | "view" | "edit" | null = null;
  @Input() eventInfo: CalendarEvent | null = null;

  @Output() closeSidebar = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<CalendarEvent>();
  @Output() deleteEvent = new EventEmitter<CalendarEvent>();
  @Output() editEvent = new EventEmitter<CalendarEvent>();

  eventForm = new FormGroup({
    id: new FormControl(""),
    title: new FormControl(""),
    start: new FormControl(""),
    end: new FormControl(""),
    description: new FormControl(""),
    location: new FormControl(""),
    notes: new FormControl(""),
  });

  noteValue: string = "";

  getAlertIcon(alertItem: string): string {
    switch (alertItem) {
      case "Malattie infettive":
        return "../../../../assets/layout/images/suitcase.svg";
      case "Anamnesi":
        return "../../../../assets/layout/images/heart.svg";
      default:
        return "../../../../assets/layout/images/alert-white.svg"; // Icona generica
    }
  }

  getAlertText(alertItem: string): string {
    switch (alertItem) {
      case "Malattie infettive":
        return "Malattie infettive";
      case "Anamnesi":
        return "Anamnesi scaduta";
      default:
        return alertItem; // Usa direttamente il valore se non è specificato
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["eventInfo"] && this.eventInfo) {
      this.eventForm.patchValue(this.eventInfo);

      // Imposta la variabile con il valore di `notes`
      this.noteValue = String(this.eventInfo?.extendedProps?.["notes"] || "");
    }
  }

  ngOnInit(): void {
    console.log(this.eventInfo);
  }

  onSidebarHide() {
    this.closeSidebar.emit();
  }

  handleSave() {
    if (this.eventForm.valid) {
      const updated = this.eventForm.value as CalendarEvent;
      this.saveEvent.emit(updated);
    }
  }

  onDelete() {
    if (this.eventForm.valid) {
      const current = this.eventForm.value as CalendarEvent;
      this.deleteEvent.emit(current);
    }
  }

  onEditClick() {
    if (this.eventForm.valid) {
      const current = this.eventForm.value as CalendarEvent;
      this.editEvent.emit(current);
    }
  }
}
