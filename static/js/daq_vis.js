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
 * Brief: Javascript for DAQ visualization website.
 */

/**************************************************************************************************
 * Constants/Configuration
 **************************************************************************************************/

// Delay of chart display.
const CHART_DELAY = 1000;

// Maximum number of sources per chart.
const MAX_CHART_SOURCES = 8;

// List of colors for traces on chart.
const COLOR_LIST = [
  '#bbbbbb', 
  "#ff0000", 
  "#ff6200", 
  "#ffcc00", 
  "#80ff00",
  "#00ff7b", 
  "#00f2ff", 
  "#0077ff", 
  "#9000ff", 
  "#e600ff", 
  "#ff006a"
];

// Configuration options for smoothie chart.
const CHART_OPTIONS = {
  tooltip: true,
  responsive: true,
  maxValueScale: 2,
  minValueScale: 2,
  enableDpiScaling: false,
  scaleSmoothing: 0.3,
  tooltipLine: { 
    lineWidth: 3, 
    strokeStyle: '#BBBBBB' 
  },
  grid: { 
    strokeStyle: '#555555', 
    fillStyle: '#000000', 
    lineWidth: 1 
  },
  labels: { 
    fillStyle: '#ffffff',
    showIntermediateLabels: true
  }
};

/**************************************************************************************************
 * Global Variables
 **************************************************************************************************/

// True if initialization message has NOT been received.
var initMsgFlag = true;

// List of source objects (represent data source on socket).
var sourceList = [];

// List of display objects (charts/numeric displays).
var displayList = [];

/**************************************************************************************************
 * Custom Callback Functions for Smoothie Chart
 **************************************************************************************************/

// Tooltip formatter for smoothie chart (adds labels).
CHART_OPTIONS.tooltipFormatter = function(timestamp, data) {

  // Calculate time difference of data point from current time.
  const now = new Date().getTime();
  const timeDiff = now - timestamp;
  
  // Format time difference
  let formattedDiff;
  if (timeDiff < 1000) {
    formattedDiff = 'just now';
  } else if (timeDiff < 60000) {
    const seconds = Math.floor(timeDiff / 1000);
    formattedDiff = seconds + 's ago';
  } else if (timeDiff < 3600000) {
    const minutes = Math.floor(timeDiff / 60000);
    formattedDiff = minutes + 'm ago';
  } else {
    const hours = Math.floor(timeDiff / 3600000);
    formattedDiff = hours + 'h ago';
  }
  // Create HTML string for tooltip
  let html = '<div>' + formattedDiff + '</div>';

  // Iterate through data and add label and value to tooltip  
  for (let i = 0; i < data.length; i++) {
    let label = data[i].series.options.tooltipLabel || data[i].series.options.strokeStyle;
    let value = parseFloat(data[i].value).toFixed(2);
    let unit = '';
    
    // Find the source object to get its unit.
    for (let j = 0; j < sourceList.length; j++) {
      if (sourceList[j].name === label) {
        unit = sourceList[j].unit;
        break;
      }
    }
    // Add label and value to tooltip
    html += '<div style="color:' + data[i].series.options.strokeStyle + '">' + 
        label + ': ' + value + unit + '</div>';
  }
  // Return HTML string
  return html;
};

/**************************************************************************************************
 * Clock Update Logic (Header)
 **************************************************************************************************/

