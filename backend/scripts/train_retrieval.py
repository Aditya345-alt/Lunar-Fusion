"""Training blueprint for a learned lunar location-retrieval encoder.
This script exports the current catalog as an embedding dataset and documents the intended split.
For a real model, use geographic (not random patch) train/validation/test regions.
"""
import json, sqlite3
from pathlib import Path
p=Path(__file__).resolve().parents[1]; db=p/'lunar_catalog.db'
c=sqlite3.connect(db); rows=c.execute('SELECT id,filename,latitude,longitude,embedding FROM tiles').fetchall(); c.close()
out=p/'data'/'retrieval_dataset.jsonl'
with out.open('w',encoding='utf-8') as f:
    for r in rows: f.write(json.dumps({'tile_id':r[0],'filename':r[1],'latitude':r[2],'longitude':r[3],'embedding':json.loads(r[4])})+'\n')
print(f'Exported {len(rows)} labelled samples to {out}. Next: split by geographic regions, train a Siamese/metric-learning encoder, then replace location.embedding() with the learned encoder and use FAISS/another vector index for scale.')
