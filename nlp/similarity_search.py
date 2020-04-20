import time
from bert_serving.client import BertClient
from elasticsearch import Elasticsearch
from spacy.tokenizer import Tokenizer
from spacy.lang.en import English

class SimiSearch:
    def __init__(self):
        self.es = Elasticsearch()
        print('u')
        #self.bc = BertClient('15.236.84.229')
        nlp = English()
        self.tokenizer = Tokenizer(nlp.vocab)
        self.bc = BertClient('15.236.84.229', timeout=1000)
        print('v')
        
    def findSimQuestions(self, q: str, topk: int, minScore=0.7, isErr=[False]):
        """
        Find similar questions based on cosine similarity to a question q and return top k results
        Params:
        q: question that needs searching for similar questions
        topk: nb of top results returned
        """
        
        tks = self.tokenizer(q).text
        embedding_start = time.time()
        
        try:
            query_vector = self.bc.encode([tks])
        except Exception as e:
            print(e)
            isErr[0] = True
            return []    
        query_vector = query_vector[0].tolist()
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
                "min_score": minScore
            }
        }
        print('encoding time: {}'.format(embedding_time));

        search_start = time.time()
        response = self.es.search(
            index='qa',
            body={
                "size": 5,
                "query": script_query,
                "_source": ['id', 'text']
            }
        )

        search_time = time.time() - search_start
        print('search time: {}'.format(search_time));

        res = []
        for r in response['hits']['hits'][:topk]:
            res.append([r['_source']['id'], r['_source']['text'], r['_score']])
        return res

if __name__ == '__main__':
    sim = SimiSearch()
    while True:
        query = input('Enter your question:\n')
        print(sim.findSimQuestions(query, 5))