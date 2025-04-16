/*
 * Copyright (C) 2025 - SARP UW
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.html>.
 *
 * Author: Aaron McBride
 * Brief: Logic for updating time text in the UI.
 */

/**
 * Updates the time text in the UI to display the current
 * time in the format HH:MM:SS AM/PM.
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