import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getStateIcon,
  getStateEvent,
  getStateBackground,
  getStateBackgroundTopbar,
} from "../utils/strings/stringUtils";
import { CalendarArgument } from "./calendar-arg.model";
import { renderDayGridMonthEvent } from "../components/molecules/event-templates/month-event-template";
import { renderTimeGridDayEvent } from "../components/molecules/event-templates/day-event-template";
import { renderDefaultEvent } from "../components/molecules/event-templates/default-event-template";

export const calendarOptions: CalendarOptions = {
  schedulerLicenseKey: "0217409818-fcs-1550140800",
  initialView: "timeGridDay",
  allDaySlot: false,
  dayCellContent: (arg: any) => arg.dayNumberText,
  dayCellDidMount: (info) => {
    const frame = info.el.querySelector(".fc-daygrid-day-frame") as HTMLElement;

    if (frame && !frame.querySelector(".dot-button")) {
      const dotDiv = document.createElement("div");
      dotDiv.className = "dot-button";
      dotDiv.title = "Azioni";
      dotDiv.textContent = "⋯";

      dotDiv.style.position = "absolute";
      dotDiv.style.bottom = "5px";
      dotDiv.style.right = "5px";
      dotDiv.style.fontSize = "16px";
      dotDiv.style.color = "#666";
      dotDiv.style.cursor = "pointer";
      dotDiv.style.zIndex = "10";

      // dotDiv.addEventListener("click", (event) => {
      //   event.stopPropagation();
      //   event.preventDefault();
      //   console.log("Tre puntini cliccati su", info.date.toISOString());
      // });

      frame.style.position = "relative";
      frame.appendChild(dotDiv);
    }
  },
  locale: "it",
  dayHeaderFormat: { weekday: "long", day: "numeric" },
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "",
    right: "",
  },
  events: [],
  contentHeight: "auto",
  allDayText: "",
  slotMinTime: "07:00:00",
  slotMaxTime: "20:00:00",
  slotDuration: "00:15:00",
  slotLabelInterval: "01:00:00",
  slotLabelFormat: {
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: true,
    meridiem: false,
    hour12: false,
  },
  editable: true,
  eventDurationEditable: true,
  droppable: true,
  eventContent: (arg: CalendarArgument) => {
    if (!arg.event.extendedProps) return;

    const { patientName, backgroundColor, chair, serviceName, notes } =
      arg.event.extendedProps;

    if (arg.view.type === "dayGridMonth") {
      const startTime = arg.event.start
        ? new Date(arg.event.start).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
      const stateValue = arg.event.extendedProps.states!;
      const stateIcon = getStateIcon(stateValue);
      const stateEvent = getStateEvent(stateValue);
      const tickButton = `<img class="imported-icon" src="${stateIcon}" title="${stateEvent}"/>`;
      const alertButtons = arg.event.extendedProps.alert
        ? arg.event.extendedProps.alert
            .map((alertItem: string) => {
              let iconClass = "";

              switch (alertItem) {
                case "Anamnesi":
                  iconClass =
                    "../../../../assets/layout/images/chair-white.svg";
                  break;
                case "Malattie infettive":
                  iconClass =
                    "../../../../assets/layout/images/group-white.svg";
                  break;
                default:
                  iconClass =
                    "../../../../assets/layout/images/alert-white.svg";
              }

              return `<button class="alert-button" title="${alertItem}">
                        <img class="imported-icon" src="${iconClass}" />
                      </button>`;
            })
            .join(" ")
        : "";
      return renderDayGridMonthEvent(
        patientName!,
        backgroundColor,
        startTime,
        tickButton,
        alertButtons
      );
    } else if (arg.view.type === "timeGridDay") {
      const startTime = arg.event.start
        ? new Date(arg.event.start).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
      const endTime = arg.event.end
        ? new Date(arg.event.end).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      const alertButtons = arg.event.extendedProps.alert
        ? arg.event.extendedProps.alert
            .map((alertItem: string) => {
              let iconClass = "";

              switch (alertItem) {
                case "Malattie infettive":
                  iconClass =
                    "../../../../assets/layout/images/group-white.svg";
                  break;
                case "Anamnesi":
                  iconClass =
                    "../../../../assets/layout/images/chair-white.svg";
                  break;
                default:
                  iconClass =
                    "../../../../assets/layout/images/alert-white.svg";
              }

              return `<button class="alert-button" title="${alertItem}">
                        <img class="imported-icon" src="${iconClass}" />
                      </button>`;
            })
            .join(" ")
        : "";

      return renderTimeGridDayEvent(
        patientName!,
        chair!,
        serviceName!,
        notes!,
        startTime,
        endTime,
        backgroundColor,
        alertButtons
      );
    } else {
      const stateValue = arg.event.extendedProps.states!;
      const stateIcon = getStateIcon(stateValue);
      const stateBackground = getStateBackground(stateValue);
      const stateBackgroundTopBar = getStateBackgroundTopbar(
        stateValue,
        arg.event.extendedProps["backgroundColor"]
      );
      const stateEvent = getStateEvent(stateValue);

      const tickButton = `<button class="alert-button" title="${stateEvent}">
      <img class="imported-icon" src="${stateIcon}" />
    </button>`;

      const alertButtons = arg.event.extendedProps.alert
        ? arg.event.extendedProps.alert
            .map((alertItem: string) => {
              let iconClass = "";

              switch (alertItem) {
                case "Anamnesi":
                  iconClass =
                    "../../../../assets/layout/images/chair-white.svg";
                  break;
                case "Malattie infettive":
                  iconClass =
                    "../../../../assets/layout/images/group-white.svg";
                  break;
                default:
                  iconClass =
                    "../../../../assets/layout/images/alert-white.svg";
              }

              return `<button class="alert-button" title="${alertItem}">
                        <img class="imported-icon" src="${iconClass}" />
                      </button>`;
            })
            .join(" ")
        : "";

      return renderDefaultEvent(
        tickButton,
        alertButtons,
        stateBackground!,
        stateBackgroundTopBar,
        patientName!
      );
    }
  },
  hiddenDays: [0, 6],
  //   eventClick: (clickInfo) => this.onEventClick(clickInfo),
  //   select: (selectInfo) => this.onSelectDate(selectInfo),
};
