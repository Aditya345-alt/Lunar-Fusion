"""Generate deterministic synthetic lunar-like reference tiles so the UI can be tested offline.
These are NOT LRO-NAC science data and must not be presented as real imagery.
"""
from pathlib import Path
import cv2, numpy as np, sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from location import add_tile
out=Path(__file__).resolve().parents[1]/'demo_tiles'; out.mkdir(exist_ok=True)
rng=np.random.default_rng(26166)
for i,(lat,lon) in enumerate([(89.67,0.0),(84.2,32.5),(-12.4,44.8),(18.42,42.17),(3.1,-17.7),(55.3,-101.2)]):
    im=np.full((512,512),115,np.uint8)
    for _ in range(35):
        x,y=int(rng.integers(20,492)),int(rng.integers(20,492)); r=int(rng.integers(5,55)); shade=int(rng.integers(55,190))
        cv2.circle(im,(x,y),r,shade,2); cv2.circle(im,(x-2,y-2),max(1,r//2),shade//2,1)
    im=cv2.GaussianBlur(im,(5,5),0); im=np.clip(im+rng.normal(0,8,im.shape),0,255).astype(np.uint8)
    p=out/f'demo_lro_nac_{i}.png'; cv2.imwrite(str(p),im)
    add_tile(p.read_bytes(),p.name,'LRO-NAC',lat,lon,1.5,120+i*17,35+i*4)
print('Demo catalog ready. Synthetic only.')
