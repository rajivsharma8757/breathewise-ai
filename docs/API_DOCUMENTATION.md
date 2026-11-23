# API Documentation: BreatheWise AI
**PromptWars Virtual 2026 — Main Challenge 06: Urban Air Quality Assistant**  
**Backend:** FastAPI (Python 3.12) | **Base URL:** `http://localhost:8000` (or deployed URL)  

---

## 1. System Endpoints

### `GET /api/health`
Checks backend service availability and framework versioning.

**Response (200 OK):**
```json
{
  "status": "online",
  "service": "BreatheWise AI",
  "version": "1.0.0",
  "challenge": "PromptWars Virtual Main Challenge 06 - Urban Air Quality Assistant",
  "participant": "Rajiv Kumar Sharma",
  "frameworks": ["FastAPI", "Open-Meteo", "Gemini 2.0 Flash"]
}
```

---

### `GET /api/cities`
Returns a list of supported pre-geocoded metropolitan and regional cities across India and global hubs.

**Response (200 OK):**
```json
{
  "cities": [
    {
      "name": "New Delhi",
      "state": "Delhi",
      "country": "India",
      "lat": 28.6139,
      "lon": 77.2090
    },
    {
      "name": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "lat": 19.0760,
      "lon": 72.8777
    }
  ]
}
```

---

## 2. Environmental Intelligence Endpoints

### `GET /api/aqi`
Fetches real-time environmental metrics, pollutant breakdown, and hourly 24h forecasts.

**Parameters:**
- `city` (string, optional, default: `"delhi"`): City key or name.
- `lat` (float, optional): Latitude for custom GPS coordinate lookup.
- `lon` (float, optional): Longitude for custom GPS coordinate lookup.

**Example Request:**
```bash
curl "http://localhost:8000/api/aqi?city=delhi"
```

**Response (200 OK):**
```json
{
  "location": {
    "name": "New Delhi, Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "current": {
    "us_aqi": 218,
    "european_aqi": 82,
    "category": "Very Unhealthy",
    "category_color": "#8B5CF6",
    "severity_index": 5,
    "description": "Health alert: Significant risk across the general population.",
    "recommendation": "Avoid non-essential outdoor travel. Wear a certified N95 mask.",
    "pollutants": {
      "pm2_5": { "value": 138.4, "unit": "µg/m³", "safe_limit": 15.0 },
      "pm10": { "value": 245.8, "unit": "µg/m³", "safe_limit": 45.0 },
      "no2": { "value": 68.2, "unit": "µg/m³", "safe_limit": 25.0 },
      "so2": { "value": 24.1, "unit": "µg/m³", "safe_limit": 40.0 },
      "o3": { "value": 42.0, "unit": "µg/m³", "safe_limit": 100.0 },
      "co": { "value": 1.45, "unit": "mg/m³", "safe_limit": 4.0 }
    },
    "weather": {
      "temperature": 20.8,
      "humidity": 72,
      "wind_speed": 4.8,
      "wind_direction": 295,
      "condition": "Severe Smog / Inversion"
    },
    "optimal_outdoor_window": "13:30 (AQI ~165)",
    "worst_smog_window": "07:30 (AQI ~290)",
    "updated_at": "2026-11-23 16:30 UTC",
    "data_source": "Open-Meteo Air Quality & Weather API (Copernicus CAMS & GFS Grounded)",
    "is_live": true
  },
  "hourly_forecast": [
    {
      "timestamp": "2026-11-23T06:00",
      "hour": "06:00",
      "aqi": 275,
      "pm25": 175.0,
      "pm10": 295.0,
      "category": "Very Unhealthy",
      "color": "#8B5CF6"
    }
  ]
}
```

---

## 3. Decision Support Endpoints

### `GET /api/plan`
Generates an evidence-grounded 24-hour daily routine and calculates personal particulate Bio-Dose.

**Parameters:**
- `city` (string, optional, default: `"delhi"`)
- `profile` (string, optional, default: `"adult"`): One of `adult`, `child`, `senior`, `patient`.

