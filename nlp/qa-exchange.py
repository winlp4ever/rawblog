import json
from time import sleep
import socketio
from collections import deque
from similarity_search import SimiSearch 
import psycopg2
import psycopg2.extras
import random

import json
import time 
from datetime import datetime


sio = socketio.Client()
print('1')
questions_queue = deque()
hints_queue = deque()
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
print('2')

f = open('db-credentials/config.json')

dbconfig = json.load(f)

@sio.event
def connect():
    print('connection established')

@sio.on('ask-bob')
def on_message(msg):
    questions_queue.appendleft(msg)

@sio.on('ask-for-hints-bob')
def on_message(msg):
    if msg['typing'] not in {'', ' '}:
        hints_queue.appendleft(msg)

@sio.event
def disconnect():
    print('disconnected from server')

def get_answer(old_msg):
    question = old_msg['chat']['text']
    isErr = [False]
    global sim
    qs = sim.findSimQuestions(question, 5, isErr=isErr)
    if isErr[0]:
        while True:
            try:
                sim = SimiSearch()
            except Exception as e:
                print(e)
                sleep(2)
                continue
            break
    ans = {}
    msg = template.copy()
    res = {}
    if qs and qs[0][2] > 0.9:
        while True:
            try:
                conn = psycopg2.connect (
                    host=dbconfig['host'], database=dbconfig['database'],
                    user=dbconfig['user'], password=dbconfig['password'], port=dbconfig['port'],
                    connect_timeout=2
                )
            except Exception as e:
                print(e)
                sleep(0.5)
                continue
            break
        print('what the hell')
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('select * from answer_temp, question_answer_temp where answer_temp.id=question_answer_temp.answer_temp_id and question_answer_temp.question_id = %s;', [str(qs[0][0])])
        ans = cur.fetchone()
        ans_ = ans.copy() if ans else None
        possible_res = []
        while ans:
            if ans['answer_level'] == old_msg['chat']['user']['level']:
                possible_res.append(ans)
            ans = cur.fetchone()
        if possible_res:
            res = possible_res[random.randint(0, len(possible_res)-1)]
        else:
            res = ans_
        conn.commit()

        # close the database
        cur.close()
        conn.close()
        msg['related_questions'] = qs[1:]
    else:
        msg['related_questions'] = qs
    print('responded.')
    msg['text'] = res['answer_text'] if res else ''
    msg['type'] = 'answer'
    msg['answer'] = res
    msg['original_question'] = question
    tm = datetime.fromtimestamp(time.time())
    msg['datetime'] = '{}/{}/{} {}:{}:{}'.format(tm.day, tm.month, tm.year, tm.hour, tm.minute, tm.second)
    return {
        'chat': msg,
        'conversationID': old_msg['conversationID']
    }

def get_hints(msg):
    question = msg['typing']
    if len(question) < 7:
        print('okk')
        return {
            'hints': [],
            'conversationID': msg['conversationID']
        }
    isErr = [False]
    global sim
    qs = sim.findSimQuestions(question, 5, isErr=isErr)
    if isErr[0]:
        sleep(0.5)
        err = True
        while err:
            try:
                sim = SimiSearch()
                err = False
            except Exception as e:
                print(e)
        qs = sim.findSimQuestions(question, 5, isErr=isErr)
    return {
        'hints': qs,
        'conversationID': msg['conversationID']
    }

sio.connect('http://localhost:5000')

while True:
    sleep(0.001)
    if questions_queue:
        print('responding...')
        msg = questions_queue.pop()
        sio.emit('bob-msg', get_answer(msg))
    if hints_queue:
        print('sending hints...')
        typing = hints_queue.pop()
        sio.emit('bob-hints', get_hints(typing))


sio.wait()



