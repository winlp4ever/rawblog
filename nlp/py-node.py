import json
from time import sleep
import socketio
from qExtract import qExtract 


def run():
    sio = socketio.Client()
    @sio.event
    def connect():
        print('connection established')

    
    @sio.on('transcript-url')
    def on_message(msg):
        url = msg['url']
        sio.emit('raw-qas', qExtract(url))


    @sio.event
    def disconnect():
        print('disconnected from server')

    sio.connect('http://localhost:5000')
    sio.wait()


if __name__ == "__main__":
    run()
    

    
