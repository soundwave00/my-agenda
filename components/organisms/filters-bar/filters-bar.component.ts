import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
} from "@angular/core";
import { DropdownFilter } from "../../../models/filters-bar.model";
import { CalendarEventState } from "../../../models/calendar-event-state.model";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { EventDialogService } from "../../../services/event-dialog.service";
import { DropdownOption } from "../../../models/multiselect-dropdown.model";
import { SelectButtonValues } from "../../../models/time-slot.model copy";

@Component({
  selector: "app-filters-bar",
  templateUrl: "./filters-bar.component.html",
  styleUrl: "./filters-bar.component.scss",
})
export class FiltersBarComponent implements OnInit {
  @Output() goTodayClicked = new EventEmitter<void>();
  @Output() goNextClicked = new EventEmitter<void>();
  @Output() goPrevClicked = new EventEmitter<void>();
  @Output() goToEventDate = new EventEmitter<Date>();
  @Output() changeCalendarView = new EventEmitter<string>();
  @Output() filtersChanged = new EventEmitter<DropdownFilter>();

  event_date: Date | null = null;
  selectedClinics: any = null;
  selectedOperators: any = null;
  selectedChairs: any = null;
  selectedStates: any = null;
  availableOperatorsSwitch: boolean = true;
  searchQuery: string = "";
  searchTimeout: any;
  isSwitchLabelVisible: boolean = true;
  isSelectLabelVisible: boolean = true;

  frequencyValue: SelectButtonValues = {
    imgSrc: "../../../assets/layout/images/calendar-week.svg",
    value: "timeGridWeek",
  };
  structureValue: SelectButtonValues = {
    imgSrc: "",
    icon: "pi pi-user",
    value: "doc",
  };

  frequencyOptions = [
    {
      imgSrc: "../../../assets/layout/images/calendar-day.svg",
      value: "timeGridDay",
    },
    {
      imgSrc: "../../../assets/layout/images/calendar-week.svg",
      value: "timeGridWeek",
    },
    {
      imgSrc: "../../../assets/layout/images/calendar-month.svg",
      value: "dayGridMonth",
    },
  ];

  structureOptions = [
    {
      imgSrc: "",
      icon: "pi pi-user",
      value: "doc",
    },
    {
      imgSrc: "../../../assets/layout/images/office-chair.svg",
      value: "clinic",
    },
  ];

  clinics: any[] = [
    { name: "Clinica San Marco", code: "CSM001" },
    { name: "Centro Medico Salus", code: "CMS002" },
    { name: "Poliambulatorio Sant'Anna", code: "PSA003" },
    { name: "Centro Medico Aurora", code: "CA004" },
    { name: "Centro Diagnostico Milano", code: "CDM005" },
    { name: "Istituto Medico Sant'Orsola", code: "IMSO006" },
  ];

  operators: any[] = [
    { name: "Mario Rossi", code: "DR001" },
    { name: "Anna Bianchi", code: "DMB002" },
    { name: "Dott. Luigi Verdi", code: "DLV003" },
    { name: "Dott.ssa Giulia Neri", code: "DGN004" },
    { name: "Dott. Paolo Gialli", code: "DPG005" },
    { name: "Dott.ssa Anna Viola", code: "DAV006" },
  ];

  chairs: any[] = [
    { name: "Poltrona 1", code: "P001" },
    { name: "Poltrona 2", code: "P002" },
    { name: "Poltrona 3", code: "P003" },
    { name: "Poltrona 4", code: "P004" },
  ];

  statesOptions = Object.keys(CalendarEventState)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").trim(),
      value: CalendarEventState[key as keyof typeof CalendarEventState],
    }));

  constructor(private eventDialogService: EventDialogService) {}

  ngOnInit(): void {
    this.event_date = new Date();
    this.updateLabelVisibility(window.innerWidth);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any): void {
    this.updateLabelVisibility(event.target.innerWidth);
  }

  private updateLabelVisibility(width: number): void {
    this.isSwitchLabelVisible = width > 650;
    this.isSelectLabelVisible = width > 1274;
  }

  isSearchExpanded = false;

  toggleSearch(): void {
    if (window.innerWidth <= 920) {
      this.isSearchExpanded = !this.isSearchExpanded;
    }
  }

  updateEventDate(isNext: boolean) {
    if (!this.event_date) return;

    const newDate = new Date(this.event_date);
    const delta =
      this.frequencyValue.value === "timeGridWeek"
        ? 7
        : this.frequencyValue.value === "dayGridMonth"
        ? 30
        : 1;

    if (this.frequencyValue.value === "dayGridMonth") {
      newDate.setMonth(newDate.getMonth() + (isNext ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (isNext ? delta : -delta));
    }

    this.event_date = newDate;
  }

  onGoToday() {
    this.event_date = new Date();
    this.goTodayClicked.emit();
  }

  onGoNext() {
    this.updateEventDate(true);
    this.goNextClicked.emit();
  }

  onGoPrev() {
    this.updateEventDate(false);
    this.goPrevClicked.emit();
  }

  onSetEventDate() {
    if (this.event_date) {
      this.goToEventDate.emit(this.event_date);
    }
  }

  handleSelectFrequency(event: SelectButtonValues) {
    if (event) {
      this.frequencyValue = event;
      this.changeCalendarView.emit(event.value);
    }
  }
  handleSelectChange(event: SelectButtonValues) {
    console.log("Selezionato:", event);
  }

  handleSwitchChange(event: { checked: boolean }) {
    console.log("Stato cambiato:", event.checked);
  }

  updateClinics(selected: any): void {
    this.selectedClinics = selected;
    this.onFiltersChanged();
  }

  updateOperators(selected: any): void {
    this.selectedOperators = selected;
    this.onFiltersChanged();
  }

  updateChairs(selected: any): void {
    this.selectedChairs = selected;
    this.onFiltersChanged();
  }

  updateStates(selected: any): void {
    this.selectedStates = selected;
    this.onFiltersChanged();
  }

  onFiltersChanged(): void {
    this.filtersChanged.emit({
      selectedClinics: this.selectedClinics ?? null,
      selectedOperators: this.selectedOperators ?? null,
      selectedChairs: this.selectedChairs ?? null,
      selectedStates: this.selectedStates ?? null,
      availableOperatorsSwitch: this.availableOperatorsSwitch,
      searchQuery: this.searchQuery.length >= 3 ? this.searchQuery : "",
    });
  }

  onCreateAppointment() {
    const currentEvent: CalendarEvent = {
      title: "",
      start: "",
      end: "",
      allDay: false,
      description: "",
      location: "",
      extendedProps: {},
    };

    this.eventDialogService.openNewEventDialog(currentEvent);
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.onFiltersChanged();
    }, 2000);
  }
}
