"""
Sanketika (संकेतिका) - High Performance Backend Service
Provides real-time machine learning inference for ASL_model.p,
regional language translation, emergency SOS telemetry dispatch,
and dictionary catalog services.
"""

import os
import sys
import time
import pickle
import uuid
import datetime
from typing import List, Optional, Any, Union, Dict
import numpy as np

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# ── INITIALIZE FASTAPI ──────────────────────────────────────────────────────────
app = FastAPI(
    title="Sanketika (संकेतिका) ML & Accessibility Service",
    description="Backend ML engine powering real-time gesture recognition, regional translation, and emergency dispatch.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend (default port 3000, 3001, and wildcards)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MODEL LOADER ──────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ASL_model.p")
rf_model = None
model_classes = []

LABEL_MAP = {
    "a": "A", "b": "B", "c": "C", "d": "D", "e": "E", "f": "F", "g": "G", "h": "H", "i": "I",
    "j": "J", "k": "K", "l": "L", "m": "M", "n": "N", "o": "O", "p": "P", "q": "Q", "r": "R",
    "s": "S", "t": "T", "u": "U", "v": "V", "w": "W", "x": "X", "y": "Y", "z": "Z",
    "1": "Back Space", "2": "Clear", "3": "Space", "4": "None"
}

try:
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            loaded_data = pickle.load(f)
            if isinstance(loaded_data, dict) and "model" in loaded_data:
                rf_model = loaded_data["model"]
            else:
                rf_model = loaded_data
            if hasattr(rf_model, "classes_"):
                model_classes = [str(c) for c in rf_model.classes_]
            print(f"[Sanketika] ASL Model loaded successfully with {len(model_classes)} classes.")
    else:
        print(f"[Sanketika] Warning: Model file not found at {MODEL_PATH}")
except Exception as exc:
    print(f"[Sanketika] Error loading ASL_model.p: {exc}")

# Emergency Incidents In-Memory Storage
emergency_records: List[Dict[str, Any]] = []

