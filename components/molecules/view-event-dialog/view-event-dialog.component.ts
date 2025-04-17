import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { EventDialogService } from "../../../services/event-dialog.service";
import { CalendarService } from "../../../services/calendar.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { Dialog } from "primeng/dialog";
import { CalendarOptions } from "@fullcalendar/core";
import { calendarOptions } from "../../../models/calendar-options";
import { getStateIcon } from "../../../utils/strings/stringUtils";

interface TimeSlot {
  label: string;
  value: string;
}

interface Doctor {
  name: string;
  id: string;
}

interface Chair {
  name: string;
  code: string;
}

interface StatusOption {
  label: string;
  value: number;
  icon: string;
}

@Component({
  selector: "app-view-event-dialog",
  templateUrl: "./view-event-dialog.component.html",
  styleUrl: "./view-event-dialog.component.scss",
})
export class ViewEventDialogComponent implements OnInit {
  @ViewChild("dialog") dialog!: Dialog;
  showModalView: boolean = false;
  currentEvent: CalendarEvent | null = null;
  calendarOptions: CalendarOptions = calendarOptions;
  isMaximized: boolean = false;
  editedEvent: CalendarEvent = {} as CalendarEvent;
  window = window;

  // For edit form
  selectedDate: Date = new Date();
  selectedStartTime: TimeSlot | null = null;
  selectedEndTime: TimeSlot | null = null;
  timeSlots: TimeSlot[] = [];

  doctors: Doctor[] = [
    { name: "Mario Rossi", id: "1" },
    { name: "Anna Bianchi", id: "2" },
    { name: "Luca Verdi", id: "3" },
    { name: "Giulia Neri", id: "4" },
  ];
  selectedDoctor: Doctor | null = null;

  // Status options
  statusOptions: StatusOption[] = [
    { label: "Arrivato", value: 3, icon: getStateIcon(3) },
    { label: "In attesa", value: 6, icon: getStateIcon(6) },
    { label: "Completato", value: 7, icon: getStateIcon(7) },
    { label: "Annullato", value: 5, icon: getStateIcon(5) },
  ];
  selectedStatus: StatusOption = this.statusOptions[0];

  chairs: Chair[] = [
    { name: "Poltrona 1", code: "P001" },
    { name: "Poltrona 2", code: "P002" },
    { name: "Poltrona 3", code: "P003" },
    { name: "Poltrona 4", code: "P004" },
  ];
  selectedChairs: Chair | null = null;

  constructor(
    private eventDialogService: EventDialogService,
    private calendarService: CalendarService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.generateTimeSlots();
  }

  ngOnInit(): void {
    this.eventDialogService.showModalView$.subscribe((showModalView) => {
      this.showModalView = showModalView;
      if (showModalView) {
        this.isMaximized = false;
      }
    });

    this.eventDialogService.currentEvent$.subscribe((currentEvent) => {
      this.currentEvent = currentEvent;
      if (currentEvent) {
        this.initializeEditForm();
      }
    });
  }

  onModalHide() {
    this.eventDialogService.closeViewEventDialog();
    this.showModalView = false;
    this.isMaximized = false;
  }

  enableEditMode() {
    this.isMaximized = true;
    setTimeout(() => {
      if (this.dialog) {
        this.dialog.maximize();
        this.isMaximized = true;
      }
    });
    this.initializeEditForm();
  }

