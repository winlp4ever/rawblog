from bert_serving.client import BertClient
bc = BertClient('15.236.84.229')
enc = bc.encode(['First do it', 'then do it right', 'then do it better'])
print(enc.shape)