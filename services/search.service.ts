import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { CalendarService } from "./calendar.service";
import { SearchResult } from "../models/search-result.model";
import { CalendarEvent } from "../models/calendar-event.model";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private resultsSubject = new BehaviorSubject<SearchResult[]>([]);
  public results$ = this.resultsSubject.asObservable();
  private searchTimeout: any;

  constructor(private calendarService: CalendarService) {}

  search(term: string): void {
    // Cancella il timeout precedente se esiste
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Se il termine è troppo corto, pulisci i risultati
    if (!term || term.length < 3) {
      this.resultsSubject.next([]);
      return;
    }

    // Imposta un nuovo timeout (2 secondi)
    this.searchTimeout = setTimeout(() => {
      this.calendarService.getEvents().subscribe((events) => {
        const filteredResults = this.filterEvents(events, term);
        this.resultsSubject.next(filteredResults);
      });
    }, 2000);
  }

  private filterEvents(events: CalendarEvent[], term: string): SearchResult[] {
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

  private mapEventToSearchResult(event: CalendarEvent): SearchResult {
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
      patientName: event.extendedProps?.patientName || "Paziente sconosciuto",
      time: `${startTime} - ${endTime}`,
      serviceName: (event.extendedProps?.["serviceName"] as string) || "",
      serviceCategory: (event.extendedProps?.["category"] as string) || "",
      description: (event.extendedProps?.["notes"] as string) || "",
      backgroundColor:
        (event.extendedProps?.["backgroundColor"] as string) || "#cccccc",
    };
  }
}