  cancelEdit() {
    setTimeout(() => {
      if (this.dialog && this.isMaximized) {
        this.dialog.maximize();
        this.isMaximized = false;
      }
    });
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: "Sei sicuro di voler eliminare questo evento?",
      header: "Conferma eliminazione",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteEvent();
      },
    });
  }

  deleteEvent() {
    if (this.currentEvent && this.currentEvent.id) {
      const sourceId = this.currentEvent.extendedProps?.["sourceId"];

      if (sourceId) {
        this.calendarService.deleteEventSource(sourceId).subscribe(
          () => {
            this.deleteCurrentEvent();
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Errore",
              detail: "Impossibile eliminare l'evento sorgente",
            });
            this.deleteCurrentEvent();
          }
        );
      } else {
        this.deleteCurrentEvent();
      }
    }
  }

  private deleteCurrentEvent() {
    if (this.currentEvent && this.currentEvent.id) {
      this.calendarService.deleteEvent(this.currentEvent.id).subscribe(
        () => {
          this.messageService.add({
            severity: "success",
            summary: "Successo",
            detail: "Evento eliminato con successo",
          });

          this.eventDialogService.refreshCalendar();

          this.onModalHide();
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Errore",
            detail: "Impossibile eliminare l'evento",
          });
        }
      );
    }
  }

  saveChanges() {
    if (this.editedEvent) {
      this.calendarService.updateEvent(this.editedEvent).subscribe(
        (updatedEvent) => {
          this.messageService.add({
            severity: "success",
            summary: "Successo",
            detail: "Evento aggiornato con successo",
          });
          this.currentEvent = updatedEvent;
          setTimeout(() => {
            if (this.dialog && this.isMaximized) {
              this.dialog.maximize();
              this.isMaximized = false;
            }
          });
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Errore",
            detail: "Impossibile aggiornare l'evento",
          });
        }
      );
    }
  }

  formatDateDisplay(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format: "Mar 24/9/2024 09:30"
    const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    const dayName = dayNames[date.getDay()];

    return `${dayName} ${day}/${month}/${year} ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  formatTimeOnly(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  getAlertTagClass(alert: string): string {
    switch (alert.toLowerCase()) {
      case "anamnesi scaduta":
        return "bg-pink-50 text-pink-500";
      case "anamnesi in scadenza minori":
        return "bg-orange-50 text-orange-500";
      case "malattie infettive":
        return "bg-red-50 text-red-500";
      case "anamnesi":
        return "bg-pink-50 text-pink-500";
      default:
        return "bg-blue-50 text-blue-500";
    }
  }

  getAlertIcon(alert: string): string {
    switch (alert.toLowerCase()) {
      case "anamnesi scaduta":
      case "anamnesi":
        return "pi pi-heart";
      case "anamnesi in scadenza minori":
        return "pi pi-clock";
      case "malattie infettive":
        return "pi pi-exclamation-triangle";
      default:
        return "pi pi-info-circle";
    }
  }

  private initializeEditForm() {
    if (this.currentEvent) {
      // Create a deep copy to avoid modifying the original event
      this.editedEvent = JSON.parse(JSON.stringify(this.currentEvent));

      // Ensure extendedProps exists
      if (!this.editedEvent.extendedProps) {
        this.editedEvent.extendedProps = {};
      }

      // Set up date and time
      const startDate = new Date(this.currentEvent.start);
      this.selectedDate = new Date(startDate);

      this.calendarService.getEvents().subscribe((events) => {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events,
          initialView: "timeGridDay",
          initialDate: startDate,
        };
      });

      // Find the doctor in the dropdown options
      this.selectedDoctor =
        this.doctors.find(
          (d) => d.name === this.currentEvent?.extendedProps?.doctor
        ) || null;

      this.selectedChairs =
        this.chairs.find(
          (c) => c.name === this.currentEvent?.extendedProps?.chair
        ) || null;

      // Set up time slots
      const startHours = startDate.getHours();
      const startMinutes = startDate.getMinutes();
      const startTimeString = this.formatTimeString(startHours, startMinutes);
      this.selectedStartTime =
        this.timeSlots.find((t) => t.value === startTimeString) || null;

      if (this.currentEvent.end) {
        const endDate = new Date(this.currentEvent.end);
        const endHours = endDate.getHours();
        const endMinutes = endDate.getMinutes();
        const endTimeString = this.formatTimeString(endHours, endMinutes);
        this.selectedEndTime =
          this.timeSlots.find((t) => t.value === endTimeString) || null;
      } else {
        // Default to 1 hour later if no end time
        const endHours = (startHours + 1) % 24;
        const endTimeString = this.formatTimeString(endHours, startMinutes);
        this.selectedEndTime =
          this.timeSlots.find((t) => t.value === endTimeString) || null;
      }
    }
  }

  private generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = this.formatTimeString(hour, minute);
        const timeLabel = this.formatTimeLabel(hour, minute);
        this.timeSlots.push({ label: timeLabel, value: timeValue });
      }
    }
  }

  private formatTimeString(hours: number, minutes: number): string {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  private formatTimeLabel(hours: number, minutes: number): string {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  updateEventDates() {
    if (
      !this.selectedDate ||
      !this.selectedStartTime ||
      !this.selectedEndTime
    ) {
      return;
    }

    // TODO fix this bug Cannot read properties of undefined (reading 'split')
    const [startHours, startMinutes] = this.selectedStartTime.value
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = this.selectedEndTime.value
      .split(":")
      .map(Number);

    const startDate = new Date(this.selectedDate);
    startDate.setHours(startHours, startMinutes, 0);

    const endDate = new Date(this.selectedDate);
    endDate.setHours(endHours, endMinutes, 0);

    // If end time is earlier than start time, assume it's the next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    this.editedEvent.start = startDate.toISOString();
    this.editedEvent.end = endDate.toISOString();
  }

  onDoctorChange(event: any) {
    if (this.selectedDoctor && this.editedEvent.extendedProps) {
      this.editedEvent.extendedProps.doctor = this.selectedDoctor.name;
    }
  }

  updateChairs(event: any) {
    if (this.selectedChairs && this.editedEvent.extendedProps) {
      this.editedEvent.extendedProps.chair = event.name;
    }
  }

  updateStatus(event: any) {
    this.selectedStatus = event;
  }
}
