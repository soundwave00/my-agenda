import { Component, OnInit, ViewChild } from "@angular/core";
import { CalendarOptions } from "@fullcalendar/core";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { EventDialogService } from "../../../services/event-dialog.service";
import { CalendarService } from "../../../services/calendar.service";
import { MessageService } from "primeng/api";
import { calendarOptions } from "../../../models/calendar-options";
import { ResponsiveService } from "../../../services/responsive.service";
import { CalendarEventState } from "../../../models/calendar-event-state.model";
import { FullCalendarComponent } from "@fullcalendar/angular";
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

interface Patient {
  name: string;
  id: string;
  phoneNumber?: string;
}

interface Service {
  name: string;
  code: string;
  description?: string;
}

@Component({
  selector: "app-new-event-dialog",
  templateUrl: "./new-event-dialog.component.html",
  styleUrl: "./new-event-dialog.component.scss",
})
export class NewEventDialogComponent implements OnInit {
  @ViewChild("dialogCalendar") dialogCalendarComponent!: FullCalendarComponent;
  selectedCalendarDate: Date = new Date();

  showModal: boolean = false;
  newEvent: CalendarEvent = {} as CalendarEvent;
  isMaximized = false;
  window = window;

  // Form fields
  patientName: string = "";
  selectedDate: Date = new Date();
  selectedStartTime: string | null = null;
  selectedEndTime: string | null = null;
  timeSlots: string[] = [];
  calendarOptions: CalendarOptions = calendarOptions;
  events: CalendarEvent[] = [];
  allEvents: CalendarEvent[] = [];
  loading: boolean = false;
  serviceName: string = "";
  lockedOperatorId: string | null = null;
  doctorDisabled = false;

  // Mock data
  doctors: Doctor[] = [
    { name: "Mario Rossi", id: "1" },
    { name: "Anna Bianchi", id: "2" },
    { name: "Luca Verdi", id: "3" },
    { name: "Giulia Neri", id: "4" },
  ];
  selectedDoctor: Doctor | null = null;

  patients: Patient[] = [
    { name: "Mario Rossi", id: "1", phoneNumber: "123-456-7890" },
    { name: "Anna Bianchi", id: "2", phoneNumber: "234-567-8901" },
    { name: "Luca Verdi", id: "3", phoneNumber: "345-678-9012" },
    { name: "Giulia Neri", id: "4", phoneNumber: "456-789-0123" },
  ];
  selectedPatient: Patient | null = null;

