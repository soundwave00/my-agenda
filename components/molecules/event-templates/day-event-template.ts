export const renderTimeGridDayEvent = (
  patientName: string,
  chair: string,
  serviceName: string,
  notes: string,
  startTime: string,
  endTime: string,
  backgroundColor: string,
  alertButtons: string
) => {
  return {
    html: `<div class="event-container" style="background-color: ${backgroundColor}">
        <div class="alert-container">
          <div class="flex justify-content-between align-items-center w-full">
            <span class="text-xl">${patientName}</span>
            <span class="text-md flex align-items-center gap-2">
              <img class="imported-icon" src="../../../../assets/layout/images/chair-white.svg" /> 
              ${chair}
            </span>
          </div>
        </div>
        <div class="w-full px-1 flex align-items-start justify-content-between">
          <div class="flex flex-column gap-2">
            <div>
              <span class="">${serviceName}</span>
            </div>
            <div>
              <span class="">${notes}</span>
            </div>
          </div>
          <div class="flex gap-2 time-slot-container">
              <span style="color: ${backgroundColor}">${startTime}</span>
              <span style="color: ${backgroundColor}">${endTime}</span>
          </div>
        </div>
        <div>${alertButtons}</div>
      </div>`,
  };
};
