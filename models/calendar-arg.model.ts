import { CalendarEvent } from "./calendar-event.model";

export type CalendarArgument = {
  event: CalendarEvent;
  view: ViewData;
  timeText: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  isDraggable: boolean;
  isStartResizable: boolean;
  isEndResizable: boolean;
  isMirror: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPast: boolean;
  isFuture: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
};

export type ViewLocaleOptions = {
  codeArg: string;
  codes: string[];
  week: {
    dow: number;
    doy: number;
  };
  simpleNumberFormat: object;
  options: {
    direction: string;
    buttonText: Record<string, string>;
    weekText: string;
    weekTextLong: string;
    closeHint: string;
    timeHint: string;
    eventHint: string;
    allDayText: string;
    moreLinkText: string;
    noEventsText: string;
    buttonHints: Record<string, string>;
    viewHint: string;
    navLinkHint: string;
  };
};

export type ViewDateEnv = {
  timeZone: string;
  canComputeOffset: boolean;
  calendarSystem: object;
  locale: ViewLocaleOptions;
  weekDow: number;
  weekDoy: number;
  weekText: string;
  weekTextLong: string;
  cmdFormatter: null | string;
  defaultSeparator: string;
};

export type ViewData = {
  type: string;
  dateEnv: ViewDateEnv;
};
