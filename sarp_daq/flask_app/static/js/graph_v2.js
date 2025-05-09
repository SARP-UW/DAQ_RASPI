
class Graph {

  #name;
  #smoothieChartObj;
  #textList;
  #graphContainer;
  #graphCanvas;
  #graphTextGrid;
  #graphTitle;
  #graphTextGrid;

  constructor (name) {
    this.#name = name;
    this.#textList = new Map();
    this.#smoothieChartObj = new SmoothieChart(SMOOTHIE_CHART_OPT);

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

    // window.addEventListener("resize", this.#resizeHandler);

  }

  addSourceText(sourceText) {

    

  }



}