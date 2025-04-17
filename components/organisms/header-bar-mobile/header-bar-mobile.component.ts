import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { DropdownFilter } from "../../../models/filters-bar.model";
import { EventDialogService } from "../../../services/event-dialog.service";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { CalendarEventState } from "../../../models/calendar-event-state.model";
import { CalendarStateService } from "../../../services/calendar-state.service";

@Component({
  selector: "app-header-bar-mobile",
  templateUrl: "./header-bar-mobile.component.html",
  styleUrl: "./header-bar-mobile.component.scss",
})
export class HeaderBarMobileComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<DropdownFilter>();
  @Output() goToEventDate = new EventEmitter<Date>();

  event_date: Date | null = null;
  selectedOperators: any = null;
  selectedClinics: any = null;
  selectedChairs: any = null;
  selectedStates: any = null;
  availableOperatorsSwitch: boolean = false;
  showFilterModal: boolean = false;

  private backupFilters: any = {};
  tempFilters: any = {};

  operators: any[] = [
    { name: "Mario Rossi", code: "DR001" },
    { name: "Anna Bianchi", code: "DMB002" },
    { name: "Dott. Luigi Verdi", code: "DLV003" },
    { name: "Dott.ssa Giulia Neri", code: "DGN004" },
    { name: "Dott. Paolo Gialli", code: "DPG005" },
    { name: "Dott.ssa Anna Viola", code: "DAV006" },
  ];

  clinics: any[] = [
    { name: "Clinica San Marco", code: "CSM001" },
    { name: "Centro Medico Salus", code: "CMS002" },
    { name: "Poliambulatorio Sant'Anna", code: "PSA003" },
    { name: "Centro Medico Aurora", code: "CA004" },
    { name: "Centro Diagnostico Milano", code: "CDM005" },
    { name: "Istituto Medico Sant'Orsola", code: "IMSO006" },
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

  showCalendarModal = false;

  constructor(
    private eventDialogService: EventDialogService,
    private router: Router,
    private calendarStateService: CalendarStateService
  ) {
    this.showCalendarModal = false;
  }

  ngOnInit(): void {
    const savedDate = this.calendarStateService.getSelectedDate();
    this.event_date = savedDate || new Date();
  }

  navigateToSearch(): void {
    this.router.navigate(["/search"]);
  }

  toggleFilterModal(): void {
    if (!this.showFilterModal) {
      this.backupFilters = {
        selectedClinics: this.selectedClinics,
        selectedOperators: this.selectedOperators,
        selectedChairs: this.selectedChairs,
        selectedStates: this.selectedStates,
        availableOperatorsSwitch: this.availableOperatorsSwitch,
      };

      this.tempFilters = {
        selectedClinics: this.selectedClinics,
        selectedOperators: this.selectedOperators,
        selectedChairs: this.selectedChairs,
        selectedStates: this.selectedStates,
        availableOperatorsSwitch: this.availableOperatorsSwitch,
      };
    }
    this.showFilterModal = !this.showFilterModal;
  }

  updateOperators(event: any): void {
    this.onFiltersChanged();
  }

  updateClinics(event: any): void {
    this.tempFilters.selectedClinics = event.value;
  }

  updateChairs(event: any): void {
    this.tempFilters.selectedChairs = event.value;
  }

  updateStates(event: any): void {
    this.tempFilters.selectedStates = event.value;
  }

  handleSwitchChange(event: any): void {
    this.tempFilters.availableOperatorsSwitch = event.checked;
  }

  cancelFilters(): void {
    this.selectedClinics = this.backupFilters.selectedClinics;
    this.selectedChairs = this.backupFilters.selectedChairs;
    this.selectedStates = this.backupFilters.selectedStates;
    this.availableOperatorsSwitch = this.backupFilters.availableOperatorsSwitch;

    this.showFilterModal = false;
  }

  applyFilters(): void {
    this.selectedClinics = this.tempFilters.selectedClinics;
    this.selectedChairs = this.tempFilters.selectedChairs;
    this.selectedStates = this.tempFilters.selectedStates;
    this.availableOperatorsSwitch = this.tempFilters.availableOperatorsSwitch;

    this.onFiltersChanged();
    this.showFilterModal = false;
  }

  onFiltersChanged(): void {
    this.filtersChanged.emit({
      selectedClinics: this.selectedClinics,
      selectedOperators: this.selectedOperators,
      selectedChairs: this.selectedChairs,
      selectedStates: this.selectedStates,
      availableOperatorsSwitch: this.availableOperatorsSwitch,
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

  onSetEventDate() {
    if (this.event_date) {
      // Save selected date
      this.calendarStateService.setSelectedDate(this.event_date);
      this.goToEventDate.emit(this.event_date);
      this.showCalendarModal = false;
    }
  }

  openCalendar() {
    const savedDate = this.calendarStateService.getSelectedDate();
    if (savedDate) {
      this.event_date = savedDate;
    }
    this.showCalendarModal = true;
  }
}
