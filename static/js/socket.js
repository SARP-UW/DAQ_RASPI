const socket = io.connect("http://" + document.domain + ":" + location.port);
var sourceList = [];
var graphList = [];

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
    }
  }
});

socket.on("close", function() {
  console.log("WebSocket closed.");
  for (let i = graphList.length - 1; i >= 0; i--) {
    graphList[i].destroy();
  }
  for (let i = sourceList.length - 1; i >= 0; i--) {
    sourceList[i].destroy();
  }
});

socket.on("error", function(error) {
  console.error("WebSocket error: ", error);
});