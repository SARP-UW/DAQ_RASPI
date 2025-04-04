from flask import Flask, render_template, request
from flask_socketio import SocketIO

app = Flask("daq")
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('UpdateGraph.html')

@app.route('/control')
def control():
    return "Hello World"


join_message = "test1,c,graph1:test2,c,graph2,graph3:test3,c,graph1,graph3"

'''
{
    tag: "join",
    source1 : {unit = c, graphs = [graph1, graph2, graph3]},
    source2 : ...
},
'''


@socketio.on('connect')
def on_connect():
    sid = request.sid
    socketio.emit("message", join_message, room=sid)
@socketio.on("message")
def onReceive(message):
    pass


def broadcast_message(message):
    socketio.emit('message', message)


def start_flask():
    socketio.run(app, "0.0.0.0", 5001, allow_unsafe_werkzeug=True)