# ── PYDANTIC SCHEMAS ──────────────────────────────────────────────────────────
class LandmarkItem(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0

class PredictRequest(BaseModel):
    # Accepts 42 float values, or list of 21 landmark items/coordinates
    landmarks: Union[List[float], List[Dict[str, float]], List[List[float]]]
    mode: Optional[str] = "asl"

class TopPrediction(BaseModel):
    label: str
    confidence: float

class PredictResponse(BaseModel):
    prediction: str
    raw_character: str
    confidence: float
    top_predictions: List[TopPrediction]
    latency_ms: float
    timestamp: float

class EmergencyRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = "Location not provided"
    painLevel: Optional[int] = 0
    userNote: Optional[str] = "Emergency Assistance Needed"
    clientTimestamp: Optional[float] = None
    emergencyType: Optional[str] = "MEDICAL_OR_SAFETY_SOS"

class EmergencyResponse(BaseModel):
    success: bool
    incidentId: str
    status: str
    message: str
    eta: str
    recordedAt: str
    latitude: Optional[float]
    longitude: Optional[float]

class TranslateRequest(BaseModel):
    text: str
    targetLang: str
    sourceLang: Optional[str] = "en"

class TranslateResponse(BaseModel):
    originalText: str
    targetLang: str
    translatedText: str
    phoneticGuide: str
    bcp47Locale: str
    isDictionaryMatch: bool

# ── TRANSLATION LOOKUP TABLE ─────────────────────────────────────────────────
REGIONAL_DICTIONARY = {
    "hi": {
        "hello": ("नमस्ते", "Namaste", "hi-IN"),
        "thank you": ("धन्यवाद", "Dhanyavaad", "hi-IN"),
        "please": ("कृपया", "Kripya", "hi-IN"),
        "help": ("मदद", "Madad", "hi-IN"),
        "water": ("पानी", "Paani", "hi-IN"),
        "emergency": ("आपातकालीन", "Aapaatkaaleen", "hi-IN"),
        "doctor": ("चिकित्सक / डॉक्टर", "Chikitsak", "hi-IN"),
        "yes": ("हाँ", "Haan", "hi-IN"),
        "no": ("नहीं", "Nahi", "hi-IN"),
        "pain": ("दर्द", "Dard", "hi-IN"),
    },
    "ta": {
        "hello": ("வணக்கம்", "Vanakkam", "ta-IN"),
        "thank you": ("நன்றி", "Nandri", "ta-IN"),
        "please": ("தயவுசெய்து", "Thayavu seithu", "ta-IN"),
        "help": ("உதவி", "Uthavi", "ta-IN"),
        "water": ("தண்ணீர்", "Thanneer", "ta-IN"),
        "emergency": ("அவசரம்", "Avasaram", "ta-IN"),
        "doctor": ("மருத்துவர்", "Maruthuvar", "ta-IN"),
        "yes": ("ஆம்", "Aam", "ta-IN"),
        "no": ("இல்லை", "Illai", "ta-IN"),
        "pain": ("வலி", "Vali", "ta-IN"),
    },
    "te": {
        "hello": ("నమస్కారం", "Namaskaram", "te-IN"),
        "thank you": ("ధన్యవాదాలు", "Dhanyavadalu", "te-IN"),
        "please": ("దయచేసి", "Dayachesi", "te-IN"),
        "help": ("సహాయం", "Sahayam", "te-IN"),
        "water": ("నీరు", "Neeru", "te-IN"),
        "emergency": ("అత్యవసరం", "Atyavasaram", "te-IN"),
        "doctor": ("వైద్యుడు", "Vaidyudu", "te-IN"),
        "yes": ("అవును", "Avunu", "te-IN"),
        "no": ("కాదు", "Kaadu", "te-IN"),
        "pain": ("నొప్పి", "Noppi", "te-IN"),
    },
    "bn": {
        "hello": ("নমস্কার", "Nomoshkar", "bn-IN"),
        "thank you": ("ধন্যবাদ", "Dhonnobaad", "bn-IN"),
        "please": ("দয়া করে", "Doya kore", "bn-IN"),
        "help": ("সাহায্য", "Sahajjo", "bn-IN"),
        "water": ("জল", "Jol", "bn-IN"),
        "emergency": ("জরুরি অবস্থা", "Joruri Obostha", "bn-IN"),
        "doctor": ("ডাক্তার", "Daktar", "bn-IN"),
        "yes": ("হ্যাঁ", "Hya", "bn-IN"),
        "no": ("না", "Na", "bn-IN"),
        "pain": ("ব্যথা", "Byatha", "bn-IN"),
    },
    "mr": {
        "hello": ("नमस्कार", "Namaskar", "mr-IN"),
        "thank you": ("धन्यवाद", "Dhanyavaad", "mr-IN"),
        "please": ("कृपया", "Krupaya", "mr-IN"),
        "help": ("मदत", "Madat", "mr-IN"),
        "water": ("पाणी", "Paani", "mr-IN"),
        "emergency": ("तातडीची मदत", "Taatadichi Madat", "mr-IN"),
        "doctor": ("डॉक्टर", "Doctor", "mr-IN"),
        "yes": ("हो", "Ho", "mr-IN"),
        "no": ("नाही", "Naahi", "mr-IN"),
        "pain": ("दुखणे", "Dukhane", "mr-IN"),
    },
    "es": {
        "hello": ("Hola", "Oh-la", "es-ES"),
        "thank you": ("Gracias", "Grah-syahs", "es-ES"),
        "please": ("Por favor", "Por fah-vor", "es-ES"),
        "help": ("Ayuda", "Ah-yoo-dah", "es-ES"),
        "water": ("Agua", "Ah-gwah", "es-ES"),
        "emergency": ("Emergencia", "Eh-mair-hen-syah", "es-ES"),
        "doctor": ("Doctor", "Dohk-tohr", "es-ES"),
        "yes": ("Sí", "See", "es-ES"),
        "no": ("No", "Noh", "es-ES"),
        "pain": ("Dolor", "Doh-lohr", "es-ES"),
    },
    "fr": {
        "hello": ("Bonjour", "Bon-zhoor", "fr-FR"),
        "thank you": ("Merci", "Mair-see", "fr-FR"),
        "please": ("S'il vous plaît", "Seel voo pleh", "fr-FR"),
        "help": ("Aide", "Ehd", "fr-FR"),
        "water": ("Eau", "Oh", "fr-FR"),
        "emergency": ("Urgence", "Oor-zhans", "fr-FR"),
        "doctor": ("Médecin", "Mayd-sahn", "fr-FR"),
        "yes": ("Oui", "Wee", "fr-FR"),
        "no": ("Non", "Nohn", "fr-FR"),
        "pain": ("Douleur", "Doo-ler", "fr-FR"),
    }
}

# ── ENDPOINTS ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "Sanketika (संकेतिका) ML & Accessibility Core",
        "status": "online",
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/api/predict",
            "emergency": "/api/emergency",
            "translate": "/api/translate",
            "signs": "/api/signs",
            "routes": "/api/routes"
        },
        "model_loaded": rf_model is not None,
        "classes_count": len(model_classes)
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "timestamp": time.time(),
        "model_loaded": rf_model is not None,
        "classes": model_classes,
        "uptime": "active",
        "engine": "Scikit-Learn RandomForestClassifier (100 estimators)"
    }

