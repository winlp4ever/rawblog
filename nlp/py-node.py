

import json



import socketio
import sent2vec
from scipy.spatial.distance import cosine


def run():
    
    model = sent2vec.Sent2vecModel()
    model.load_model('/home/ubuntu/data/torontobooks_unigrams.bin')
    QAs = json.load(open('nlp/qas.json'))
    sio = socketio.Client()
    @sio.event
    def connect():
        print('connection established')
    @sio.on('ask for hints')
    def on_message(typed):

        emb = model.embed_sentence(typed['msg']) 
        hints = []
        for q in QAs:
            e = model.embed_sentence(q)
            confid = 1.0-cosine(e, emb)
            if confid > 0.6:
                hints.append({'hint': q, 'confidence': '%.2f'%confid})
        hints.sort(key= lambda u: u['confidence'], reverse=True)
        sio.emit('hints', {'dest': typed['sender'], 'hints': hints})
    @sio.on('new chat')
    def on_message(msg):
        if msg['dest'] != 'bot':
            return
        if 'referral' in msg:
            if len(msg['msg']) > 100:
                sio.emit('new chat', {'sender': 'bot', 'dest': msg['referral'], 
                    'msg': msg['msg'][:100] + '...',
                    'fullanswer': "Prof's reply: %s" %msg['msg'],
                    'type': 'answer'})
                return
            sio.emit('new chat', {'sender': 'bot', 'dest': msg['referral'], 'msg': "Prof's reply:%s" %msg['msg'], 'type': 'answer'})
            return

        q = msg['msg']
        if q.lower() in QAs:
            match = QAs[q.lower()]
            answer = match['answer']
            if len(answer) > 100:
                res = {'sender': 'bot', 'dest': msg['sender'], 'msg': answer[:100] + '...', 'fullanswer': answer, 'type': 'answer'}
            else:
                res = {'sender': 'bot', 'dest': msg['sender'], 'msg': answer, 'type': 'answer'}
            if 'courses' in match:
                res['courses'] = match['courses']
            if 'toread' in match:
                res['toread'] = match['toread']
            sio.emit('new chat', res)
        elif q.endswith('?'):
            excuses = ["I'm not qualified to answer this!",
                "I'll deliver this question to someone capable!"]
            for s in excuses:
                sio.emit('new chat', {'sender': 'bot', 'dest': msg['sender'], 'msg': s})
            sio.emit('new chat', {'sender': 'bot', 'dest': 'Prof. Alpha', 'msg': 'A student (%s) has the following question: %s' %(msg['sender'], msg['msg']), 'referral': msg['sender']})

    @sio.event
    def disconnect():
        print('disconnected from server')

    sio.connect('http://localhost:80')
    sio.wait()


if __name__ == "__main__":
    run()


