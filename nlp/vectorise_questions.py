'''
This script use bert-as-a-service, extracts all existing questions from a 
postgresql then calculate and store back to db all bert vectorisations of questions.
The goal is to have a system that returns similar questions to the one typed by 
front user.
'''
import psycopg2
import json
from spacy.tokenizer import Tokenizer
from spacy.lang.en import English
from bert_serving.client import BertClient
bc = BertClient('15.236.84.229')

nlp = English()
# Create a blank Tokenizer with just the English vocab
tokenizer = Tokenizer(nlp.vocab)

# read db-config file
f = open('db-credentials/config.json')

dbconfig = json.load(f)
# connect to the server
conn = psycopg2.connect("dbname=%s user=%s host=%s port=%d password=%s"
    % (dbconfig['database'], dbconfig['user'], dbconfig['host'], dbconfig['port'], dbconfig['password']))

cur = conn.cursor()

# extract all questions from the table 'question'
cur.execute("SELECT id, question_text FROM question;")
questions = cur.fetchall()

# iterate over all questions
for idx, text in questions:
    tks = tokenizer(text).text
    embeddings = bc.encode([tks])[0]
    cur.execute("update question set dimensions=1024, vectorisation=%s where id=%s", [embeddings.tolist(), idx])
    print('done for %d' % idx)

conn.commit()

# close the database
cur.close()
conn.close()