  // Status options
  statusOptions = Object.keys(CalendarEventState)
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
        icon: getStateIcon(
          CalendarEventState[key as keyof typeof CalendarEventState]
        ),
      };
    });
  selectedStatus = this.statusOptions[0];

  chairs: Chair[] = [
    { name: "Poltrona 1", code: "P001" },
    { name: "Poltrona 2", code: "P002" },
    { name: "Poltrona 3", code: "P003" },
    { name: "Poltrona 4", code: "P004" },
  ];
  selectedChair: Chair | null = null;

  notes: string = "";
  phoneOptions: any[] = [
    { label: "Cellulare", value: "mobile" },
    { label: "Fisso", value: "home" },
    { label: "Ufficio", value: "office" },
  ];
  selectedPhoneType: any = this.phoneOptions[0];

  alertOptions = [
    { label: "Anamnesi", value: "anamnesi" },
    { label: "Anamnesi scaduta", value: "anamnesi_scaduta" },
    { label: "Anamnesi in scadenza minori", value: "anamnesi_scadenza_minori" },
    { label: "Malattie infettive", value: "malattie_infettive" },
  ];
  selectedAlert: any = null;

  constructor(
    private eventDialogService: EventDialogService,
    private calendarService: CalendarService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService
  ) {
    this.generateTimeSlots();
    this.initializeNewEvent();
  }

  // Aggiungi un flag per la modalità mobile
  isMobileView: boolean = false;

  ngOnInit(): void {
    // Aggiungi questo nel metodo ngOnInit esistente
    this.responsiveService.isMobileView$.subscribe((isMobile) => {
      this.isMobileView = isMobile;
    });

    this.eventDialogService.lockedOperatorId$.subscribe((id) => {
      this.lockedOperatorId = id;
      this.doctorDisabled = !!id;

      if (id) {
        // pre‑seleziono il medico.
        const found = this.doctors.find((d) => d.id === id);
        if (found) {
          this.selectedDoctor = found;
        }
      }
    });

    this.eventDialogService.showModalNew$.subscribe((showModal) => {
      this.showModal = showModal;
      if (showModal) {
        // Ottieni l'evento corrente dal servizio
        const currentEvent =
          this.eventDialogService.getDialogState().currentEvent;
        if (currentEvent) {
          // Inizializza il nuovo evento con i dati dell'evento corrente
          this.initializeFromCurrentEvent(currentEvent);
        } else {
          // Fallback all'inizializzazione standard
          this.initializeNewEvent();
        }
      }
    });

    // Ascolta i cambiamenti dell'evento corrente
    this.eventDialogService.currentEvent$.subscribe((event) => {
      if (event && this.showModal) {
        this.initializeFromCurrentEvent(event);
      }
    });
  }

  onModalHide() {
    this.eventDialogService.closeNewEventDialog();
    this.showModal = false;
    this.isMaximized = false;
  }

  saveEvent() {
    if (!this.validateForm()) {
      return;
    }

    this.prepareEventData();

    // Aggiungi colori e proprietà di default per l'evento
    if (!this.newEvent.extendedProps) {
      this.newEvent.extendedProps = {};
    }

    // Aggiungi proprietà necessarie per la visualizzazione nel calendario
    this.newEvent.extendedProps["backgroundColor"] =
      this.getRandomBackgroundColor();
    this.newEvent.extendedProps["alert"] = ["Anamnesi"];
    this.newEvent.extendedProps["states"] = 1; // Stato iniziale

    // Imposta il titolo dell'evento
    const patientName =
      this.selectedPatient?.name || this.patientName || "Paziente";
    const serviceName = this.serviceName || "Visita";
    this.newEvent.title = `${patientName} - ${serviceName}`;

    // Assicurati che le date siano corrette
    this.updateEventDates();

    // Invia l'evento al servizio
    this.calendarService.createEvent(this.newEvent).subscribe(
      (createdEvent) => {
        this.messageService.add({
          severity: "success",
          summary: "Successo",
          detail: "Evento creato con successo",
        });

        // Notifica il servizio che un evento è stato creato
        this.eventDialogService.notifyEventCreated(createdEvent);

        // Chiudi la modale
        this.onModalHide();
      },
      (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Errore",
          detail: "Impossibile creare l'evento",
        });
      }
    );
  }

  handleMaximize(event: { maximized: boolean }) {
    this.isMaximized = event.maximized;
    console.log("Maximized state:", this.isMaximized);
  }

  // Metodo per generare un colore di sfondo casuale
  private getRandomBackgroundColor(): string {
    const colors = [
      "#DE5E74", // Rosa
      "#EC8206", // Arancione
      "#5C8725", // Verde
      "#338aff", // Blu
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  private validateForm(): boolean {
    if (!this.patientName && !this.selectedPatient) {
      this.messageService.add({
        severity: "warn",
        summary: "Attenzione",
        detail: "Inserisci un paziente",
      });
      return false;
    }

    if (
      !this.selectedDate ||
      !this.selectedStartTime ||
      !this.selectedEndTime
    ) {
      this.messageService.add({
        severity: "warn",
        summary: "Attenzione",
        detail: "Seleziona data e orario",
      });
      return false;
    }

    return true;
  }

  private prepareEventData() {
    // Set up dates
    this.updateEventDates();

    // Set up extended props
    if (!this.newEvent.extendedProps) {
      this.newEvent.extendedProps = {};
    }

    // Set patient info
    if (this.selectedPatient) {
      this.newEvent.extendedProps.patientName = this.patientName;
      this.newEvent.extendedProps["patientId"] = this.selectedPatient.id;
      this.newEvent.extendedProps.phoneNumber =
        this.selectedPatient.phoneNumber;
    } else if (this.patientName) {
      this.newEvent.extendedProps.patientName = this.patientName;
    }

    if (this.selectedDoctor) {
      this.newEvent.extendedProps.doctor = this.selectedDoctor.name;
      this.newEvent.extendedProps["doctorId"] = this.selectedDoctor.id;
      this.newEvent.resourceId = this.selectedDoctor.id;
    }

    if (this.selectedChair) {
      this.newEvent.extendedProps.chair = this.selectedChair.name;
      this.newEvent.extendedProps["chairCode"] = this.selectedChair.code;
    }

    if (this.selectedStatus) {
      this.newEvent.extendedProps["status"] = this.selectedStatus.value;
    }

    // Set notes
    this.newEvent.description = this.notes;

    // Set title (usually patient name + service)
    const patientName =
      this.selectedPatient?.name || this.patientName || "Paziente";
    const serviceName = this.serviceName || "Visita";
    this.newEvent.title = `${patientName} - ${serviceName}`;

    // Add additional service if provided
    // TODO forse da togliere
    if (this.serviceName) {
      if (!this.newEvent.extendedProps.additionalServices) {
        this.newEvent.extendedProps.additionalServices = [];
      }
      this.newEvent.extendedProps.additionalServices.push({
        name: this.serviceName,
        description: "",
      });
    }

    if (this.notes || this.serviceName) {
      if (!this.newEvent.extendedProps.serviceName) {
        this.newEvent.extendedProps.serviceName = this.serviceName;
      }
      if (!this.newEvent.extendedProps.notes) {
        this.newEvent.extendedProps.notes = this.notes;
      }
    }
  }

  // Nuovo metodo per inizializzare il form con l'evento corrente
  private initializeFromCurrentEvent(currentEvent: CalendarEvent) {
    // Copia l'evento corrente
    this.newEvent = { ...currentEvent };

    // Inizializza i campi del form con i dati dell'evento
    if (currentEvent.start) {
      // Converti le stringhe ISO in oggetti Date
      const startDate = new Date(currentEvent.start);

      this.calendarService.getEvents().subscribe((events) => {
        this.allEvents = events;
        this.events = [...this.allEvents];

        this.calendarOptions = {
          ...this.calendarOptions, // Mantieni le altre opzioni
          events: [...this.events], // Aggiorna gli eventi
          initialView: "timeGridDay",
          initialDate: startDate,
        };
        this.loading = false;
      });

      // Imposta la data selezionata (senza l'ora)
      this.selectedDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      this.selectedCalendarDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      // Imposta l'ora di inizio
      const startHours = startDate.getHours();
      const startMinutes = Math.floor(startDate.getMinutes() / 15) * 15; // Arrotonda ai 15 minuti più vicini
      const startTimeString = this.formatTimeString(startHours, startMinutes);

      this.selectedStartTime =
        this.timeSlots.find((t) => t === startTimeString) || null;

      if (!this.selectedStartTime) {
        // Fallback: usa il primo slot disponibile
        this.selectedStartTime = this.timeSlots[0];
      }

      // Imposta l'ora di fine
      if (currentEvent.end) {
        const endDate = new Date(currentEvent.end);

        const endHours = endDate.getHours();
        const endMinutes = Math.floor(endDate.getMinutes() / 15) * 15; // Arrotonda ai 15 minuti più vicini
        const endTimeString = this.formatTimeString(endHours, endMinutes);

        this.selectedEndTime =
          this.timeSlots.find((t) => t === endTimeString) || null;

        if (!this.selectedEndTime) {
          // Fallback: usa un'ora dopo l'inizio
          const fallbackEndHours = (startHours + 1) % 24;
          const fallbackEndTimeString = this.formatTimeString(
            fallbackEndHours,
            startMinutes
          );
          this.selectedEndTime =
            this.timeSlots.find((t) => t === fallbackEndTimeString) ||
            this.timeSlots[4]; // 1 ora dopo
        }
      } else {
        // Se non c'è un'ora di fine, imposta un'ora dopo l'inizio
        const endHours = (startHours + 1) % 24;
        const endTimeString = this.formatTimeString(endHours, startMinutes);
        this.selectedEndTime =
          this.timeSlots.find((t) => t === endTimeString) || this.timeSlots[4]; // 1 ora dopo
      }
    }

    // Resetta gli altri campi del form
    this.patientName = "";
    this.selectedPatient = null;
    this.selectedDoctor = null;
    this.selectedChair = null;
    this.notes = "";
    this.serviceName = "";
    this.selectedStatus = this.statusOptions[0];
  }

  private initializeNewEvent() {
    this.newEvent = {
      id: "",
      title: "",
      start: "",
      end: "",
      description: "",
      extendedProps: {},
    } as CalendarEvent;

    // Reset form fields
    this.patientName = "";
    this.selectedPatient = null;
    this.selectedDoctor = null;
    this.selectedChair = null;
    this.notes = "";
    this.serviceName = "";
    this.selectedStatus = this.statusOptions[0];

    // Set default date and time
    const now = new Date();
    this.selectedDate = new Date(now);

    // Round to next 15 minutes
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    const hours = now.getHours() + (minutes >= 60 ? 1 : 0);
    const adjustedMinutes = minutes >= 60 ? 0 : minutes;

    const startTimeString = this.formatTimeString(hours, adjustedMinutes);
    this.selectedStartTime =
      this.timeSlots.find((t) => t === startTimeString) || null;

    // Default end time is 1 hour later
    const endHours = (hours + 1) % 24;
    const endTimeString = this.formatTimeString(endHours, adjustedMinutes);
    this.selectedEndTime =
      this.timeSlots.find((t) => t === endTimeString) || null;
  }

  private generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = this.formatTimeString(hour, minute);
        const timeLabel = this.formatTimeLabel(hour, minute);
        this.timeSlots.push(timeLabel, timeValue);
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

    const [startHours, startMinutes] = this.selectedStartTime
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = this.selectedEndTime.split(":").map(Number);

    const startDate = new Date(this.selectedDate);
    startDate.setHours(startHours, startMinutes, 0);

    const endDate = new Date(this.selectedDate);
    endDate.setHours(endHours, endMinutes, 0);

    // If end time is earlier than start time, assume it's the next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    this.newEvent.start = startDate.toISOString();
    this.newEvent.end = endDate.toISOString();
  }

  onPatientChange(event: any) {
    if (this.selectedPatient && this.newEvent.extendedProps) {
      this.newEvent.extendedProps.doctor = event.name;
    }
  }

  onChairChange(event: any) {
    if (this.selectedChair && this.newEvent.extendedProps) {
      this.newEvent.extendedProps.chair = event.name;
    }
  }

  goToday(): void {
    if (this.dialogCalendarComponent) {
      this.dialogCalendarComponent.getApi().today();
      this.selectedCalendarDate = new Date();
    }
  }

  goPrev(): void {
    if (this.dialogCalendarComponent) {
      this.dialogCalendarComponent.getApi().prev();
      const currentDate = this.dialogCalendarComponent.getApi().getDate();
      this.selectedCalendarDate = currentDate;
    }
  }

  goNext(): void {
    if (this.dialogCalendarComponent) {
      this.dialogCalendarComponent.getApi().next();
      const currentDate = this.dialogCalendarComponent.getApi().getDate();
      this.selectedCalendarDate = currentDate;
    }
  }

  onSetCalendarDate(): void {
    if (this.selectedCalendarDate && this.dialogCalendarComponent) {
      this.dialogCalendarComponent.getApi().gotoDate(this.selectedCalendarDate);
    }
  }

  updateStatus(event: any) {
    this.selectedStatus = event;
  }
}
