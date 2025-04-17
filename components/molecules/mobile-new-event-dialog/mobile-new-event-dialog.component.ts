import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { EventDialogService } from "../../../services/event-dialog.service";
import { CalendarService } from "../../../services/calendar.service";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { MessageService } from "primeng/api";
import { CalendarEventState } from "../../../models/calendar-event-state.model";
import {
  getStateIcon
} from "../../../utils/strings/stringUtils";

@Component({
  selector: "app-mobile-new-event-dialog",
  templateUrl: "./mobile-new-event-dialog.component.html",
  styleUrls: ["./mobile-new-event-dialog.component.scss"],
})
export class MobileNewEventDialogComponent implements OnInit {
  visible: boolean = true;
  currentEvent: CalendarEvent | null = null;
  newEvent: CalendarEvent = {
    title: "",
    start: "",
    end: "",
    extendedProps: {},
  };

  // Form fields
  patientName: string = "";
  contactInfo: string = "";
  selectedChair: any = null;
  selectedDoctor: any = null;
  selectedDate: Date | null = null;
  selectedStartTime: any = null;
  selectedEndTime: any = null;
  additionalService: string = "";
  treatmentDetails: string = "";
  notes: string = "";

  timeSlots: any[] = [];

  // Mock data for dropdowns
  doctors = [
    { name: "Mario Rossi", code: "DR001" },
    { name: "Anna Bianchi", code: "DMB002" },
    { name: "Dott. Luigi Verdi", code: "DLV003" },
  ];

  chairs = [
    { name: "Chirurgia blu", code: "P001" },
    { name: "Poltrona 2", code: "P002" },
    { name: "Poltrona 3", code: "P003" },
  ];

  statuses = Object.keys(CalendarEventState)
    .filter((key) => isNaN(Number(key)))
    .map((key) => {
      let label: string;

      if (key === "NonPresentatoNonArrivato") {
        label = "Non Presentato/Non Arrivato";
      } else {
        label = key.replace(/([A-Z])/g, " $1").trim();
      }

      return {
        label: label,
        value: CalendarEventState[key as keyof typeof CalendarEventState],
        icon: getStateIcon(CalendarEventState[key as keyof typeof CalendarEventState])
      };
    })
  selectedStatus = this.statuses[0];

  moreDetails: boolean = false

  constructor(
    private eventDialogService: EventDialogService,
    private calendarService: CalendarService,
    private messageService: MessageService
  ) {
    this.moreDetails = false
  }

