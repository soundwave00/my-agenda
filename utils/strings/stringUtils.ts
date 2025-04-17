import { state } from "@angular/animations";
import { CalendarEventState } from "../../models/calendar-event-state.model";

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getEventStateKey(value: number): string | undefined {
  return Object.entries(CalendarEventState).find(
    ([key, val]) => val === value
  )?.[0]; // Prende solo la chiave se trova una corrispondenza
}

export function getStateIcon(stateValue: number): string {
  const iconMap: Record<number, string> = {
    1: "../../../../assets/layout/images/event-states/tick-white.svg", // Confermato
    2: "../../../../assets/layout/images/event-states/absent-white.svg", // Assente
    3: "../../../../assets/layout/images/event-states/arrived-white.svg", // Arrivato
    4: "../../../../assets/layout/images/event-states/in-treatment-white.svg", // InCura
    5: "../../../../assets/layout/images/event-states/cancel-white.svg", // Annullato
    6: "../../../../assets/layout/images/event-states/waiting-white.svg", // InAttesa
    7: "../../../../assets/layout/images/event-states/completed-white.svg", // Terminato
    8: "../../../../assets/layout/images/event-states/urgent-white.svg", // Urgente
    9: "../../../../assets/layout/images/event-states/postponed-white.svg", // Rinviato
    10: "../../../../assets/layout/images/event-states/pending-white.svg", // InAttesaDiConferma
    11: "../../../../assets/layout/images/event-states/no-show-white.svg", // NonPresentatoNonArrivato
    12: "../../../../assets/layout/images/event-states/ready-white.svg", // Pronto
    13: "../../../../assets/layout/images/event-states/delayed-white.svg", // InRitardo
  };

  return (
    iconMap[stateValue] ||
    "../../../../assets/layout/images/event-states/default-white.svg"
  );
}

export function getStateEvent(stateValue: number): string {
  let stateEvent: string;
  switch (stateValue) {
    case 11:
      stateEvent = "Non Presentato/Non Arrivato";
      break;
    default:
      stateEvent = CalendarEventState[stateValue]
        .replace(/([A-Z])/g, " $1")
        .trim();
      break;
  }
  return stateEvent;
}

export function getStateBackground(stateValue: number): string | null {
  if ([2, 6, 10].includes(stateValue)) {
    return `repeating-linear-gradient(
      -30deg,
      rgba(200, 200, 200, .2) 0px,
      rgba(200, 200, 200, .5) 1px,
      rgba(150, 150, 150, .3) 11.5px,
      rgba(150, 150, 150, .7) 16px

    )`; // Linee diagonali alternate
  }
  return null;
}
export function getStateBackgroundTopbar(
  stateValue: number,
  backgroundColor: string
): string {
  if ([5, 9, 11].includes(stateValue)) {
    return addOpacityToColor(backgroundColor, 0.65);
  } else {
    return backgroundColor;
  }
}

// Helper function to add opacity to a color
function addOpacityToColor(color: string, opacity: number): string {
  // For hex colors
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // For rgb colors
  else if (color.startsWith("rgb(")) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${opacity})`;
    }
  }
  // For rgba colors
  else if (color.startsWith("rgba(")) {
    return color.replace(/[\d\.]+\)$/, `${opacity})`);
  }

  return color;
}

export function getRandomBackgroundColor(): string {
  const colors = ["#EC8206", "#5C8725", "#338aff"];
  return colors[Math.floor(Math.random() * colors.length)];
}
