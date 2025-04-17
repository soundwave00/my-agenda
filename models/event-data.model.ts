export interface EventData {
  patientName: string;
  phoneNumber: string;
  clinic: string;
  doctor: string;
  visitDate: string;
  startHour: string;
  endHour: string;
  serviceName: string;
  notes: string;
  [key: string]: any;
}
