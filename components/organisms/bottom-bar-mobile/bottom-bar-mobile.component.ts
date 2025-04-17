import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EventDialogService } from "../../../services/event-dialog.service";
import { CalendarEvent } from "../../../models/calendar-event.model";
import { CommandsMobileBottomBarEnum } from "../../../models/commands-mobile-bottom-bar-enum.model";
import { SelectButtonValues } from "../../../models/time-slot.model copy";
import { MegaMenuItem } from "primeng/api";

@Component({
  selector: "app-bottom-bar-mobile",
  templateUrl: "./bottom-bar-mobile.component.html",
  styleUrl: "./bottom-bar-mobile.component.scss",
})
export class BottomBarMobileComponent implements OnInit {
  @Input() commands: CommandsMobileBottomBarEnum[] | undefined;
  @Input() isCreateAppointmentVisible: boolean | undefined;
  @Output() goTodayClicked = new EventEmitter<void>();
  @Output() goNextClicked = new EventEmitter<void>();
  @Output() goPrevClicked = new EventEmitter<void>();
  @Output() goToEventDate = new EventEmitter<Date>();
  @Output() changeCalendarView = new EventEmitter<string>();

  event_date: Date | null = null;
  frequencyValue: SelectButtonValues = {
    imgSrc: "../../../assets/layout/images/calendar-week.svg",
    value: "timeGridWeek",
  };
  items: MegaMenuItem[] | undefined;
  showBottomBar = false;

  constructor(private eventDialogService: EventDialogService) {}

  ngOnInit() {
    this.event_date = new Date();
    if (this.commands != null && this.commands.length > 0) {
      if (this.items == null) this.items = [];
      this.commands.forEach((command) => {
        this.items?.push({ id: command.toString(), visible: true });
      });
    }
  }

  onGoPrev() {
    this.updateEventDate(false);
    this.goPrevClicked.emit();
  }

  onGoNext() {
    this.updateEventDate(true);
    this.goNextClicked.emit();
  }

  onSetEventDate() {
    if (this.event_date) {
      this.goToEventDate.emit(this.event_date);
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
}
