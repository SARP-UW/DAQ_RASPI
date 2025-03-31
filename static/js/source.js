
/**
 * TODO
 */
class Source {

  /**
   * TODO
   * @param {string} name - TODO
   * @param {string} unit - TODO
   */
  constructor (name, unit) {
    this.name = name;
    this.unit = unit;
    this.timeSeries = new TimeSeries();
    this.sourceTextList = [];
  }

  /**
   * TODO
   * @param {number} time - TODO
   * @param {number} value - TODO
   */
  add_data(time, value) {
    if (typeof time === "string") {
      time = parseFloat(time);
    }
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    if (isNaN(time) || isNaN(value)) {
      
    }
    this.timeSeries.append(time, value);
    for (let sourceText of this.sourceTextList) {
      sourceText.innerText = this.name + ": " + value + this.unit; 
    }
  }

  add_source_text(source_text) {
    this.sourceTextList.push(source_text);
    source_text.innerText = this.name + ":" + "NaN";
  }

  remove_source_text(source_text) {
    this.sourceTextList = this.sourceTextList.filter(
      (source_text) => element !== source_text
    );
  }

}