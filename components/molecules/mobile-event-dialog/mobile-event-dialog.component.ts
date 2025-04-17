import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { EventDialogService } from "../../../services/event-dialog.service";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { CalendarEventState } from "../../../models/calendar-event-state.model";
import {
  getStateIcon
} from "../../../utils/strings/stringUtils";

@Component({
  selector: "app-mobile-event-dialog",
  templateUrl: "./mobile-event-dialog.component.html",
  styleUrls: ["./mobile-event-dialog.component.scss"],
})
export class MobileEventDialogComponent implements OnInit {
  visible: boolean = false;
  currentEvent: CalendarEvent | null = null;

  // Form fields
  patientName: string = "";
  phoneNumber: string = "";
  selectedChair: any = null;
  selectedDoctor: any = null;
  selectedDate: Date | null = null;
  selectedStartTime: any = null;
  selectedEndTime: any = null;
  treatmentDetails: string = "";

  editedEvent: CalendarEvent | null = null;
  timeSlots: any[] = [];
  @Output() eventUpdated = new EventEmitter<CalendarEvent>();

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

  constructor(private eventDialogService: EventDialogService) { }

  ngOnInit(): void {
    this.eventDialogService.showModalView$.subscribe((show) => {
      this.visible = show;
    });

    this.eventDialogService.currentEvent$.subscribe((event) => {
      if (event) {
        this.currentEvent = event;
        this.generateTimeSlots();
        this.initializeFormData();
      }
    });
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
      this.patientName = this.currentEvent.extendedProps?.patientName || "";

      this.phoneNumber = this.currentEvent.extendedProps?.phoneNumber || "";

      this.treatmentDetails =
        this.currentEvent.extendedProps?.serviceName || "";

      const doctorName = this.currentEvent.extendedProps?.doctor || "";
      this.selectedDoctor =
        this.doctors.find((d) => d.name === doctorName) || null;

      const chairName = this.currentEvent.extendedProps?.clinic || "";
      this.selectedChair =
        this.chairs.find((c) => c.name === chairName) || null;

      const stateValue = this.currentEvent.extendedProps?.states || 1;
      this.selectedStatus =
        this.statuses.find((s) => s.value === stateValue) || this.statuses[0];

      if (this.currentEvent.start) {
        this.selectedDate = new Date(this.currentEvent.start);

        const startTime = this.selectedDate.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        });
        this.selectedStartTime =
          this.timeSlots.find((t) => t.label === startTime) || null;

        if (this.currentEvent.end) {
          const endDate = new Date(this.currentEvent.end);
          const endTime = endDate.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          });
          this.selectedEndTime =
            this.timeSlots.find((t) => t.label === endTime) || null;
        }
      }
    }
  }

  updateEventDates(): void {
    if (!this.selectedDate || !this.selectedStartTime || !this.selectedEndTime)
      return;

    if (!this.editedEvent && this.currentEvent) {
      this.editedEvent = { ...this.currentEvent };
      if (this.currentEvent.extendedProps) {
        this.editedEvent.extendedProps = { ...this.currentEvent.extendedProps };
      } else {
        this.editedEvent.extendedProps = {};
      }
    }

    if (this.editedEvent) {
      const startDate = new Date(this.selectedDate);
      const [startHours, startMinutes] = this.selectedStartTime.label
        .split(":")
        .map(Number);
      startDate.setHours(startHours, startMinutes, 0);

      const endDate = new Date(this.selectedDate);
      const [endHours, endMinutes] = this.selectedEndTime.label
        .split(":")
        .map(Number);
      endDate.setHours(endHours, endMinutes, 0);

      this.editedEvent.start = startDate.toISOString();
      this.editedEvent.end = endDate.toISOString();
    }
  }

  saveEvent(): void {
    if (!this.editedEvent && this.currentEvent) {
      this.editedEvent = { ...this.currentEvent };
      if (this.currentEvent.extendedProps) {
        this.editedEvent.extendedProps = { ...this.currentEvent.extendedProps };
      } else {
        this.editedEvent.extendedProps = {};
      }
    }

    if (this.editedEvent && this.editedEvent.extendedProps) {
      this.editedEvent.extendedProps.patientName = this.patientName;
      this.editedEvent.extendedProps.phoneNumber = this.phoneNumber;
      this.editedEvent.extendedProps.serviceName = this.treatmentDetails;

      if (this.selectedDoctor) {
        this.editedEvent.extendedProps.doctor = this.selectedDoctor.name;
      }

      if (this.selectedChair) {
        this.editedEvent.extendedProps.clinic = this.selectedChair.name;
      }

      if (this.selectedStatus) {
        this.editedEvent.extendedProps.states = this.selectedStatus.value;
      }

      this.updateEventDates();

      this.eventUpdated.emit(this.editedEvent);
    }

    this.closeDialog();
  }

  closeDialog(): void {
    this.eventDialogService.closeViewEventDialog();
  }

  updateStatus(event: any) {
    this.selectedStatus = event
  }
}
