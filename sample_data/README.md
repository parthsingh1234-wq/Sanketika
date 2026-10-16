# 📊 Sanketika — Sample Data & Test Payloads

This directory provides standardized sample input payloads for testing and validating the Sanketika API endpoints, edge models, and accessibility services.

---

## 📁 Included Sample Datasets

| File | Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **[`sample_landmarks_asl.json`](sample_landmarks_asl.json)** | `/api/predict` | `POST` | 42-element normalized (x, y) hand coordinate sequence representing an ASL gesture for inference validation. |
| **[`sample_emergency_sos.json`](sample_emergency_sos.json)** | `/api/emergency` | `POST` | GPS telemetry coordinates, Wong-Baker pain score (0–10), and distress notes dispatched by non-verbal users. |
| **[`sample_translation.json`](sample_translation.json)** | `/api/translate` | `POST` | English source text mapped to regional target language (`hi`, `ta`, `te`, `bn`, `es`, etc.) with phonetics. |
| **`../signs.json`** | `/api/signs` | `GET` | Complete catalog of 30+ gesture dictionary IDs, finger mappings, and ISL labels. |

---

## 🧪 Quick Test Commands (cURL)

### 1. Test Gesture Prediction (`/api/predict`)
```bash
# Against Next.js Web App API Route (Port 3005)
curl -X POST http://localhost:3005/api/predict \
  -H "Content-Type: application/json" \
  -d @sample_data/sample_landmarks_asl.json

# Against Python FastAPI ML Backend (Port 8008)
curl -X POST http://127.0.0.1:8008/api/predict \
  -H "Content-Type: application/json" \
  -d @sample_data/sample_landmarks_asl.json
```

### 2. Test Emergency SOS Telemetry Dispatch (`/api/emergency`)
```bash
curl -X POST http://localhost:3005/api/emergency \
  -H "Content-Type: application/json" \
  -d @sample_data/sample_emergency_sos.json
```

### 3. Test Regional Language Translation (`/api/translate`)
```bash
curl -X POST http://localhost:3005/api/translate \
  -H "Content-Type: application/json" \
  -d @sample_data/sample_translation.json
```

---

## 🔬 Model Data Files in Repository Root

- **`ASL_model.p`** (16.3 MB): Pre-trained Scikit-Learn Random Forest ensemble classifier (100 estimators) trained on 21 hand landmarks across 30 gesture classes.
- **`ASL.pickle`** (3.6 MB): Extracted landmark dataset arrays (`data`, `labels`) generated from MediaPipe keypoint pipelines.
- **`model.json`** & **`isl_model.tflite`**: Edge-optimized TensorFlow.js / TFLite neural models loaded in browser RAM.
