import sent2vec
from scipy.spatial.distance import cosine
model = sent2vec.Sent2vecModel()
model.load_model('/home/redlcamille/workspace/sent2vec/torontobooks_unigrams.bin')
emb = model.embed_sentence("what is neural network?") 
e = model.embed_sentence("how does neural network work?")
embs = model.embed_sentences(["first sentence .", "another sentence"])
print(cosine(emb, e))