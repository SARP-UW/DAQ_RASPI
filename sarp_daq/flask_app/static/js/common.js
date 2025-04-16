/*
 * Copyright (C) 2025 - SARP UW
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.html>.
 *
 * Author: Aaron McBride
 * Brief: Configuration constants used throughout project.
 */

// Common options for smoothie chart instances.
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

// Common options for time series instances.
const TIME_SERIES_OPT = {
  lineWidth: 2
};

// Delay of most recent data displayed on smoothie chart.
const SMOOTHIE_CHART_DELAY = 1000;

// Minimum height of graph text grid.
const GRAPH_MIN_HEIGHT = 70;

// Adjustment to height of graph text grid.
const GRAPH_HEIGHT_ADJ = 5;

// Gap between text elements in graph text grid.
const TEXT_FLEX_GAP = 5;

// List of all source object instances.
var sourceList = [];

// List of all graph object instances.
var graphList = [];