import time
from bert_serving.client import BertClient
from elasticsearch import Elasticsearch
from spacy.tokenizer import Tokenizer
from spacy.lang.en import English


es = Elasticsearch()

bc = BertClient('15.236.84.229')

nlp = English()
# Create a blank Tokenizer with just the English vocab
tokenizer = Tokenizer(nlp.vocab)

def findSimQuestions(q: str, topk: int):
    """
    Find similar questions based on cosine similarity to a question q and return top k results
    Params:
    q: question that needs searching for similar questions
    topk: nb of top results returned
    """
    tks = tokenizer(q).text
    print('tokenized text %s' % tks)
    embedding_start = time.time()
    query_vector = bc.encode([tks])[0].tolist()
    embedding_time = time.time() - embedding_start

    script_query = {
        "script_score": {
            "query": {"match_all": {}},
            "script": {
                "source": "return cosineSimilarity(params.query_vector, doc['vectorisation']);",
                "params": {
                    "query_vector": query_vector,
                    "origin": [0 for _ in range(1024)]
                }
            },
            "min_score": 0.7
        }
    }

    search_start = time.time()
    response = es.search(
        index='qa',
        body={
            "size": 5,
            "query": script_query,
            "_source": ['id', 'text']
        }
    )
    search_time = time.time() - search_start
    print("{} total hits.".format(response["hits"]["total"]["value"]))
    for res in response['hits']['hits'][:topk]:
        print('q: {} - score: {}' .format(res['_source']['text'], res['_score']))


ans = 'y'
while ans in ['y', 'Y']:
    query = input('Enter your question:\n')
    findSimQuestions(query, 5)
    ans = input('Continue ? [y/n]:')