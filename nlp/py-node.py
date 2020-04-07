import json
from time import sleep
import socketio

def run():
    sio = socketio.Client()

    @sio.event
    def connect():
        print('connection established')

    @sio.on('ask-bob')
    def on_message(msg):
        print(msg['chat'])
        res = input('Bob\'s response:\n')
        sio.emit('bob-msg', {
            'chat': {
                'user': {
                    'username': 'bob',
                    'email': '',
                    'color': '',
                    'userid': 0
                },
                'type': 'chat',
                'text': res
            },
            'conversationID': msg['conversationID']
        })
    
    @sio.event
    def disconnect():
        print('disconnected from server')

    sio.connect('http://localhost:5000')
    sio.wait()


if __name__ == "__main__":
    run()


