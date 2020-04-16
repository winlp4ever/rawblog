import time
from bert_serving.client import BertClient
from elasticsearch import Elasticsearch



es = Elasticsearch()

bc = BertClient('15.236.84.229')

query = 'machine learning'

embedding_start = time.time()
query_vector = bc.encode([query])[0].tolist()
embedding_time = time.time() - embedding_start

script_query = {
    "script_score": {
        "query": {"match_all": {}},
        "script": {
            "source": "cosineSimilarity(params.query_vector, doc['vectorisation'])",
            "params": {"query_vector": query_vector}
        }
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
for res in response['hits']['hits'][:5]:
    print('q: {} - score: {}' .format(res['_source']['text'], res['_score']))