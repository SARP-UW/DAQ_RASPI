
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

const SMOOTHIE_CHART_DELAY = 1000;

class Graph {

  constructor (name) {

    // Set name and create smoothie chart obj (scrolling graph)
    this.name = name;
    this.smoothieChart = new SmoothieChart(SMOOTHIE_CHART_OPTIONS);

    // Create container for graph elements
    this.graphContainer = document.createElement("div");
    this.graphContainer.className = "graph-container";
    this.graphContainer.id = name + "-graph-container";
    document.getElementById("graph-grid").appendChild(this.graphContainer);

    // Create canvas for graph (smoothie chart)
    this.graphCanvas = document.createElement("canvas");
    this.graphCanvas.className = "graph-canvas";
    this.graphCanvas.id = name + "-graph-canvas";
    this.graphContainer.appendChild(this.graphCanvas);
    this.smoothieChart.streamTo(this.graphCanvas, SMOOTHIE_CHART_DELAY);

    // Create grid for text associated with graph
    this.graphTextGrid = document.createElement("div");
    this.graphTextGrid.className = "graph-text-grid";
    this.graphTextGrid.id = name + "-graph-text-grid";
    this.graphContainer.appendChild(this.graphTextGrid);

    // Create title text for graph
    this.graphTitle = document.createElement("div");
    this.graphTitle.className = "graph-title";
    this.graphTitle.id = name + "-graph-title";
    this.graphTitle.innerText = name;
    this.graphTextGrid.appendChild(this.graphTitle);
  }



}