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
 * Brief: Logic for handling socket connections and messages.
 */

// Initialize socket connection
const socket = io.connect("http://" + document.domain + ":" + location.port);

// Parses incoming messages on socket.
socket.on('message', function(msg) {
  let msg_obj_list = JSON.parse(msg);
  for (msg_obj of msg_obj_list) {
    switch (msg_obj.tag) {
      case "createGraph":
        if (graphList.find((element) => element.name === msg_obj.data.name) === undefined) {
          let graph = new Graph(msg_obj.data.name);
          graphList.push(graph);
        }
        break;
      case "destroyGraph":
        let graph = graphList.find((element) => element.name === msg_obj.data.name);
        if (graph !== undefined) {
          graph.destroy();
        }
        graphList = graphList.filter((element) => element !== graph);
        break;
      case "createSource":
        if (sourceList.find((element) => element.name === msg_obj.data.name) === undefined) {
          let source = new Source(msg_obj.data.name, msg_obj.data.unit);
          sourceList.push(source);
        }
        break;
      case "destroySource":
        let source = sourceList.find((element) => element.name === msg_obj.data.name);
        if (source !== undefined) {
          source.destroy();
        }
        sourceList = sourceList.filter((element) => element !== source);
        break;
      case "addData":
        let source = sourceList.find((element) => element.name === msg_obj.data.name);
        if (source !== undefined) {
          let time = parseFloat(msg_obj.data.time) * 1000;
          let value = parseFloat(msg_obj.data.value);
          source.addData(time, value);
        }
        break;
      case "addSource":
        let graph = graphList.find((element) => element.name === msg_obj.data.graphName);
        let source = sourceList.find((element) => element.name === msg_obj.data.sourceName);
        if (graph !== undefined && source !== undefined) {
          graph.addSource(source);
        }
        break;
      case "removeSource":
        let graph = graphList.find((element) => element.name === msg_obj.data.graphName);
        let source = sourceList.find((element) => element.name === msg_obj.data.sourceName);
        if (graph !== undefined && source !== undefined) {
          graph.removeSource(source);
        }
        break;
      case "setStatus":
        let statusText = msg_obj.data.statusText;
        let statusColor = msg_obj.data.statusColor;
        let textElement = document.getElementById('system-status-text');
        textElement.innerText = statusText;
        textElement.style.color = statusColor;
        break;
    }
  }
});

// Close socket connection by destroying all graphs and sources.
socket.on("close", function() {
  console.log("WebSocket closed.");
  for (let i = graphList.length - 1; i >= 0; i--) {
    graphList[i].destroy();
  }
  for (let i = sourceList.length - 1; i >= 0; i--) {
    sourceList[i].destroy();
  }
});

// Log errors from socket.
socket.on("error", function(error) {
  console.log("WebSocket error: " + error);
});

/**
 * Updates the server status text in the UI based on the state of the
 * WebSocket connection (connecting, open, closing, closed).
 */
function updateServerStatusText() {
  let textElement = document.getElementById('server-status-text');
  switch (socket.readyState) {
    case WebSocket.CONNECTING:
      textElement.innerText = "Connecting";
      textElement.style.color = "orange";
      break;
    case WebSocket.OPEN:
      textElement.innerText = "Connected";
      textElement.style.color = "green";
      break;
    case WebSocket.CLOSING:
      textElement.innerText = "Closing";
      textElement.style.color = "orange";
      break;
    case WebSocket.CLOSED:
      textElement.innerText = "Disconnected";
      textElement.style.color = "red";
      break;
    default:
      textElement.innerText = "Unknown";
      textElement.style.color = "gray";
      break;
  }
  setInterval(updateServerStatusText, 1000);
}

// Start updating server status text once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateServerStatusText();
});