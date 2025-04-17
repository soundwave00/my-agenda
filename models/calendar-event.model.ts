import { CalendarEventState } from "./calendar-event-state.model";

export interface CalendarEvent {
  id?: string;
  resourceId?: string;
  title: string;
  start: string; // es. ISO string "2025-02-10T14:00:00"
  end?: string;
  allDay?: boolean;
  description?: string;
  location?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    operatorAvailable?: boolean;
    clinic?: string;
    doctor?: string;
    chair?: string;
    location?: string;
    patientName?: string;
    states?: CalendarEventState;
    notes?: string;
    phoneNumber?: string;
    serviceName?: string;
    alert?: string[];
    additionalServices?: {
      name: string;
      description: string;
    }[];
    [key: string]: any;
  };
}
