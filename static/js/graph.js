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
   * @param {Source} sourceObj - TODO
   */
  addSource(sourceObj) {
    if (!this.sourceList.includes(sourceObj)) {
      this.sourceList.push(sourceObj);
      sourceObj.graphList.push(this);

      let sourceColor = COLOR_LIST[this.curColorIndex];
      this.curColorIndex = (this.curColorIndex + 1) % COLOR_LIST.length;
      this.smoothieChart.addTimeSeries(sourceObj.timeSeries, {
        tooltipLabel: sourceObj.name, 
        strokeStyle: sourceColor, 
        lineWidth: 2
      });

      let sourceText = document.createElement("div");
      sourceText.className = "source-text";
      sourceText.id = sourceObj.name + "-source-text";
      sourceText.innerText = sourceObj.name + ": " + sourceObj.latestValue + sourceObj.unit;
      sourceText.style.color = sourceColor;
      this.graphTextGrid.appendChild(sourceText);
      sourceObj.textList.push(sourceText);
    }
  }

  /**
   * TODO
   * @param {Source} sourceObj - TODO
   */
  removeSource(sourceObj) {
    if (this.sourceList.includes(sourceObj)) {
      this.smoothieChart.removeTimeSeries(sourceObj.timeSeries);
      for (let textElement of sourceObj.textList) {
        if (textElement.parentNode === this.graphTextGrid) {
          this.graphTextGrid.removeChild(textElement);
        }
      }
      sourceObj.graphList = sourceObj.graphList.filter(
        (element) => element !== this
      );
      sourceObj.textList = sourceObj.textList.filter(
        (element) => element.parentNode !== this.graphTextGrid
      );
    }
  }

  /**
   * TODO
   */
  destroy() {
    this.graphContainer.remove();
    this.smoothieChart.stopSmoothie();
    window.removeEventListener("resize", this.resizeHandler);
    for (let i = this.sourceList.length - 1; i >= 0; i--) {
      this.removeSource(this.sourceList[i]);
    }
  }
}