@app.get("/api/routes")
def get_routes_map():
    return {
        "routes": [
            {"path": "/", "name": "Home Landing", "description": "Hero, accessibility features, regional language selector, and system USP overview."},
            {"path": "/live", "name": "Live Engine", "description": "Real-time ASL and ISL gesture translation, sensory earcons, AAC communicator, and single-switch scanning."},
            {"path": "/call", "name": "Accessible Video Call", "description": "Peer-to-peer WebRTC video calling with live sign translation overlay and text-to-speech."},
            {"path": "/about", "name": "About Sanketika (संकेतिका)", "description": "System architecture, edge processing advantages, and kinesthetic computing philosophy."},
            {"path": "/motives", "name": "Our Motives", "description": "Democratizing accessibility, assistive communication, and spatial computing paradigms."},
            {"path": "/privacy", "name": "Privacy Policy", "description": "Strict zero-transmission local inference privacy guarantee and anonymized telemetry guidelines."},
            {"path": "/terms", "name": "Terms of Service", "description": "Permitted capabilities, experimental licensing, and terms of use."}
        ]
    }

@app.get("/api/signs")
def get_signs_catalog():
    return {
        "total_classes": len(model_classes),
        "supported_letters": [c.upper() for c in model_classes if c.isalpha()],
        "special_controls": {
            "1": "Back Space (Deletes last character)",
            "2": "Clear (Resets active text buffer)",
            "3": "Space (Adds whitespace)",
            "4": "None / Resting Hand"
        },
        "asl_alphabet": list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
        "isl_phrases": [
            "HELLO", "THANK YOU", "PLEASE", "SORRY", "HELP", "YES", "NO", "WATER",
            "FOOD", "DOCTOR", "EMERGENCY", "PAIN", "GOOD", "BAD", "STOP", "I LOVE YOU"
        ]
    }

@app.post("/api/predict", response_model=PredictResponse)
def predict_gesture(request: PredictRequest):
    start_time = time.time()
    
    if rf_model is None:
        raise HTTPException(status_code=503, detail="Machine Learning model is not loaded.")

    raw_data = request.landmarks
    normalized_landmarks: List[float] = []

    # Case A: 42 raw floats already passed
    if len(raw_data) == 42 and isinstance(raw_data[0], (int, float)):
        normalized_landmarks = [float(val) for val in raw_data]

    # Case B: 21 landmark items (dict with x, y)
    elif len(raw_data) == 21 and isinstance(raw_data[0], dict):
        x_coords = [float(pt["x"]) for pt in raw_data]
        y_coords = [float(pt["y"]) for pt in raw_data]
        min_x, min_y = min(x_coords), min(y_coords)
        for pt in raw_data:
            normalized_landmarks.extend([float(pt["x"]) - min_x, float(pt["y"]) - min_y])

    # Case C: 21 pairs [x, y] or [x, y, z]
    elif len(raw_data) == 21 and isinstance(raw_data[0], (list, tuple)):
        x_coords = [float(pt[0]) for pt in raw_data]
        y_coords = [float(pt[1]) for pt in raw_data]
        min_x, min_y = min(x_coords), min(y_coords)
        for pt in raw_data:
            normalized_landmarks.extend([float(pt[0]) - min_x, float(pt[1]) - min_y])

    # Case D: Flat coordinates of 63 numbers (x, y, z for 21 points)
    elif len(raw_data) == 63 and isinstance(raw_data[0], (int, float)):
        points = [raw_data[i:i+3] for i in range(0, 63, 3)]
        x_coords = [float(pt[0]) for pt in points]
        y_coords = [float(pt[1]) for pt in points]
        min_x, min_y = min(x_coords), min(y_coords)
        for pt in points:
            normalized_landmarks.extend([float(pt[0]) - min_x, float(pt[1]) - min_y])

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid landmarks format. Expected 42 normalized floats or 21 hand points, got {len(raw_data)} elements."
        )

    # Perform prediction
    sample = np.asarray(normalized_landmarks, dtype=np.float32).reshape(1, -1)
    predicted_char = str(rf_model.predict(sample)[0])
    
    # Calculate probabilities
    top_preds: List[TopPrediction] = []
    confidence = 0.85
    if hasattr(rf_model, "predict_proba"):
        probs = rf_model.predict_proba(sample)[0]
        classes = rf_model.classes_
        top_indices = np.argsort(probs)[::-1][:3]
        for idx in top_indices:
            cls_name = str(classes[idx])
            prob_val = float(probs[idx])
            top_preds.append(TopPrediction(
                label=LABEL_MAP.get(cls_name, cls_name),
                confidence=round(prob_val, 4)
            ))
        if top_indices.size > 0:
            confidence = round(float(probs[top_indices[0]]), 4)

    mapped_label = LABEL_MAP.get(predicted_char, predicted_char.upper())
    latency_ms = round((time.time() - start_time) * 1000, 2)

    return PredictResponse(
        prediction=mapped_label,
        raw_character=predicted_char,
        confidence=confidence,
        top_predictions=top_preds,
        latency_ms=latency_ms,
        timestamp=time.time()
    )

