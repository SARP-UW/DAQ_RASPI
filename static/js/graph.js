/**
 * TODO
 */
class Graph {

  /**
   * TODO
   * @param {string} name - TODO
   */
  constructor(name) {
    this.name = name;
    this.sourceList = [];
    this.destroyCallbackList = [];
    this.smoothieChart = new SmoothieChart(SMOOTHIE_CHART_OPT);
    this.curColorIndex = Math.floor(Math.random() * COLOR_LIST.length);

    this.graphContainer = document.createElement("div");
    this.graphContainer.className = "graph-container";
    this.graphContainer.id = name + "-graph-container";
    document.getElementById("graph-grid").appendChild(this.graphContainer);

    this.graphCanvas = document.createElement("canvas");
    this.graphCanvas.className = "graph-canvas";
    this.graphCanvas.id = name + "-graph-canvas";
    this.graphContainer.appendChild(this.graphCanvas);
    this.smoothieChart.streamTo(this.graphCanvas, SMOOTHIE_CHART_DELAY);

    this.graphTextGrid = document.createElement("div");
    this.graphTextGrid.className = "graph-text-grid";
    this.graphTextGrid.id = name + "-graph-text-grid";
    this.graphContainer.appendChild(this.graphTextGrid);

    this.graphTitle = document.createElement("div");
    this.graphTitle.className = "graph-title";
    this.graphTitle.id = name + "-graph-title";
    this.graphTitle.innerText = name;
    this.graphTextGrid.appendChild(this.graphTitle);

    this.sourceDestroyCallback = (sourceObj) => {
      this.sourceList = this.sourceList.filter(
        (element) => element !== sourceObj
      );
    };

    this.resizeHandler = () => {
      let totalHeight = 0;
      let gridStyles = window.getComputedStyle(this.graphTextGrid);
      totalHeight += parseFloat(gridStyles.paddingTop);
      totalHeight += parseFloat(gridStyles.paddingBottom);
      totalHeight += parseFloat(gridStyles.marginTop);
      totalHeight += parseFloat(gridStyles.marginBottom);
      totalheight += (this.graphTitle.offsetHeight + TEXT_FLEX_GAP);
      for (let source of this.sourceList) {
        for (let textElement of source.textList) {
          if (textElement.parentNode === this.graphTextGrid) {
            totalHeight += (textElement.offsetHeight + TEXT_FLEX_GAP);
          }
        }
      }
      totalHeight = Math.ceil(Math.max(totalHeight, GRAPH_MIN_HEIGHT));
      totalHeight += GRAPH_HEIGHT_ADJ;
      this.graphContainer.style.height = totalHeight + "px";
    };
    window.addEventListener("resize", this.resizeHandler);
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
   * @param {Source} sourceObj - TODO
   */
  addSource(sourceObj) {
    if (!this.sourceList.includes(sourceObj)) {
      this.sourceList.push(sourceObj);
      let sourceColor = COLOR_LIST[this.curColorIndex];
      this.curColorIndex = (this.curColorIndex + 1) % COLOR_LIST.length;
      sourceObj.addText(this.graphTextGrid, sourceColor);
      sourceObj.linkSmoothieChart(this.smoothieChart, sourceColor);
      sourceObj.addDestroyCallback(this.sourceDestroyCallback);
    }
  }

  /**
   * TODO
   * @param {Source} sourceObj - TODO
   */
  removeSource(sourceObj) {
    if (this.sourceList.includes(sourceObj)) {
      sourceObj.removeText(this.graphTextGrid);
      sourceObj.unlinkSmoothieChart(this.smoothieChart);
      sourceObj.removeDestroyCallback(this.sourceDestroyCallback);
      this.sourceList = this.sourceList.filter(
        (element) => element !== sourceObj
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
    for (let i = this.sourceList.length - 1; i >= 0; i--) {
      this.removeSource(this.sourceList[i]);
    }
    this.graphContainer.remove();
    this.smoothieChart.stopSmoothie();
    window.removeEventListener("resize", this.resizeHandler);
  }
}

