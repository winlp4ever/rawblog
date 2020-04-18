import json
from time import sleep
import socketio
from collections import deque
from similarity_search import SimiSearch 
import psycopg2
import json

sio = socketio.Client()
questions_queue = deque()
bob = {
    'username': 'bob',
    'email': '',
    'color': '',
    'userid': 0
}
template = {
    'user': bob,
    'type': 'chat',
    'text': '',
}

sim = SimiSearch()

f = open('db-credentials/config.json')

dbconfig = json.load(f)



@sio.event
def connect():
    print('connection established')

@sio.on('ask-bob')
def on_message(msg):
    questions_queue.appendleft(msg)

@sio.event
def disconnect():
    print('disconnected from server')

def get_answer(old_msg):
    question = old_msg['chat']['text']
    qs = sim.findSimQuestions(question, 5)
    ans = {}
    if qs[0][2] > 0.9:
        conn = psycopg2.connect("dbname=%s user=%s host=%s port=%d password=%s"
            % (dbconfig['database'], dbconfig['user'], dbconfig['host'], dbconfig['port'], dbconfig['password']))

        cur = conn.cursor()
        cur.execute('select * from answer_temp, question_answer_temp where answer_temp.id=question_answer_temp.answer_temp_id and question_answer_temp.question_id = %s;', [str(qs[0][0])])
        ans = cur.fetchone()
        conn.commit()

        # close the database
        cur.close()
        conn.close()
    print('responded.')
    msg = template.copy()
    msg['text'] = ans[2] if ans else ''
    msg['type'] = 'answer'
    msg['answer'] = ans
    msg['related_questions'] = qs
    return {
        'chat': msg,
        'conversationID': old_msg['conversationID']
    }

sio.connect('http://localhost:5000')

while True:
    sleep(0.1)
    if questions_queue:
        print('responding...')
        msg = questions_queue.pop()
        sio.emit('bob-msg', get_answer(msg))


sio.wait()



