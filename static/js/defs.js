// Delay of most recent data displayed on smoothie chart.
const SMOOTHIE_CHART_DELAY = 1000;

// Minimum height of graph text grid.
const GRAPH_MIN_HEIGHT = 70;

// Adjustment to height of graph text grid.
const GRAPH_HEIGHT_ADJ = 5;

// Gap between text elements in graph text grid.
const TEXT_FLEX_GAP = 5;

// Smoothie chart options.
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
  tooltipFormatter: (time, value, data) => {
    const now = new Date().getTime();
    const timeDiff = now - timestamp;
    let formattedDiff;
    
    if (timeDiff < 1000) {
      formattedDiff = 'just now';
    } else if (timeDiff < 60000) {
      const seconds = Math.floor(timeDiff / 1000);
      formattedDiff = seconds + 's ago';
    } else if (timeDiff < 3600000) {
      const minutes = Math.floor(timeDiff / 60000);
      formattedDiff = minutes + 'm ago';
    } else {
      const hours = Math.floor(timeDiff / 3600000);
      formattedDiff = hours + 'h ago';
    }
    let html = '<div>' + formattedDiff + '</div>';
    for (let i = 0; i < data.length; i++) {
      let label = data[i].series.options.tooltipLabel || 
          data[i].series.options.strokeStyle;
      let value = parseFloat(data[i].value).toFixed(2);
      let unit = '';
      for (let j = 0; j < sourceList.length; j++) {
        if (sourceList[j].name === label) {
          unit = sourceList[j].unit;
          break;
        }
      }
      html += '<div style="color:' + 
          data[i].series.options.strokeStyle + '">' + 
          label + ': ' + value + unit + '</div>';
    }
    return html;
  }
};

// List of colors to use for sources.
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