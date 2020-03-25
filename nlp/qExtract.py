import webvtt 
import json
import glob 
import os
from datetime import datetime
import requests
from io import StringIO
import urllib.request


q_prefixes = ['what do', 'how do', 'why do', 'where do', "where's", 'what is', "what's" 'how is', 
    'why is', 'where are', 'what are', 'could you', 'can you', 'how can', 'what can', 'where can',
    'which ones']

total_questions = 0

def toSecs(s: str):
    a, b, c = map(float, s.split(':'))
    return int(a * 3600 + b * 60 + c)

def qExtract(url):
    response = urllib.request.urlopen(url)
    data = response.read() 
    text = data.decode('utf-8')
    buffer = StringIO(text)

    questions = []
    responses = []
    tstamps = []
    on_response = False
    for l in webvtt.read_buffer(buffer):
        line = l.text.lower()
        line = line[line.find(':')+1:].lstrip()
        if on_response: 
            responses.append(line)
            on_response = False
        for p in ['question']:
            if p in line:
                questions.append(line)
                t = toSecs(l.start)
                tstamps.append(t)
                on_response = True
                break
    
    return {
        'questions': [{'q': q, 'a': a, 'timestamp': t} for q,a,t in zip(questions, responses, tstamps)], 
        'nb-questions': len(questions)
    }

if __name__ == '__main__':
    url = 'https://course-recording-q1-2020-taii.s3.eu-west-3.amazonaws.com/us/GMT20200117-205611_AI-Inst--U.transcript.vtt'
    print(qExtract(url))