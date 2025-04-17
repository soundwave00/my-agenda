export const renderDayGridMonthEvent = (
  patientName: string,
  backgroundColor: string,
  startTime: string,
  tickButton: string,
  alertButtons: string
) => {
  return {
    html: `<div class="event-container" style="background-color: ${backgroundColor}">
               <div class="event-content">
                 <span class="status-icon">${tickButton}</span>
                 <span class="event-time">${startTime}</span>
                 <span class="patient-name"><b>${patientName}</b></span>
                 <div>${alertButtons}</div>
               </div>
             </div>`,
  };
};
