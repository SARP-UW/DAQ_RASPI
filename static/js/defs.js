const SMOOTHIE_CHART_DELAY = 1000;

const TEXT_FLEX_GAP = 5;
const GRAPH_MIN_HEIGHT = 70;
const GRAPH_HEIGHT_ADJ = 5;

const SMOOTHIE_CHART_OPT = {
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

const COLOR_LIST = [
  '#bbbbbb', 
  "#ff0000", 
  "#ff6200", 
  "#ffcc00", 
  "#80ff00",
  "#00ff7b", 
  "#00f2ff", 
  "#0077ff", 
  "#9000ff", 
  "#e600ff", 
  "#ff006a"
];

