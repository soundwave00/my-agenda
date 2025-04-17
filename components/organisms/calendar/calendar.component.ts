import {
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  ViewChild,
  HostListener,
} from "@angular/core";
import {
  CalendarOptions,
  EventClickArg,
  DateSelectArg,
} from "@fullcalendar/core";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
// Altri plugin che ti servono
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import { CalendarEvent } from "../../../models/calendar-event.model";
import { DropdownFilter } from "../../../models/filters-bar.model";
import { CalendarService } from "../../../services/calendar.service";
import { EventDialogService } from "../../../services/event-dialog.service";
import { ResponsiveService } from "../../../services/responsive.service";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { CustomInputComponent } from "../../atoms/custom-input/custom-input.component";
import { calendarOptions } from "../../../models/calendar-options";
import { CommandsMobileBottomBarEnum } from "../../../models/commands-mobile-bottom-bar-enum.model";
import { CalendarStateService } from "../../../services/calendar-state.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CalendarComponent implements OnInit {
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  @ViewChild("sliderCalendar") sliderCalendarComponent!: FullCalendarComponent;
  @ViewChild("daySliderElement") daySliderElement!: ElementRef;
  loading: boolean = false;
  position: string = "center";

  currentEvent: CalendarEvent | null = null;
  events: CalendarEvent[] = [];
  allEvents: CalendarEvent[] = [];

  showDaySlider: boolean = false;
  selectedDayEvents: CalendarEvent[] = [];
  selectedDay: Date | null = null;

  calendarOptions: CalendarOptions = calendarOptions;
  sliderCalendarOptions: CalendarOptions = calendarOptions;
  isMobileView: boolean = false;
  commands: CommandsMobileBottomBarEnum[] | undefined;

  constructor(
    private calendarService: CalendarService,
    private eventDialogService: EventDialogService,
    private responsiveService: ResponsiveService,
    private calendarStateService: CalendarStateService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.responsiveService.isMobileView$.subscribe((isMobile) => {
      this.isMobileView = isMobile;
      this.updateCalendarView();
    });

    this.calendarService.getEvents().subscribe((events) => {
      this.allEvents = events;
      this.events = [...this.allEvents];
      const savedDate = this.calendarStateService.getSelectedDate();
      const initialDate = savedDate || new Date();

      this.calendarOptions = {
        ...this.calendarOptions,
        events: [...this.events],
        initialView: this.isMobileView ? "timeGridDay" : "resourceTimeGridWeek",
        initialDate: initialDate,
        datesAboveResources: true,
        plugins: [
          resourceTimeGridPlugin,
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ],
        resources: [
          { id: "1", title: "Mario Rossi" },
          { id: "2", title: "Anna Bianchi" },
          { id: "3", title: "Luca Verdi" },
          { id: "4", title: "Giulia Neri" },
        ],
        resourceLabelContent: (arg) => {
          // `arg.resource.title` è il titolo "Operatore 1/2/3".
          // Possiamo restituire un oggetto con { html: '...' } per iniettare HTML personalizzato
          return {
            html: `<span class="fc-operator-label"><i class="pi pi-user"></i> ${arg.resource.title}</span>`,
            // Esempio con icona Font Awesome. Adatta la classe in base alla tua libreria di icone.
          };
        },
        eventClick: (clickInfo) => this.onEventClick(clickInfo),
        select: (selectInfo) => {
          // Check if the selection originated from a dot button click
          if (selectInfo.jsEvent) {
            const target = selectInfo.jsEvent.target as HTMLElement;
            if (
              target?.classList.contains("dot-button") ||
              target?.closest(".dot-button")
            ) {
              console.log("Selezione dai tre puntini. No apertura dialog.");
              return;
            }
          }
          this.onSelectDate(selectInfo);
        },
        selectable: true,
        longPressDelay: 0,
        eventDrop: (info) => this.handleEventDrop(info),
        eventResize: (info) => this.handleEventResize(info),
        dateClick: (arg: any) => {
          const currentView = this.calendarComponent.getApi().view.type;
          if (currentView === "dayGridMonth") {
            const target = arg.jsEvent?.target as HTMLElement;
            if (
              target?.classList.contains("dot-button") ||
              target?.closest(".dot-button")
            ) {
              this.openDaySlider(arg.date);
              return;
            }
          }
        },
      };
      this.loading = false;
    });

    this.eventDialogService.currentEvent$.subscribe((event) => {
      if (event) {
        this.currentEvent = event;
      }
    });

    this.eventDialogService.eventCreated$.subscribe((newEvent) => {
      this.events.push(newEvent);
      this.allEvents.push(newEvent);
      this.updateCalendarsEvents();
    });

    this.eventDialogService.refreshCalendar$.subscribe(() => {
      this.loadEvents();
    });

    this.eventDialogService.eventUpdated$.subscribe(
      (updatedEvent: CalendarEvent) => {
        const index = this.events.findIndex((e) => e.id === updatedEvent.id);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }

        const allIndex = this.allEvents.findIndex(
          (e) => e.id === updatedEvent.id
        );
        if (allIndex !== -1) {
          this.allEvents[allIndex] = updatedEvent;
        }

        this.updateCalendarsEvents();
      }
    );

    this.buildCommandsList();
  }

  private onEventClick(clickInfo: EventClickArg): void {
    const fcEvent = clickInfo.event;

    this.currentEvent = {
      id: fcEvent.id,
      title: fcEvent.title,
      start: fcEvent.start ? fcEvent.start.toISOString() : "",
      end: fcEvent.end ? fcEvent.end.toISOString() : "",
      extendedProps: clickInfo.event.extendedProps,
    };

    this.position = this.isMobileView ? "center" : "right";
    this.eventDialogService.openViewEventDialog(this.currentEvent);
  }

  private onSelectDate(selectInfo: DateSelectArg): void {
    const opId = selectInfo.resource?.id;
    const opName = selectInfo.resource?.title;

    this.currentEvent = {
      id: "", //TODO sarà riempito dal backend
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      backgroundColor: "#",
      description: "",
      location: "",
      extendedProps: { operatorName: opName },
      resourceId: opId,
    };
    this.eventDialogService.openNewEventDialog(this.currentEvent, opId, opName);
  }

  buildCommandsList(): void {
    if (this.isMobileView) {
      if (this.commands == null) this.commands = [];
      this.commands.push(CommandsMobileBottomBarEnum.GoBackCalendar);
      this.commands.push(CommandsMobileBottomBarEnum.GoForwardCalendar);
      this.commands.push(CommandsMobileBottomBarEnum.Plus);
      this.commands.push(CommandsMobileBottomBarEnum.Calendar);
      this.commands.push(CommandsMobileBottomBarEnum.More);
    }
  }

  goToDate(selectedDate: Date): void {
    this.calendarStateService.setSelectedDate(selectedDate);
    this.calendarOptions.initialDate = selectedDate.toISOString();
    this.calendarComponent.getApi().gotoDate(selectedDate);
  }

  goNext(): void {
    this.calendarComponent.getApi().next();
    if (this.isMobileView) {
      const currentDate = this.calendarComponent.getApi().getDate();
      this.calendarStateService.setSelectedDate(currentDate);
    }
  }

  goPrev(): void {
    this.calendarComponent.getApi().prev();
    if (this.isMobileView) {
      const currentDate = this.calendarComponent.getApi().getDate();
      this.calendarStateService.setSelectedDate(currentDate);
    }
  }

  goToday(): void {
    this.calendarComponent.getApi().today();
    this.calendarStateService.resetSelectedDate();
  }

  changeView(view: string): void {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();

      // Only change the view if it's explicitly requested
      // This prevents view changes during window resize
      if (view && view !== calendarApi.view.type) {
        calendarApi.changeView(view);
      }

      if (this.showDaySlider) {
        this.closeDaySlider();
      }
    }
  }

  applyFilters(filters: DropdownFilter): void {
    this.loading = true;
    const selectedClinics = filters.selectedClinics ?? null;
    const selectedOperators = filters.selectedOperators ?? null;
    const selectedChairs = filters.selectedChairs ?? null;
    const selectedStates = filters.selectedStates ?? null;
    const availableOperatorsSwitch = filters.availableOperatorsSwitch ?? true;
    const searchQuery = filters.searchQuery?.toLowerCase() || "";

    this.events = this.allEvents.filter((event) => {
      const clinicCode = event.extendedProps?.clinic;
      const operatorCode = event.extendedProps?.doctor;
      const location = event.extendedProps?.location;
      const operatorAvailable = event.extendedProps?.operatorAvailable ?? true;
      const operatorSearchQuery =
        event.extendedProps?.doctor?.toLowerCase() || "";
      const patientName = event.extendedProps?.patientName?.toLowerCase() || "";
      const eventState = event.extendedProps?.states;

      const matchesClinic =
        !selectedClinics || selectedClinics.name === clinicCode;
      const matchesOperator =
        !selectedOperators || selectedOperators.name === operatorCode;
      const matchesChair =
        !selectedChairs ||
        (Array.isArray(selectedChairs)
          ? selectedChairs.some((chair) => chair.name === location)
          : selectedChairs.name === location);

      const matchesAvailability = availableOperatorsSwitch
        ? operatorAvailable
        : true;
      const matchesSearch =
        searchQuery === "" ||
        operatorSearchQuery.includes(searchQuery) ||
        patientName.includes(searchQuery);
      const matchesState =
        !selectedStates || selectedStates.value === eventState;

      return (
        matchesClinic &&
        matchesOperator &&
        matchesChair &&
        matchesAvailability &&
        matchesSearch &&
        matchesState
      );
    });

    this.calendarOptions.events = [...this.events];
    this.loading = false;
  }

  loadEvents() {
    this.calendarService.getEvents().subscribe((events) => {
      this.allEvents = events;
      this.events = [...this.allEvents];
      this.updateCalendarsEvents();
    });
  }

  private updateCalendarsEvents(): void {
    this.calendarOptions.events = [...this.events];
    if (this.calendarComponent && this.calendarComponent.getApi()) {
      this.calendarComponent.getApi().refetchEvents();
    }

    if (
      this.showDaySlider &&
      this.sliderCalendarComponent &&
      this.sliderCalendarComponent.getApi()
    ) {
      this.sliderCalendarOptions.events = [...this.events];
      this.sliderCalendarComponent.getApi().refetchEvents();
    }
  }

  private updateCalendarView(): void {
    setTimeout(() => {
      if (this.calendarComponent && this.calendarComponent.getApi()) {
        const calendarApi = this.calendarComponent.getApi();
        if (this.isMobileView) {
          calendarApi.changeView("timeGridDay");
        } else {
          calendarApi.changeView("resourceTimeGridWeek");
        }
      }
    });
  }

  handleEventDrop(info: any): void {
    const droppedEvent = info.event;

    const updatedEvent: CalendarEvent = {
      id: droppedEvent.id,
      title: droppedEvent.title,
      start: droppedEvent.start?.toISOString(),
      end: droppedEvent.end?.toISOString(),
      extendedProps: droppedEvent.extendedProps,
    };

    this.calendarService.updateEvent(updatedEvent).subscribe(
      () => {
        console.log("Event updated successfully");

        // Update the event in the events array
        const index = this.events.findIndex((e) => e.id === updatedEvent.id);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }

        // Update the event in the allEvents array
        const allIndex = this.allEvents.findIndex(
          (e) => e.id === updatedEvent.id
        );
        if (allIndex !== -1) {
          this.allEvents[allIndex] = updatedEvent;
        }

        this.updateCalendarsEvents();
      },
      (error) => {
        info.revert();
        console.error("Error updating event:", error);
      }
    );
  }

  handleEventResize(info: any): void {
    const resizedEvent = info.event;

    const updatedEvent: CalendarEvent = {
      id: resizedEvent.id,
      title: resizedEvent.title,
      start: resizedEvent.start?.toISOString(),
      end: resizedEvent.end?.toISOString(),
      extendedProps: resizedEvent.extendedProps,
    };

    this.calendarService.updateEvent(updatedEvent).subscribe(
      () => {
        console.log("Event resized successfully");

        const index = this.events.findIndex((e) => e.id === updatedEvent.id);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }

        const allIndex = this.allEvents.findIndex(
          (e) => e.id === updatedEvent.id
        );
        if (allIndex !== -1) {
          this.allEvents[allIndex] = updatedEvent;
        }

        this.updateCalendarsEvents();
      },
      (error) => {
        info.revert();
        console.error("Error resizing event:", error);
      }
    );
  }

  @HostListener("document:keydown.escape", ["$event"])
  handleEscapeKey(event: KeyboardEvent): void {
    const dialogState = this.eventDialogService.getDialogState();

    if (
      this.showDaySlider &&
      !dialogState.showModalNew &&
      !dialogState.showModalView
    ) {
      this.closeDaySlider();
      event.stopPropagation();
    }
  }

  public openDaySlider(date: Date): void {
    this.selectedDay = date;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    this.selectedDayEvents = this.events.filter((event) => {
      const eventStart = new Date(event.start);
      return eventStart >= startOfDay && eventStart <= endOfDay;
    });

    this.sliderCalendarOptions = {
      ...this.sliderCalendarOptions,
      events: [...this.events],
      initialView: "timeGridDay",
      initialDate: date,
      eventDrop: (info) => this.handleEventDrop(info),
      eventResize: (info) => this.handleEventResize(info),
      select: (selectInfo) => this.onSelectDate(selectInfo),
      selectable: true,
      longPressDelay: 0,
      eventClick: (clickInfo) => this.onEventClick(clickInfo),
    };

    this.showDaySlider = true;

    setTimeout(() => {
      if (this.daySliderElement) {
        this.daySliderElement.nativeElement.focus();
      }

      if (this.calendarComponent && this.calendarComponent.getApi()) {
        this.calendarComponent.getApi().updateSize();
      }

      if (
        this.sliderCalendarComponent &&
        this.sliderCalendarComponent.getApi()
      ) {
        this.sliderCalendarComponent.getApi().gotoDate(date);
      }
    }, 100);
  }

  public closeDaySlider(): void {
    this.showDaySlider = false;

    setTimeout(() => {
      if (this.calendarComponent && this.calendarComponent.getApi()) {
        this.calendarComponent.getApi().updateSize();
      }
    }, 100);
  }

  public viewEventDetails(event: CalendarEvent): void {
    this.currentEvent = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: event.extendedProps,
    };

    this.position = this.isMobileView ? "center" : "right";
    this.eventDialogService.openViewEventDialog(this.currentEvent);
    this.closeDaySlider();
  }
}