// Update the clock in the header
function updateClock() {

  // Get current time and display element
  const now = new Date();
  const timeDisplay = document.getElementById('header-time');
  
  // Convert to 12-hour format with AM/PM
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  // Format time string
  const formattedHours = String(hours).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Update time text
  timeDisplay.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

// Update the clock on load and then every second
document.addEventListener('DOMContentLoaded', function() {
  updateClock();
  setInterval(updateClock, 1000);
});

/**************************************************************************************************
 * Window Resizing Logic
 **************************************************************************************************/

// Resizes display containers to fit content.
function resizeDisplays() {

  // Iterate through list of displays and get container for each.
  for(let displayObj of displayList) {
    let container = displayObj.container;

    // Get container HTML elements.    
    const canvas = container.querySelector('.display-canvas');
    const numGrid = container.querySelector('.display-num-grid');
    const numValues = numGrid.querySelectorAll('.num-container');
    const title = numGrid.querySelector('.display-title');
        
    // Determine dimensions of title.
    const titleRect = title.getBoundingClientRect();
    const titleHeight = titleRect.height;
    const titleStyles = window.getComputedStyle(title);
    const titleMarginBottom = parseFloat(titleStyles.marginBottom);
    
    // Calculate space needed for values
    let valuesHeight = 0;
    numValues.forEach(value => {
      const valueRect = value.getBoundingClientRect();
      valuesHeight += valueRect.height + 2;
      const valueStyle = window.getComputedStyle(value);
      valuesHeight += parseFloat(valueStyle.marginBottom);
    });
    // Add container padding
    const numGridStyles = window.getComputedStyle(numGrid);
    const containerPaddingTop = parseFloat(numGridStyles.paddingTop);
    const containerPaddingBottom = parseFloat(numGridStyles.paddingBottom);
    
    // Calculate total height needed
    const requiredHeight = Math.ceil(
      titleHeight + titleMarginBottom + valuesHeight + 
      containerPaddingTop + containerPaddingBottom + 10
    );
    // Apply calculated height (with minimum height).
    const minHeight = 70;
    const containerHeight = Math.max(requiredHeight, minHeight);
    const finalHeight = Math.ceil(containerHeight) + 5;
    container.style.height = finalHeight + 'px';
    canvas.style.height = finalHeight + 'px';
    canvas.height = finalHeight;
    numGrid.style.height = finalHeight + 'px';
  }

}

// Trigger resizeDisplays on window resize.
window.addEventListener('resize', resizeDisplays);

/**************************************************************************************************
 * Socket Message Handlers
 **************************************************************************************************/

// Handler for initialization message.
function handleInitMessage(message) {
  initMsgFlag = false;
  
  // Iterate through list of sources
  for (let sourceInfo of message.split(":")) {

    // Parse information for current source.
    let splitInfo = sourceInfo.split(",");
    let sourceName = splitInfo[0];
    let sourceUnit = splitInfo[1];
    let displayNames = splitInfo.slice(2);

    // Ensure all information for source is valid.
    if (sourceName === undefined || sourceUnit === undefined || 
        displayNames.length === 0) {
      console.log("Invalid source information");
    }
    // Create time series and source object and add it to source list.
    let sourceTimeSeries = new TimeSeries();
    let sourceObj = {
      name: sourceName, 
      unit: sourceUnit,
      timeSeries: sourceTimeSeries, 
      numContainerList: []
    };
    sourceList.push(sourceObj);

    // Iterate through list of displays for current source.
    for (let displayName of displayNames) {
      let displayObj = displayList.find(element => element.name === displayName);

      // Create display object if not found in display list.
      if (displayObj === undefined) {

        // Create container to hold all display elements.
        let displayContainer = document.createElement("div");
        displayContainer.className = "display-container";
        displayContainer.id = displayName + "-display-container";
        document.getElementById("display-grid").appendChild(displayContainer);

        // Create canvas for chart (smoothie chart).
        let displayCanvas = document.createElement("canvas");
        displayCanvas.className = "display-canvas";
        displayCanvas.id = displayName + "-display-canvas";
        displayContainer.appendChild(displayCanvas);

        // Create container to hold numeric displays.
        let displayNumGrid = document.createElement("div");
        displayNumGrid.className = "display-num-grid";
        displayNumGrid.id = displayName + "-display-num-grid";
        displayContainer.appendChild(displayNumGrid);

        // Create div for display title.
        let displayTitle = document.createElement("div");
        displayTitle.className = "display-title";
        displayTitle.id = displayName + "-display-title";
        displayTitle.innerText = displayName;
        displayNumGrid.appendChild(displayTitle);

        // Create new SmoothieChart object and stream it to above canvas.
        let displayChart = new SmoothieChart(CHART_OPTIONS);
        displayChart.streamTo(displayCanvas, CHART_DELAY);

        // Create display object and add it to display list.
        let newDisplayObj = { 
          name: displayName, 
          chart: displayChart, 
          container: displayContainer
        };
        displayList.push(newDisplayObj);
        displayObj = newDisplayObj;
      }
      // Ensure number of sources per chart does not exceed maximum value.
      if (displayObj.chart.seriesSet.length >= MAX_CHART_SOURCES) {
        console.log("Maximum number of sources per chart exceeded");
      }
      // Find color not used for trace on chart.
      let sourceColor = null;
      let colorOffset = Math.floor(Math.random() * COLOR_LIST.length);
      for (let i = 0; i < COLOR_LIST.length; i++) {
        let curColor = COLOR_LIST[(i + colorOffset) % COLOR_LIST.length];
        if (!displayObj.chart.seriesSet.find(curSeries => 
            curSeries.options.strokeStyle === curColor)) {
          sourceColor = curColor;
          break;
        }
      }
      // Add time series for source to chart (this holds the data from the source).
      displayObj.chart.addTimeSeries(sourceTimeSeries, {
        tooltipLabel: sourceName,
        strokeStyle: sourceColor, 
        lineWidth: 2
      });
      // Create container to hold text which shows current value of source.
      let numContainer = document.createElement("div");
      numContainer.className = "num-container";
      numContainer.id = displayName + "-" + sourceName + "-num-container";
      numContainer.style.color = sourceColor;

      // Add above container to grid of numeric displays for current display.
      displayObj.container.querySelector(".display-num-grid").appendChild(numContainer);
      sourceObj.numContainerList.push(numContainer);
    }
  }
  // Resize all displays to fit content (specifically text).
  resizeDisplays();
}

// Handler for data message (contains new data for source).
function handleDataMessage(message) {

  // Parse message to get source name and data string.
  let splitMsg = message.split(":");
  let sourceName = splitMsg[0];
  let dataStr = splitMsg[1].split(",");

  // Extract time and value from data string (*1000 NEEDED to convert time).
  let timeValue = parseFloat(dataStr[0]) * 1000;
  let dataValue = parseFloat(dataStr[1]);

  // Find source object in source list or throw error if not found.
  let sourceObj = sourceList.find(element => element.name === sourceName);
  if (sourceObj === undefined) {
    console.log("Source object not found in source list");
  }
  // Update time series (linked to charts) and text displays for source with new value.
  sourceObj.timeSeries.append(timeValue, dataValue);
  for (let i = 0; i < sourceObj.numContainerList.length; i++) {
    let numStr = sourceObj.name + ": " + dataValue + sourceObj.unit;
    sourceObj.numContainerList[i].innerText = numStr;
  }
}

/**************************************************************************************************
 * Socket Connection and Event Handlers
 **************************************************************************************************/

// Setup socket connection
const socket = io.connect("http://" + document.domain + ":" + location.port);

// Socket message handler
socket.on('message', function(message) {
  if (initMsgFlag) {
    // Process initialization message.
    handleInitMessage(message);
  } else {
    // Process data update message.
    handleDataMessage(message);
  }
});

// Socket error handler.
socket.on("error", function(error) {
  console.error('WebSocket error: ', error);
});

// Socket close handler.
socket.on("close", function(event) {
  console.log('WebSocket closed: ', event);
});
