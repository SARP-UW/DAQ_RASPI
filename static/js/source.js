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
    this.graphList = [];
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
   */
  destroy() {
    for (let i = this.graphList.length - 1; i >= 0; i--) {
      this.graphList[i].removeSource(this);
    }
  }
}