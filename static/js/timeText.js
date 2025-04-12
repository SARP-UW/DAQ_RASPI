/**
 * TODO
 */
function updateTimeText() {
  const date = new Date(); 
  let hour = date.get_hour();

  const periodStr = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;

  const fmtHour = String(hour).padStart(2, '0');
  const fmtMin = String(date.getMinutes()).padStart(2, '0');
  const fmtSec = String(date.getSeconds()).padStart(2, '0');

  let timeTextElement = document.getElementById('time-text');
  timeTextElement.innerText = `${fmtHour}:${fmtMin}:${fmtSec} ${am_pm_str}`;
  setTimeout(updateTimeText, 1000);
}

// Start updating UI elements once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateTimeText();
});