
const SMOOTHIE_CHART_OPTIONS = {
  tooltip: true,
  responsive: true,
  maxValueScale: 2,
  minValueScale: 2,
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
  },
};

const SMOOTHIE_TIME_SERIES_OPTIONS = {
  tooltipLabel: sourceName,
  strokeStyle: sourceColor, 
  lineWidth: 2
};

const SMOOTHIE_CHART_DELAY = 1000;

/**
 * TODO
 */
class Graph {

  /**
   * TODO
   * @param {string} name - TODO
   */
  constructor (name) {
    this.name = name;
    this.sourceList = [];
    this.smoothieChart = new SmoothieChart(SMOOTHIE_CHART_OPTIONS);

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
  }

  add_source(source_obj) {
    this.sourceList.push(source_obj);
    this.smoothieChart.addTimeSeries(source_obj.timeSeries, SMOOTHIE_TIME_SERIES_OPTIONS);

    let sourceText = document.createElement("div");
    sourceText.className = "source-text";
    sourceText.id = source_obj.name + "-source-text";
    sourceText.innerText = source_obj.name + ": " + source_obj.unit;
    this.graphTextGrid.appendChild(sourceText);
    source_obj.sourceTextList.push(sourceText);
  }

  remove_source(source_obj) {

  }



}