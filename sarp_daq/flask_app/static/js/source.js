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
 * Brief: Contains definition of the "Source" class.
 */

/**
 * Represents a source/stream of data.
 */
class Source {

  // PRIVATE PROPERTIES
  #name;                // Unique identifier for the source
  #unit;                // Unit associated with the source's data
  #timeSeries;          // TimeSeries object for handling data points
  #latestValue;         // Latest value of the source
  #textList;            // Array of text elements associated with the source
  #smoothieChartList;   // Array of smoothie chart instances linked to the source
  #destroyCallbackList; // Array of callbacks to execute when the source is destroyed

  // PRIVATE METHOD
  // Updates all text elements associated with the source.
  #updateText() {
    for (let text of this.#textList) {
      text.innerText = this.#name + ": " + this.#latestValue + this.#unit;
    }
  }

  /**
   * Constructs a new Source object.
   * @param {string} name - The name of the source.
   * @param {string} unit - The unit associated with the source's data.
   */
  constructor(name, unit) {
    this.#name = name;
    this.#unit = unit;
    this.#timeSeries = new TimeSeries();
    this.#latestValue = NaN;
    this.#textList = [];
    this.#smoothieChartList = [];
    this.#destroyCallbackList = [];
  }

  /**
   * Adds a new data point to the source.
   * @param {number} time - The time at which the data point was recorded.
   * @param {number} value - The value of the data point.
   */
  addData(time, value) {
    this.#latestValue = value;
    this.#timeSeries.append(time, value);
    this.#updateText();
  }

  /**
   * Adds a text element associated with a source to the specified container.
   * The text element will display the latest value of the source with its unit.
   * @param {HTMLElement} container - The container element to append the text to.
   * @param {string} color - The desired color of the text.
   */
  addText(container, color) {
    if (!this.#textList.some((element) => element.parentNode === container)) {
      let textElement = document.createElement("div");
      textElement.className = "source-text";
      textElement.id = this.#name + "-source-text";
      textElement.style.color = color;
      textElement.innerText = this.#name + ": " + this.#latestValue + this.#unit;
      container.appendChild(textElement);
      this.#textList.push(textElement);
    }
  }

  /**
   * Removes a text element associated with a source from the specified container. 
   * @param {HTMLElement} textElement - The text element to be removed.
   */
  removeText(container) {
    for (let textElement of this.#textList) {
      if (textElement.parentNode === container) {
        textElement.remove();
        break;
      }
    }
    this.#textList = this.#textList.filter(
      (element) => element !== textElement
    );
  }

  /**
   * Links a source to a SmoothieChart instance, allowing data from the source
   * to be displayed on the chart when it is added.
   * @param {SmoothieChart} smoothieChart - The target smoothie chart instance.
   * @param {string} color - The desired color of the line on the chart.
   */
  linkSmoothieChart(smoothieChart, color) {
    if (!this.#smoothieChartList.includes(smoothieChart)) {
      this.#smoothieChartList.push(smoothieChart);
      smoothieChart.addTimeSeries(this.#timeSeries, {
        ...TIME_SERIES_OPT,
        tooltipLabel: this.#name,
        lineWidth: 2
      });
    }
  }

  /**
   * Unlinks a source from a smoothie chart instance. Data from the source will
   * no longer be displayed on the chart.
   * @param {SmoothieChart} smoothieChart - The target smoothie chart instance.
   */
  unlinkSmoothieChart(smoothieChart) {
    if (this.#smoothieChartList.includes(smoothieChart)) {
      smoothieChart.removeTimeSeries(this.#timeSeries);
      this.#smoothieChartList = this.#smoothieChartList.filter(
        (element) => element !== smoothieChart
      );
    }
  }

  /**
   * Updates the name of the source.
   * @param {string} name - The new name of the source.
   */
  set name(name) {
    this.#name = name;
    this.#updateText();
  }

  /**
   * Updates the unit of the source.
   * @param {string} unit - The new unit of the source.
   */
  set unit(unit) {
    this.#unit = unit;
    this.#updateText();
  }

  /**
   * Gets the current name of the source.
   * @return {string} The name of the source.
   */
  get name() {
    return this.#name;
  }

  /**
   * Gets the current unit of the source.
   * @return {string} The unit of the source.
   */
  get unit() {
    return this.#unit;
  }

  /**
   * Registers a function to be called when the source is destroyed.
   * When called the function is passed the source object as an argument.
   * @param {function} callback - The target callback function.
   */
  addDestroyCallback(callback) {
    this.#destroyCallbackList.push(callback);
  }

  /**
   * Removes a function previously registers with addDestroyCallback.
   * @param {function} callback - The target callback function.
   */
  removeDestroyCallback(callback) {
    this.#destroyCallbackList = this.#destroyCallbackList.filter(
      (element) => element !== callback
    );
  }

  /**
   * Destroys the source, removing all associated text elements and unlinking it from
   * all linked smoothie chart instances. This function also calls any functions
   * registers with addDestroyCallback.
   */
  destroy() {
    for (let callback of this.#destroyCallbackList) {
      callback(this);
    }
    for (let textElement of this.#textList) {
      textElement.remove();
    }
    for (let smoothieChart of this.#smoothieChartList) {
      smoothieChart.removeTimeSeries(this.#timeSeries);
    }
  }

}