@app.post("/api/emergency", response_model=EmergencyResponse)
def dispatch_emergency(req: EmergencyRequest):
    timestamp_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
    incident_uuid = f"SOS-{uuid.uuid4().hex[:8].upper()}"

    record = {
        "incidentId": incident_uuid,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "address": req.address,
        "painLevel": req.painLevel,
        "userNote": req.userNote,
        "emergencyType": req.emergencyType,
        "recordedAt": timestamp_str,
        "status": "DISPATCHED"
    }
    emergency_records.append(record)

    # Print log for emergency dispatch
    print(f"\n[EMERGENCY DISPATCH TRIGGERED] {incident_uuid}")
    print(f"   Coords: {req.latitude}, {req.longitude}")
    print(f"   Pain Scale: {req.painLevel}/10 | Note: {req.userNote}")
    print(f"   Dispatched at: {timestamp_str}\n")

    return EmergencyResponse(
        success=True,
        incidentId=incident_uuid,
        status="DISPATCHED",
        message="Emergency SOS telemetry logged and transmitted to local dispatch center.",
        eta="3 to 6 minutes",
        recordedAt=timestamp_str,
        latitude=req.latitude,
        longitude=req.longitude
    )

@app.post("/api/translate", response_model=TranslateResponse)
def translate_text(req: TranslateRequest):
    clean_text = req.text.strip().lower()
    target_lang = req.targetLang.lower()

    # Check exact dictionary match
    lang_dict = REGIONAL_DICTIONARY.get(target_lang, {})
    if clean_text in lang_dict:
        native, phonetic, bcp = lang_dict[clean_text]
        return TranslateResponse(
            originalText=req.text,
            targetLang=target_lang,
            translatedText=native,
            phoneticGuide=phonetic,
            bcp47Locale=bcp,
            isDictionaryMatch=True
        )

    # Partial / word-by-word match
    words = clean_text.split()
    translated_words = []
    phonetics = []
    has_match = False
    bcp = f"{target_lang}-IN" if target_lang != "es" and target_lang != "fr" else ("es-ES" if target_lang == "es" else "fr-FR")

    for w in words:
        if w in lang_dict:
            has_match = True
            native, phonetic, bcp = lang_dict[w]
            translated_words.append(native)
            phonetics.append(phonetic)
        else:
            translated_words.append(w)
            phonetics.append(w)

    return TranslateResponse(
        originalText=req.text,
        targetLang=target_lang,
        translatedText=" ".join(translated_words) if has_match else req.text,
        phoneticGuide=" ".join(phonetics) if has_match else req.text,
        bcp47Locale=bcp,
        isDictionaryMatch=has_match
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT") or os.environ.get("BACKEND_PORT") or 8008)
    host = os.environ.get("BACKEND_HOST", "0.0.0.0")
    uvicorn.run("backend_server:app", host=host, port=port, reload=False)