**Response (200 OK):**
```json
{
  "location": { "name": "New Delhi, Delhi" },
  "profile": "child",
  "current_aqi": 218,
  "category": "Very Unhealthy",
  "routine": {
    "morning_routine": "STRICTLY INDOOR. Cancel outdoor school play. Cold morning air traps vehicular exhaust.",
    "commute_advice": "Take closed AC bus or metro rail. Avoid open two-wheelers.",
    "ventilation_window": "Keep bedroom windows sealed during morning and evening. Safe ventilation: 1:00 PM – 3:30 PM.",
    "evening_routine": "Indoor study and activities. Run HEPA air purification in bedrooms.",
    "mask_recommendation": "Child-sized certified N95 respirator with airtight perimeter seal.",
    "bio_dose": {
      "unprotected_dose_ug": 138.4,
      "n95_protected_dose_ug": 6.9,
      "dose_saved_ug": 131.5,
      "who_benchmark_ratio": 9.2,
      "risk_tier": "Severe Inhalation Exposure",
      "respiration_rate_m3h": 0.5,
      "assumptions": "Assumes 0.5 m³/h respiration rate (pediatric rest model) over 2.0h outdoors."
    },
    "scientific_explanation": "Winter temperature inversion traps particulate emissions within the shallow nocturnal planetary boundary layer.",
    "limitations": "Advisory generated from ambient meteorological sensors; not a clinical diagnostic prescription."
  }
}
```

---

### `GET /api/indoor-hacks`
Returns tailored indoor air quality improvement protocols.

**Response (200 OK):**
```json
{
  "location": { "name": "New Delhi, Delhi" },
  "current_aqi": 218,
  "category": "Very Unhealthy",
  "hacks": [
    {
      "id": "ventilation_timing",
      "title": "Smart Inversion Ventilation Window",
      "category": "Air Exchange",
      "icon": "Wind",
      "action": "Open windows ONLY between 1:00 PM and 3:30 PM.",
      "why": "Nocturnal radiation cooling creates a low-altitude inversion ceiling trapping ground smoke. Solar heating breaks this lid in early afternoon.",
      "impact": "Reduces indoor PM2.5 infiltration by 45–60% vs morning opening.",
      "difficulty": "Easy (Zero Cost)"
    }
  ]
}
```

---

### `GET /api/sustainable-swaps`
Compares 5 urban commute options across carbon footprint and particulate bio-dose.

**Parameters:**
- `distance_km` (float, default: `12.0`, range: `1.0` to `100.0`).

**Response (200 OK):**
```json
{
  "distance_km": 14.0,
  "baseline_car_emissions_kg": 2.69,
  "modes": [
    {
      "mode": "Metro Rail (Electric)",
      "co2_emissions_kg": 0.21,
      "co2_saved_vs_car_kg": 2.48,
      "pm25_exposure_ug": 58.8,
      "calories_burned": 95,
      "duration_min": 39,
      "sustainability_score": 96,
      "badge": "Lowest Carbon & Sealed Air"
    }
  ]
}
```

---

### `POST /api/chat`
Conversational endpoint grounded in live sensor data.

**Request Body:**
```json
{
  "message": "Is it safe to run outdoors today?",
  "city": "delhi"
}
```

**Response (200 OK):**
```json
{
  "answer": "**Direct Recommendation:** It is NOT advisable to exercise outdoors right now in New Delhi, Delhi.\n\n**Measured Data:** US AQI is currently **218 (Very Unhealthy)** with PM2.5 at **138.4 µg/m³** (9.2x WHO safe benchmark). Heavy cardio multiplies ventilation rate to 2.5 m³/h, causing acute pulmonary deposition.",
  "grounded_data": {
    "city": "New Delhi, Delhi",
    "aqi": 218,
    "pm25": 138.4,
    "temperature": 20.8
  },
  "powered_by": "BreatheWise Grounded Reasoning Engine",
  "timestamp": "22:00:15"
}
```
