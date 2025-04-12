// List of source and graph objects.
var sourceList = [];
var graphList = [];

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
 * TODO
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