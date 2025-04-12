/**
 * TODO
 */
class Source {

  /**
   * TODO
   * @param {string} name - TODO
   * @param {string} unit - TODO
   */
  constructor(name, unit) {
    this.name = name;
    this.unit = unit;
    this.timeSeries = new TimeSeries();
    this.latestValue = NaN;
    this.textList = [];
    this.smoothieChartList = [];
    this.destroyCallbackList = [];
  }

  /**
   * TODO
   * @param {number} time - TODO
   * @param {number} value - TODO
   */
  addData(time, value) {
    this.latestValue = value;
    this.timeSeries.append(time, value);
    for (let text of this.textList) {
      text.innerText = this.name + ": " + value + this.unit;
    }
  }

  /**
   * TODO
   * @param {function} callback - TODO 
   */
  addDestroyCallback(callback) {
    this.destroyCallbackList.push(callback);
  }

  /**
   * TODO
   * @param {function} callback - TODO
   */
  removeDestroyCallback(callback) {
    this.destroyCallbackList = this.destroyCallbackList.filter(
      (element) => element !== callback
    );
  }

  /**
   * TODO
   * @param {HTMLElement} container - TODO
   */
  addText(container, color) {
    if (!this.textList.some((element) => element.parentNode === container)) {
      let textElement = document.createElement("div");
      textElement.className = "source-text";
      textElement.id = this.name + "-source-text";
      textElement.style.color = color;
      textElement.innerText = this.name + ": " + this.latestValue + this.unit;
      container.appendChild(textElement);
      this.textList.push(textElement);
    }
  }

  /**
   * TODO
   * @param {HTMLElement} textElement - TODO
   */
  removeText(container) {
    for (let textElement of this.textList) {
      if (textElement.parentNode === container) {
        textElement.remove();
        break;
      }
    }
    this.textList = this.textList.filter(
      (element) => element !== textElement
    );
  }

  /**
   * TODO
   * @param {SmoothieChart} smoothieChart - TODO
   * @param {string} color - TODO
   */
  linkSmoothieChart(smoothieChart, color) {
    if (!this.smoothieChartList.includes(smoothieChart)) {
      this.smoothieChartList.push(smoothieChart);
      smoothieChart.addTimeSeries(this.timeSeries, {
        tooltipLabel: this.name,
        strokeStyle: color,
        lineWidth: 2
      });
    }
  }

  /**
   * TODO
   * @param {SmoothieChart} smoothieChart - TODO
   */
  unlinkSmoothieChart(smoothieChart) {
    if (this.smoothieChartList.includes(smoothieChart)) {
      smoothieChart.removeTimeSeries(this.timeSeries);
      this.smoothieChartList = this.smoothieChartList.filter(
        (element) => element !== smoothieChart
      );
    }
  }

  /**
   * TODO
   */
  destroy() {
    for (let callback of this.destroyCallbackList) {
      callback(this);
    }
    for (let textElement of this.textList) {
      textElement.remove();
    }
    for (let smoothieChart of this.smoothieChartList) {
      smoothieChart.removeTimeSeries(this.timeSeries);
    }
  }
}