
class Source {

    #name;
    #unit;
    #graphList;
    #timeSeries;
    #sourceTextList;
    #latestValue;

    constructor (name, unit) {
        this.#name = name;
        this.#unit = unit;
        this.#graphList = [];
        this.#timeSeries = new TimeSeries();
        this.#sourceTextList = new Map();
    }

    addData(value) {
      this.#timeSeries.addValue(value);
      this.#latestValue = value;
      for (let sourceText of this.#sourceTextList) {
        sourceText.innerText = this.#name + ": " + value + this.#unit;
      }
    }

    linkGraph(graphObj) {
      this.#graphList.push(graphObj);
      graphObj.linkTimeSeries(this.#timeSeries);
      let sourceText = graphObj.createSourceText();
      sourceText.innerText = this.#name + ": " + this.#latestValue + " " + this.#unit;
      this.#sourceTextList.set(graphObj, sourceText);
    }

    unlinkGraph(graphObj) {
      for (const [curGraphObj, sourceText] of this.#sourceTextList) {
        if (curGraphObj === graphObj) {
          sourceText.remove();
          this.#sourceTextList.delete(curGraphObj);
          curGraphObj.unlinkTimeSeries(this.#timeSeries);
          break;
        }
      }
    }

    get name() {
      return this.#name;
    }

    get unit() {
      return this.#unit;
    }

}