from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask("daq")
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('UpdateGraph.html')


def broadcast_message(message):
    socketio.emit('message', message)


def start_flask():
    socketio.run(app, "localhost", 5001, allow_unsafe_werkzeug=True)
