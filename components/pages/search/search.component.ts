import { Component, OnInit } from "@angular/core";
import { CalendarService } from "../../../services/calendar.service";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { CalendarEventState } from "../../../models/calendar-event-state.model";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  searchQuery: string = "";
  searchResults: any[] = [];
  originalSearchResults: any[] = [];
  hasSearched: boolean = false;
  selectedOperators: any = null;
  selectedChairs: any = null;
  selectedStates: any = null;
  selectedDate: any = null;
  showFilterModal: boolean = false;

  private backupFilters: any = {};
  tempFilters: any = {};

  // Mock data for dropdowns (replace with your actual data)
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

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    console.log(
      "SearchComponent initialized",
      this.searchResults,
      this.hasSearched
    );
  }

  onSearch(event: any): void {
    this.hasSearched = true;

    if (this.searchQuery.trim()) {
      this.calendarService.getEvents().subscribe((events) => {
        this.searchResults = this.filterEvents(events, this.searchQuery);
        this.originalSearchResults = [...this.searchResults];
      });
    } else {
      this.searchResults = [];
      this.originalSearchResults = [];
      this.hasSearched = false;
    }
  }

  private filterEvents(events: CalendarEvent[], term: string): any[] {
    const lowerTerm = term.toLowerCase();

    return events
      .filter((event) => {
        if (!event.extendedProps) return false;

        const patientName =
          event.extendedProps.patientName?.toLowerCase() || "";
        const serviceName =
          (event.extendedProps["serviceName"] as string)?.toLowerCase() || "";
        const doctor = event.extendedProps.doctor?.toLowerCase() || "";
        const clinic = event.extendedProps.clinic?.toLowerCase() || "";

        return (
          patientName.includes(lowerTerm) ||
          serviceName.includes(lowerTerm) ||
          doctor.includes(lowerTerm) ||
          clinic.includes(lowerTerm)
        );
      })
      .map((event) => this.mapEventToSearchResult(event));
  }

  private mapEventToSearchResult(event: CalendarEvent): any {
    const startDate = new Date(event.start);
    const endDate = event.end
      ? new Date(event.end)
      : new Date(startDate.getTime() + 3600000);

    const startTime = startDate.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = endDate.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: event.id || "",
      patient: event.extendedProps?.patientName || "Paziente sconosciuto",
      doctor: event.extendedProps?.doctor || "Dottore non specificato",
      room: event.extendedProps?.clinic || "Stanza non specificata",
      time: `${startTime} - ${endTime}`,
      treatment:
        (event.extendedProps?.["category"] as string) ||
        "Trattamento non specificato",
      details: (event.extendedProps?.["serviceName"] as string) || "",
      status: this.determineStatus(event),
    };
  }

  private determineStatus(event: CalendarEvent): string {
    // You can implement logic to determine the status based on event properties
    // For now, let's use a simple random assignment
    const statuses = ["scheduled", "in-progress", "completed"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  toggleFilterModal(): void {
    if (!this.showFilterModal) {
      this.backupFilters = {
        selectedOperators: this.selectedOperators,
        selectedChairs: this.selectedChairs,
        selectedStates: this.selectedStates,
      };

      this.tempFilters = {
        selectedOperators: this.selectedOperators,
        selectedChairs: this.selectedChairs,
        selectedStates: this.selectedStates,
      };
    }
    this.showFilterModal = !this.showFilterModal;
  }

  updateOperators(event: any): void {
    this.tempFilters.selectedOperators = event.value;
  }

  updateChairs(event: any): void {
    this.tempFilters.selectedChairs = event.value;
  }

  updateStates(event: any): void {
    this.tempFilters.selectedStates = event.value;
  }

  cancelFilters(): void {
    // Ripristina i valori temporanei ai valori di backup
    this.tempFilters = {
      selectedOperators: this.backupFilters.selectedOperators,
      selectedChairs: this.backupFilters.selectedChairs,
      selectedStates: this.backupFilters.selectedStates,
    };

    this.showFilterModal = false;
  }

  applyFilters(): void {
    this.selectedOperators = this.tempFilters.selectedOperators;
    this.selectedChairs = this.tempFilters.selectedChairs;
    this.selectedStates = this.tempFilters.selectedStates;

    this.filterSearchResults();
    this.showFilterModal = false;
  }

  filterSearchResults(): void {
    this.searchResults = [...this.originalSearchResults];

    if (this.selectedOperators || this.selectedChairs || this.selectedStates) {
      console.log(
        "Applying filters:",
        this.selectedOperators,
        this.selectedChairs,
        this.selectedStates
      );

      this.searchResults = this.searchResults.filter((result) => {
        const doctorMatch =
          !this.selectedOperators ||
          result.doctor.includes(this.selectedOperators.name);

        const roomMatch =
          !this.selectedChairs ||
          result.room.includes(this.selectedChairs.name);

        const statusMatch =
          !this.selectedStates ||
          result.status.includes(this.selectedStates.label.toLowerCase());

        return doctorMatch && roomMatch && statusMatch;
      });
    }
  }

  clearSearch(): void {
    this.searchQuery = "";
    this.searchResults = [];
    this.hasSearched = false;
  }
}
