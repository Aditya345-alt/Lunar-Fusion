# Lunar Fusion — Working Prototype

End-to-end prototype for Chandrayaan-2 (OHRC/TMC-2/IIRS) → automatic lunar-location retrieval → LRO-NAC candidate selection → correspondence → RANSAC registration → metrics.

## Run on Windows
```powershell
cd backend
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
In another terminal:
```powershell
pnpm install
pnpm dev
```
Open the Vite URL.

## Make it work immediately (offline demo)
```powershell
cd backend
.venv\Scripts\activate
python scripts\generate_demo_catalog.py
```
The demo catalog is synthetic and is only for testing the software pipeline. It is not LRO science data.

## Add selected real LRO-NAC data
Prepare a CSV with `filename,latitude,longitude,resolution_m,sun_azimuth,sun_elevation`, put matching images in a folder, then:
```powershell
python scripts/prepare_dataset.py --images .\lro --metadata .\metadata.csv
```
Do not attempt to mirror the complete LROC archive. Index selected geographically-labelled observations/tiles.

## Retrieval/training
The current location retriever is a deterministic, illumination-tolerant visual embedding baseline so the prototype works without a GPU or external vector service. Export it with:
```powershell
python scripts/train_retrieval.py
```
For the research version, train a metric-learning/Siamese encoder on real lunar patches plus controlled scale, illumination, blur/noise and resolution variations. Split by geographic region to prevent leakage, then use FAISS or another vector index for large catalogs.

## API
- `GET /api/health`
- `GET /api/catalog/status`
- `POST /api/catalog/index`
- `GET /api/catalog/tile/{id}`
- `GET /api/catalog/tile/{id}/meta`
- `POST /api/locate`
- `POST /api/metadata`
- `POST /api/match`
