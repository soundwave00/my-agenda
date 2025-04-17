import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { CalendarEvent } from "../models/calendar-event.model";

@Injectable({
  providedIn: "root",
})
export class EventDialogService {
  private showModalNewSubject = new BehaviorSubject<boolean>(false);
  private showModalViewSubject = new BehaviorSubject<boolean>(false);
  private currentEventSubject = new BehaviorSubject<CalendarEvent | null>(null);
  private eventCreatedSubject = new Subject<CalendarEvent>();
  private eventUpdatedSource = new Subject<CalendarEvent>();
  eventUpdated$ = this.eventUpdatedSource.asObservable();

  private lockedOperatorIdSubject = new BehaviorSubject<string | null>(null);
  // Se ti serve il nome:
  private lockedOperatorNameSubject = new BehaviorSubject<string | null>(null);

  lockedOperatorId$ = this.lockedOperatorIdSubject.asObservable();
  lockedOperatorName$ = this.lockedOperatorNameSubject.asObservable();

  public showModalNew$: Observable<boolean> =
    this.showModalNewSubject.asObservable();
  public showModalView$: Observable<boolean> =
    this.showModalViewSubject.asObservable();
  public currentEvent$: Observable<CalendarEvent | null> =
    this.currentEventSubject.asObservable();
  public eventCreated$: Observable<CalendarEvent> =
    this.eventCreatedSubject.asObservable();

  constructor() {}

  /**
   * Apre il dialog degli eventi con l'evento specificato
   */
  openNewEventDialog(
    event: CalendarEvent,
    lockedOperatorId?: string | null,
    lockedOperatorName?: string | null
  ): void {
    this.lockedOperatorIdSubject.next(lockedOperatorId ?? null); // NEW
    this.lockedOperatorNameSubject.next(lockedOperatorName ?? null); // NEW

    this.showModalNewSubject.next(true);
    this.currentEventSubject.next(event);
  }

  /**
   * Chiude il dialog degli eventi
   */
  closeNewEventDialog(): void {
    this.showModalNewSubject.next(false);
    this.currentEventSubject.next(null);
    /* ripulisci */
    this.lockedOperatorIdSubject.next(null); // NEW
    this.lockedOperatorNameSubject.next(null); // NEW
  }

  /**
   * Apre il dialog degli eventi con l'evento specificato
   */
  openViewEventDialog(event: CalendarEvent): void {
    this.showModalViewSubject.next(true);
    this.currentEventSubject.next(event);
  }

  /**
   * Chiude il dialog degli eventi
   */
  closeViewEventDialog(): void {
    this.showModalViewSubject.next(false);
    this.currentEventSubject.next(null);
  }

  /**
   * Notifica che un evento è stato creato
   */
  notifyEventCreated(event: CalendarEvent): void {
    this.eventCreatedSubject.next(event);
  }

  /**
   * Restituisce lo stato corrente del dialog
   */
  getDialogState(): {
    showModalNew: boolean;
    showModalView: boolean;
    currentEvent: CalendarEvent | null;
  } {
    return {
      showModalNew: this.showModalNewSubject.value,
      showModalView: this.showModalViewSubject.value,
      currentEvent: this.currentEventSubject.value,
    };
  }

  // Add a new subject to notify when calendar should refresh
  private refreshCalendarSubject = new Subject<void>();
  refreshCalendar$ = this.refreshCalendarSubject.asObservable();

  // Method to trigger calendar refresh
  refreshCalendar() {
    this.refreshCalendarSubject.next();
  }

  updateEvent(event: CalendarEvent): void {
    this.eventUpdatedSource.next(event);
  }
}
