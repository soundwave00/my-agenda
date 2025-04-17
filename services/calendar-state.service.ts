import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarStateService {
  private selectedDateSubject = new BehaviorSubject<Date | null>(null);
  public selectedDate$ = this.selectedDateSubject.asObservable();
  
  constructor() { }
  
  setSelectedDate(date: Date): void {
    this.selectedDateSubject.next(date);
  }
  
  getSelectedDate(): Date | null {
    return this.selectedDateSubject.value;
  }
  
  resetSelectedDate(): void {
    this.selectedDateSubject.next(null);
  }
}