  ngOnInit(): void {
    this.moreDetails = false
    this.eventDialogService.showModalNew$.subscribe((show) => {
      this.visible = show;
    });

    this.eventDialogService.currentEvent$.subscribe((event) => {
      if (event) {
        this.currentEvent = event;
        this.initializeFormData();
      }
    });

    // Generate time slots from 7:00 to 20:00
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute of ["00", "15", "30", "45"]) {
        const timeValue = `${hour.toString().padStart(2, "0")}:${minute}`;
        this.timeSlots.push({ label: timeValue, value: timeValue });
      }
    }
  }

  initializeFormData(): void {
    if (this.currentEvent) {
      // Reset form
      this.patientName = "";
      this.contactInfo = "";
      this.selectedChair = "";
      this.selectedDoctor = "";
      this.selectedStatus = this.statuses[0];
      this.treatmentDetails = "";
      this.notes = "";

      // Initialize date and time
      if (this.currentEvent.start) {
        this.selectedDate = new Date(this.currentEvent.start);

        // Format start time
        const startTime = this.selectedDate.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        });
        this.selectedStartTime =
          this.timeSlots.find((t) => t.label === startTime) ||
          this.timeSlots[4]; // Default to 8:00

        if (this.currentEvent.end) {
          const endDate = new Date(this.currentEvent.end);
          const endTime = endDate.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          });
          this.selectedEndTime =
            this.timeSlots.find((t) => t.label === endTime) ||
            this.timeSlots[8]; // Default to 9:00
        } else {
          // Default end time to 1 hour after start time
          this.selectedEndTime =
            this.timeSlots[
            this.timeSlots.indexOf(this.selectedStartTime) + 4
            ] || this.timeSlots[8];
        }
      } else {
        // Default to today
        this.selectedDate = new Date();
        this.selectedStartTime = this.timeSlots[4]; // 8:00
        this.selectedEndTime = this.timeSlots[8]; // 9:00
      }
    }
  }

  updateEventDates(): void {
    if (!this.selectedDate || !this.selectedStartTime || !this.selectedEndTime)
      return;

    // Create the start date
    const startDate = new Date(this.selectedDate);
    const [startHours, startMinutes] = this.selectedStartTime.label
      .split(":")
      .map(Number);
    startDate.setHours(startHours, startMinutes, 0);

    // Create the end date
    const endDate = new Date(this.selectedDate);
    const [endHours, endMinutes] = this.selectedEndTime.label
      .split(":")
      .map(Number);
    endDate.setHours(endHours, endMinutes, 0);

    // Update the event
    this.newEvent.start = startDate.toISOString();
    this.newEvent.end = endDate.toISOString();
  }

  private updateNewEvent() {
    // Update dates
    this.updateEventDates();

    // Set event properties
    this.newEvent.title = this.patientName;
    if (!this.newEvent.extendedProps) {
      this.newEvent.extendedProps = {};
    }

    this.newEvent.extendedProps.patientName = this.patientName;
    this.newEvent.extendedProps.phoneNumber = this.contactInfo;

    if (this.selectedDoctor) {
      this.newEvent.extendedProps.doctor = this.selectedDoctor.name;
    }

    if (this.selectedChair) {
      this.newEvent.extendedProps.clinic = this.selectedChair.name;
      this.newEvent.extendedProps.serviceName = this.selectedChair.name;
    }

    if (this.selectedStatus) {
      this.newEvent.extendedProps.states = this.selectedStatus.value;
    }

    // Add additional service if provided
    if (this.additionalService) {
      if (!this.newEvent.extendedProps.additionalServices) {
        this.newEvent.extendedProps.additionalServices = [];
      }
      this.newEvent.extendedProps.additionalServices.push({
        name: this.additionalService,
        description: "",
      });
    }

    if (this.treatmentDetails) {
      this.newEvent.extendedProps.serviceName = this.treatmentDetails;
    }

    if (this.notes) {
      this.newEvent.description = this.notes;
    }

    // Add default properties
    this.newEvent.extendedProps["backgroundColor"] = "#5C8725";
    this.newEvent.extendedProps.alert = ["Anamnesi"];
  }

  saveEvent(): void {
    if (!this.validateForm()) {
      return;
    }

    this.updateNewEvent()

    // Create the event
    this.calendarService.createEvent(this.newEvent).subscribe(
      (createdEvent) => {
        this.messageService.add({
          severity: "success",
          summary: "Successo",
          detail: "Appuntamento creato con successo",
        });

        this.eventDialogService.notifyEventCreated(createdEvent);
        this.closeDialog();
      },
      (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Errore",
          detail:
            "Si è verificato un errore durante la creazione dell'appuntamento",
        });
      }
    );
  }

  validateForm(): boolean {
    if (!this.selectedDate) {
      this.messageService.add({
        severity: "warn",
        summary: "Attenzione",
        detail: "Seleziona una data",
      });
      return false;
    }

    if (!this.selectedStartTime || !this.selectedEndTime) {
      this.messageService.add({
        severity: "warn",
        summary: "Attenzione",
        detail: "Seleziona orario di inizio e fine",
      });
      return false;
    }

    return true;
  }

  closeDialog(): void {
    this.eventDialogService.closeNewEventDialog();
  }

  /**
   * Quando clicchi "Più Dettagli":
   * passiamo in modalità "view".
   */
  OnDetailsClick(): void {
    this.updateNewEvent()
    this.moreDetails = true
  }

  backToBaseDialog(): void {
    this.updateNewEvent()
    this.moreDetails = false
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

  updateStatus(event: any) {
    this.selectedStatus = event
  }
}
