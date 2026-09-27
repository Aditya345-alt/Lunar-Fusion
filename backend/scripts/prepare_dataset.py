"""Prepare a geographically-labelled lunar tile dataset from selected LRO-NAC images.
Usage: python scripts/prepare_dataset.py --images ./lro --metadata ./metadata.csv
CSV columns: filename,latitude,longitude,resolution_m,sun_azimuth,sun_elevation
"""
import argparse, csv
from pathlib import Path
import requests
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from location import add_tile

ap=argparse.ArgumentParser(); ap.add_argument('--images',required=True); ap.add_argument('--metadata',required=True); args=ap.parse_args()
rows={r['filename']:r for r in csv.DictReader(open(args.metadata,newline='',encoding='utf-8'))}
count=0
for p in Path(args.images).rglob('*'):
    if p.suffix.lower() not in {'.png','.jpg','.jpeg','.tif','.tiff','.jp2'} or p.name not in rows: continue
    r=rows[p.name]
    add_tile(p.read_bytes(),p.name,'LRO-NAC',float(r['latitude']),float(r['longitude']),float(r['resolution_m']) if r.get('resolution_m') else None,float(r['sun_azimuth']) if r.get('sun_azimuth') else None,float(r['sun_elevation']) if r.get('sun_elevation') else None)
    count+=1
print(f'Indexed {count} LRO-NAC images. Split them geographically for train/val/test before training a learned encoder.')
