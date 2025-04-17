export const renderDefaultEvent = (
  tickButton: string,
  alertButtons: string,
  stateBackground: string,
  stateBackgroundTopBar: string,
  patientName: string
) => {
  return {
    html: `<div class="event-container" style="background: ${stateBackgroundTopBar}; position: relative; border-radius: 8px; overflow: hidden;">
            <div class="top-section flex justify-content-start align-items-center w-full gap-2 p-2">
              <div style="min-width: 20%; max-width: 30%; overflow: hidden; display: flex; align-items: center; flex: auto; justify-content: space-between;">
                ${tickButton} ${alertButtons}
              </div>
              <b class="patient-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;">${patientName}</b>
            </div>
            <div style="position: absolute; top: 36px; bottom: 0; left: 0; right: 0; background-image:${stateBackground}; background-color:${
      stateBackground ? "#fff" : "#ffffff4d"
    }; z-index: 1; border-radius: 8px;">
              <button class="bottom-bar-event" style="position: absolute; bottom: 4px; right: 4px; z-index: 2;">
                <img class="imported-icon" src="../../../../assets/layout/images/alert-white.svg" />
              </button>
            </div>
          </div>`,
  };
};
