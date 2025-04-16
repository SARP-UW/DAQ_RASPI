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
 * Brief: Contains definition of the "Graph" class.
 */

/**
 * Represents a graph in the UI which displays information
 * from one or more added sources.
 */
class Graph {

  // PRIVATE PROPERTIES
  #name;                // Unique identifier for the graph
  #sourceList;          // Array of source objects linked to the graph
  #destroyCallbackList; // Array of callbacks to execute when the graph is destroyed
  #curColorIndex;       // Index for selecting the next color from the predefined color list
  #smoothieChart;       // Instance of SmoothieChart handling the live data stream
  #graphContainer;      // DOM element acting as the container for the entire graph
  #graphCanvas;         // Canvas element where the graph is drawn
  #graphTextGrid;       // DOM element containing text elements and labels for sources
  #graphTitle;          // DOM element displaying the graph's title


  // PRIVATE METHOD
  // tooltip formatting function for smoothie chart.
  #tooltipFormatter(time, value, data) {
      const now = new Date().getTime();
      const timeDiff = now - timestamp;
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
      let html = '<div>' + formattedDiff + '</div>';
      for (let i = 0; i < data.length; i++) {
        let label = data[i].series.options.tooltipLabel || 
            data[i].series.options.strokeStyle;
        let value = parseFloat(data[i].value).toFixed(2);
        let unit = '';
        for (let j = 0; j < this.#sourceList.length; j++) {
          if (this.#sourceList[j].name === label) {
            unit = this.#sourceList[j].unit;
            break;
          }
        }
        html += '<div style="color:' + 
            data[i].series.options.strokeStyle + '">' + 
            label + ': ' + value + unit + '</div>';
      }
      return html;
    }

    // PRIVATE METHOD
    // Resize handler for graph text grid. Ensures all source 
    // text elements fit within the graphs text grid.
    #resizeHandler() {
      if (this.#graphContainer && this.#graphTextGrid) {
        let totalHeight = 0;
        let gridStyles = window.getComputedStyle(this.#graphTextGrid);
        totalHeight += parseFloat(gridStyles.paddingTop);
        totalHeight += parseFloat(gridStyles.paddingBottom);
        totalHeight += parseFloat(gridStyles.marginTop);
        totalHeight += parseFloat(gridStyles.marginBottom);
        totalheight += (this.#graphTitle.offsetHeight + TEXT_FLEX_GAP);
        for (let source of this.#sourceList) {
          for (let textElement of source.textList) {
            if (textElement.parentNode === this.#graphTextGrid) {
              totalHeight += (textElement.offsetHeight + TEXT_FLEX_GAP);
            }
          }
        }
        totalHeight = Math.ceil(Math.max(totalHeight, GRAPH_MIN_HEIGHT));
        totalHeight += GRAPH_HEIGHT_ADJ;
        this.#graphContainer.style.height = totalHeight + "px";
      }
    }

    // PRIVATE METHOD
    // Callback function registered with all added source objects.
    // Removes source object from sourceList.
    #sourceDestroyCallback(sourceObj) {
      this.#sourceList = this.#sourceList.filter(
        (element) => element !== sourceObj
      );
    }

  /**
   * Constructs a new Graph object.
   * @param {string} name - The name of the graph.
   */
  constructor(name) {
    this.#name = name;
    this.#sourceList = [];
    this.#destroyCallbackList = [];
    this.#curColorIndex = Math.floor(Math.random() * COLOR_LIST.length);

    this.#smoothieChart = new SmoothieChart({
      ...SMOOTHIE_CHART_OPT,
      tooltipFormatter: this.#tooltipFormatter
    });

    this.#graphContainer = document.createElement("div");
    this.#graphContainer.className = "graph-container";
    this.#graphContainer.id = name + "-graph-container";
    document.getElementById("graph-grid").appendChild(this.#graphContainer);

    this.#graphCanvas = document.createElement("canvas");
    this.#graphCanvas.className = "graph-canvas";
    this.#graphCanvas.id = name + "-graph-canvas";
    this.#graphContainer.appendChild(this.#graphCanvas);
    this.#smoothieChart.streamTo(this.#graphCanvas, SMOOTHIE_CHART_DELAY);

    this.#graphTextGrid = document.createElement("div");
    this.#graphTextGrid.className = "graph-text-grid";
    this.#graphTextGrid.id = name + "-graph-text-grid";
    this.#graphContainer.appendChild(this.#graphTextGrid);

    this.#graphTitle = document.createElement("div");
    this.#graphTitle.className = "graph-title";
    this.#graphTitle.id = name + "-graph-title";
    this.#graphTitle.innerText = name;
    this.#graphTextGrid.appendChild(this.#graphTitle);
    window.addEventListener("resize", this.#resizeHandler);
  }

  /**
   * Links a source to the graph. Data from the source will be displayed on the
   * graph (both as a line and as text) when it is added.
   * @param {Source} sourceObj - The target Source object instance.
   */
  addSource(sourceObj) {
    if (this.#sourceList.every((element) => element.name !== sourceObj.name)) {
      this.#sourceList.push(sourceObj);
      let sourceColor = COLOR_LIST[this.#curColorIndex];
      this.#curColorIndex = (this.#curColorIndex + 1) % COLOR_LIST.length;
      sourceObj.addText(this.#graphTextGrid, sourceColor);
      sourceObj.linkSmoothieChart(this.#smoothieChart, sourceColor);
      sourceObj.addDestroyCallback(this.#sourceDestroyCallback);
    }
  }

  /**
   * Removes a source from the graph. Data from the source will no longer
   * be displayed on the graph.
   * @param {Source} sourceObj - The target Source object instance.
   */
  removeSource(sourceObj) {
    if (this.#sourceList.includes(sourceObj)) {
      sourceObj.removeText(this.#graphTextGrid);
      sourceObj.unlinkSmoothieChart(this.#smoothieChart);
      sourceObj.removeDestroyCallback(this.#sourceDestroyCallback);
      this.#sourceList = this.#sourceList.filter(
        (element) => element !== sourceObj
      );
    }
  }

  /**
   * Updates the name of the graph.
   * @param {string} name - The new name of the graph.
   */
  set name(name) {
    this.#name = name;
    this.#graphContainer.id = name + "-graph-container";
    this.#graphCanvas.id = name + "-graph-canvas";
    this.#graphTextGrid.id = name + "-graph-text-grid";
    this.#graphTitle.id = name + "-graph-title";
    this.#graphTitle.innerText = name;
  }

  /**
   * Gets the name of the graph.
   * @return {string} The current name of the graph.
   */
  get name() {
    return this.#name;
  }

  /**
   * Registers a function to be called when the graph is destroyed.
   * @param {function} callback - The target callback function.
   */
  addDestroyCallback(callback) {
    this.#destroyCallbackList.push(callback);
  }

  /**
   * Removes a function previously registered with addDestroyCallback.
   * @param {function} callback - The target callback function.
   */
  removeDestroyCallback(callback) {
    this.#destroyCallbackList = this.#destroyCallbackList.filter(
      (element) => element !== callback
    );
  }

  /**
   * Destroys the graph and removes it from the UI. This function also
   * calls all functions registered with addDestroyCallback.
   */
  destroy() {
    for (let callback of this.#destroyCallbackList) {
      callback(this);
    }
    for (let i = this.#sourceList.length - 1; i >= 0; i--) {
      this.#removeSource(this.#sourceList[i]);
    }
    this.#graphContainer.remove();
    this.#smoothieChart.stopSmoothie();
    window.removeEventListener("resize", this.#resizeHandler);
  }
}

