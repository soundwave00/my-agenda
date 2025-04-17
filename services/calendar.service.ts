// services/calendar.service.ts
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { CalendarEvent } from "../models/calendar-event.model";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private events: CalendarEvent[] = [
    {
      id: "0",
      title: "Evento 1",
      start: "2025-04-26T09:00:00",
      end: "2025-04-26T12:00:00",
      extendedProps: {
        patientName: "Mario Rossi",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Lavaggio dentale",
        phoneNumber: "340 444 5203",
        doctor: "Anna Bianchi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 7,
        backgroundColor: "#DE5E74",
      },
    },
    {
      id: "1",
      title: "Evento 1",
      start: "2025-04-25T09:00:00",
      end: "2025-04-25T12:00:00",
      extendedProps: {
        patientName: "Mario Rossi",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Lavaggio dentale",
        phoneNumber: "340 444 5203",
        doctor: "Mario Rossi",
        clinic: "Centro Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 2,
        backgroundColor: "#EC8206",
      },
    },
    {
      id: "20",
      title: "Evento 20",
      start: "2025-04-25T09:00:00",
      end: "2025-04-25T12:00:00",
      extendedProps: {
        patientName: "Mario Rossi",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Lavaggio dentale",
        phoneNumber: "340 444 5203",
        doctor: "Mario Rossi",
        clinic: "Centro Aurora",
        chair: "Poltrona 2",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 4,
        backgroundColor: "#EC8206",
      },
    },
    {
      id: "21",
      title: "Evento 21",
      start: "2025-04-25T09:00:00",
      end: "2025-04-25T12:00:00",
      extendedProps: {
        patientName: "Mario Rossi",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Lavaggio dentale",
        phoneNumber: "340 444 5203",
        doctor: "Mario Rossi",
        clinic: "Clinica San Marco",
        chair: "Poltrona 3",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 5,
        backgroundColor: "#5C8725",
      },
    },
    {
      id: "2",
      title: "Evento 1",
      start: "2025-04-28T09:00:00",
      end: "2025-04-28T13:00:00",
      extendedProps: {
        patientName: "Pippo",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Lavaggio dentale",
        location: "Poltrona 1",
        phoneNumber: "340 444 5203",
        doctor: "Anna Bianchi",
        clinic: "Centro Aurora",
        chair: "Poltrona 4",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 6,
        backgroundColor: "#5C8725",
      },
    },
    {
      id: "3",
      title: "Evento 2",
      start: "2025-04-27T14:00:00",
      end: "2025-04-27T18:00:00",
      extendedProps: {
        patientName: "Luca Bianchi",
        priority: "Media",
        category: "Workshop",
        serviceName: "Otturazione Caria",
        location: "Sala 2",
        phoneNumber: "339 274 3342",
        doctor: "Mario Rossi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 5,
        backgroundColor: "#338aff",
      },
    },
    {
      id: "4",
      title: "Evento 3",
      start: "2025-04-01T10:00:00",
      end: "2025-04-01T12:00:00",
      extendedProps: {
        patientName: "Giovanni Verdi",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Devitalizzazione",
        phoneNumber: "340 123 4567",
        doctor: "Anna Bianchi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 2",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 8,
        backgroundColor: "#DE5E74",
      },
    },
    {
      id: "5",
      title: "Evento 4",
      start: "2025-04-01T14:00:00",
      end: "2025-04-01T16:00:00",
      extendedProps: {
        patientName: "Elena Neri",
        priority: "Bassa",
        category: "Visita",
        serviceName: "Sbiancamento",
        phoneNumber: "340 789 1234",
        doctor: "Mario Rossi",
        clinic: "Centro Salute",
        chair: "Poltrona 3",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 4,
        backgroundColor: "#EC8206",
      },
    },
    {
      id: "6",
      title: "Evento 5",
      start: "2025-04-13T09:00:00",
      end: "2025-04-13T12:00:00",
      extendedProps: {
        patientName: "Sara Bianchi",
        priority: "Alta",
        category: "Workshop",
        serviceName: "Estrazione",
        phoneNumber: "340 111 2233",
        doctor: "Anna Bianchi",
        clinic: "Centro Aurora",
        chair: "Poltrona 4",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 9,
        backgroundColor: "#5C8725",
      },
    },
    {
      id: "7",
      title: "Evento 6",
      start: "2025-04-13T13:00:00",
      end: "2025-04-13T15:00:00",
      extendedProps: {
        patientName: "Marco Blu",
        priority: "Media",
        category: "Meeting",
        serviceName: "Otturazione",
        phoneNumber: "340 444 3333",
        doctor: "Mario Rossi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 3,
        backgroundColor: "#338aff",
      },
    },
    {
      id: "8",
      resourceId: "op2",
      title: "Evento 7",
      start: "2025-04-14T08:30:00",
      end: "2025-04-14T11:00:00",
      extendedProps: {
        patientName: "Davide Gialli",
        priority: "Bassa",
        category: "Visita",
        serviceName: "Lavaggio dentale",
        phoneNumber: "340 555 1111",
        doctor: "Anna Bianchi",
        clinic: "Centro Salute",
        chair: "Poltrona 2",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 10,
        backgroundColor: "#DE5E74",
      },
    },
    {
      id: "9",
      resourceId: "op2",
      title: "Evento 8",
      start: "2025-04-14T13:00:00",
      end: "2025-04-14T16:00:00",
      extendedProps: {
        patientName: "Elena Neri",
        priority: "Alta",
        category: "Workshop",
        serviceName: "Otturazione",
        phoneNumber: "340 666 5555",
        doctor: "Mario Rossi",
        clinic: "Centro Aurora",
        chair: "Poltrona 3",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 11,
        backgroundColor: "#EC8206",
      },
    },
    {
      id: "10",
      title: "Evento 9",
      start: "2025-04-04T09:30:00",
      end: "2025-04-04T11:30:00",
      extendedProps: {
        patientName: "Sara Bianchi",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Sbiancamento",
        phoneNumber: "340 444 7777",
        doctor: "Anna Bianchi",
        clinic: "Centro Salute",
        chair: "Poltrona 4",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 12,
        backgroundColor: "#5C8725",
      },
    },
    {
      id: "11",
      title: "Evento 10",
      start: "2025-04-05T10:00:00",
      end: "2025-04-05T12:00:00",
      extendedProps: {
        patientName: "Giovanni Verdi",
        priority: "Bassa",
        category: "Workshop",
        serviceName: "Estrazione",
        phoneNumber: "340 111 4444",
        doctor: "Mario Rossi",
        clinic: "Centro Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 13,
        backgroundColor: "#338aff",
      },
    },
    {
      id: "12",
      title: "Evento 11",
      start: "2025-04-06T09:00:00",
      end: "2025-04-06T11:00:00",
      extendedProps: {
        patientName: "Francesca Rosso",
        priority: "Alta",
        category: "Visita",
        serviceName: "Visita controllo",
        phoneNumber: "340 888 2222",
        doctor: "Mario Rossi",
        clinic: "Centro Salute",
        chair: "Poltrona 2",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 12,
        backgroundColor: "#EC8206",
      },
    },
    {
      id: "13",
      title: "Evento 12",
      start: "2025-04-07T10:00:00",
      end: "2025-04-07T12:00:00",
      extendedProps: {
        patientName: "Claudio Viola",
        priority: "Bassa",
        category: "Workshop",
        serviceName: "Protesi",
        phoneNumber: "340 222 5555",
        doctor: "Anna Bianchi",
        clinic: "Centro Aurora",
        chair: "Poltrona 3",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 9,
        backgroundColor: "#338aff",
      },
    },
    {
      id: "14",
      title: "Evento 13",
      start: "2025-04-07T13:00:00",
      end: "2025-04-07T15:00:00",
      extendedProps: {
        patientName: "Anna Rossi",
        priority: "Alta",
        category: "Visita",
        serviceName: "Controllo annuale",
        phoneNumber: "340 444 8888",
        doctor: "Mario Rossi",
        clinic: "Centro Salute",
        chair: "Poltrona 4",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 5,
        backgroundColor: "#5C8725",
      },
    },
    {
      id: "15",
      title: "Evento 14",
      start: "2025-04-08T09:00:00",
      end: "2025-04-08T11:00:00",
      extendedProps: {
        patientName: "Simone Blu",
        priority: "Media",
        category: "Workshop",
        serviceName: "Impianto",
        phoneNumber: "340 333 6666",
        doctor: "Anna Bianchi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 2,
        backgroundColor: "#DE5E74",
      },
    },
    {
      id: "16",
      title: "Evento 15",
      start: "2025-04-09T13:00:00",
      end: "2025-04-09T15:00:00",
      extendedProps: {
        patientName: "Federica Verde",
        priority: "Bassa",
        category: "Visita",
        serviceName: "Controllo dentale",
        phoneNumber: "340 444 7777",
        doctor: "Mario Rossi",
        clinic: "Centro Salute",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 10,
        backgroundColor: "#338aff",
      },
    },
    {
      id: "17",
      title: "Evento 16",
      start: "2025-04-10T09:00:00",
      end: "2025-04-10T12:00:00",
      extendedProps: {
        patientName: "Francesco Neri",
        priority: "Alta",
        category: "Meeting",
        serviceName: "Faccette estetiche",
        phoneNumber: "340 666 4444",
        doctor: "Anna Bianchi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 11,
        backgroundColor: "#EC8206",
      },
    },
    {
      id: "18",
      title: "Evento 17",
      start: "2025-04-11T10:00:00",
      end: "2025-04-11T13:00:00",
      extendedProps: {
        patientName: "Giulia Gialli",
        priority: "Media",
        category: "Meeting",
        serviceName: "Controllo dentale",
        phoneNumber: "340 333 1111",
        doctor: "Mario Rossi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 12,
        backgroundColor: "#5C8725",
      },
    },
    {
      id: "19",
      title: "Evento 18",
      start: "2025-04-09T08:30:00",
      end: "2025-04-09T11:00:00",
      extendedProps: {
        patientName: "Antonio Neri",
        priority: "Alta",
        category: "Visita",
        serviceName: "Protesi",
        phoneNumber: "340 777 3333",
        doctor: "Anna Bianchi",
        clinic: "Centro Medico Aurora",
        chair: "Poltrona 1",
        notes: "note",
        alert: ["Anamnesi", "Malattie infettive"],
        states: 2,
        backgroundColor: "#DE5E74",
      },
    },
  ];

  constructor() {}

  /**
   * Recupera la lista di tutti gli eventi
   */
  getEvents(): Observable<CalendarEvent[]> {
    // In un caso reale faresti una chiamata HTTP, ad es.:
    // return this.http.get<CalendarEvent[]>('api/events');
    return of(this.events);
  }

  /**
   * Crea un nuovo evento
   */
  createEvent(eventData: CalendarEvent): Observable<CalendarEvent> {
    // In un caso reale: return this.http.post<CalendarEvent>('api/events', eventData);
    eventData.id = Math.random().toString(36).substring(2);
    this.events.push(eventData);
    return of(eventData);
  }

  /**
   * Aggiorna un evento esistente
   */
  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    // In a real case: return this.http.put<CalendarEvent>(`api/events/${event.id}`, event);
    // For now, simulate updating the event
    const index = this.events.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      this.events[index] = event;
    }
    return of(event);
  }

  /**
   * Elimina un evento dato il suo id
   */
  deleteEvent(id: string): Observable<void> {
    // In un caso reale: return this.http.delete<void>(`api/events/${id}`);
    this.events = this.events.filter((e) => e.id !== id);
    return of(void 0);
  }

  /**
   * Elimina un evento sorgente dato il suo id
   * @param sourceId L'ID dell'evento sorgente da eliminare
   * @returns Un Observable che completa quando l'eliminazione ha successo
   */
  deleteEventSource(sourceId: string): Observable<void> {
    // In un caso reale: return this.http.delete<void>(`api/events/source/${sourceId}`);
    // Per ora, simuliamo l'eliminazione dell'evento sorgente
    this.events = this.events.filter(
      (e) => e.extendedProps?.["sourceId"] !== sourceId
    );
    return of(void 0);
  }
}
