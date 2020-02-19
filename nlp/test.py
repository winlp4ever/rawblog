import pandas as pd
import json

csv = pd.read_csv('bob-qas.csv', header=None)
d = dict()

for r in csv.iterrows():
    print('%s' % (r[1][0]))
    d[r[1][0][3:].lstrip().lower()] = {'answer': ' '.join(r[1][1].split('\n'))}

with open('qas.json', 'w') as outfile:
    json.dump(d, outfile, indent=4)