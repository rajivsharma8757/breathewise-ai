# 🌫️ BreatheWise AI — Intelligent Urban Air Quality Assistant
> *"Understand Your Air. Protect Your Day. Breathe Smarter."*

[![PromptWars Virtual 2026](https://img.shields.io/badge/Event-PromptWars%20Virtual%202026-blue)](https://promptwars.in/promptwarsVirtual.html)
[![Organizer](https://img.shields.io/badge/Organizers-Google%20for%20Developers%20%C3%97%20Hack2skill-green)](https://hack2skill.com)
[![Challenge](https://img.shields.io/badge/Main%20Challenge-06%3A%20Urban%20Air%20Quality-emerald)](https://promptwars.in/promptwarsVirtual.html)
[![Participant](https://img.shields.io/badge/Participant-Rajiv%20Kumar%20Sharma-orange)](https://www.linkedin.com/in/rajiv-kumar-sharma-497a58246/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🌟 Executive Summary & Problem-Solution Fit
During winter months across urban metropolises and river valleys (notably the Indo-Gangetic Basin), severe temperature inversions trap vehicular exhaust, industrial fumes, and dust close to the ground, pushing AQI well past hazardous thresholds (300–500+). 

Traditional air quality portals merely display an alarming AQI number with generic, unhelpful warnings. **BreatheWise AI** is a real-world **decision-support platform** that bridges the gap between raw environmental sensor data and practical human life:
- **Diurnal Ventilation Windows:** Informs families precisely *when* solar convection dilutes smog (1:00 PM – 3:30 PM) vs. when nocturnal inversion traps ground pollutants (6:00 AM – 10:00 AM).
- **Inhaled Particulate Bio-Dose:** Quantifies personal microscopic particulate inhalation mass ($\mu\text{g}$) and cigarette equivalents based on minute ventilation rates ($0.5$ to $2.5\text{ m}^3/\text{h}$) and duration.
- **Evidence-Based Family Protection:** Distinct physiological vulnerability tracks for Infants/Children, Active Adults, Expectant Mothers, and Senior/Asthma Patients.
- **Sustainable Commute & Lifestyle Engine:** Directly compares Metro, EV, Carpool, ICE Solo Car, and Bicycle for CO₂ savings and particulate exposure.
- **Grounded GenAI Copilot:** Powered by Google Gemini, grounded strictly in live measurements with zero hallucinated figures.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Frontend                        │
│         React 19 • TypeScript • Vite • Tailwind CSS v4      │
│  (10 Production Screens • Bilingual EN/HI • PDF Advisory)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (Port 8000)
┌──────────────────────────────▼──────────────────────────────┐
│                    FastAPI Backend Engine                   │
│          Python 3.12 • Pydantic v2 • Async HTTPX Client     │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
┌───────────────▼─────────────┐ ┌─────────────▼───────────────┐
│     Environmental Pipeline  │ │       GenAI Reasoning       │
│  Open-Meteo Air Quality API │ │   Google Gemini 2.0 Flash   │
│  Copernicus CAMS & GFS      │ │   Context-Grounded Engine   │
│  PM2.5, PM10, NO2, SO2, O3  │ │   Bio-Dose Clinical Model   │
└─────────────────────────────┘ └─────────────────────────────┘
```

---

## 🚀 Key Modules & Screen Directory

1. **Landing Hero & Live Air Pulse:** Hero tagline, real-time AQI gauge, pollutant snapshot, and active inversion alerts.
2. **Live AQI Intelligence Dashboard:** Dual US EPA (0–500) and European AQI (0–100) scales, 6 pollutant cards (PM2.5, PM10, NO₂, SO₂, O₃, CO) with safe limits and health severity ratios.
3. **Personalized Daily Routine Planner:** 4-phase daily schedule (Morning, Commute, Ventilation, Evening) with profile switcher (Adult, Child, Senior, Asthma) and N95 facial seal guidance.
4. **Smart Pollution Bio-Dose Calculator:** Interactive slider calculating inhaled PM2.5 mass ($\mu\text{g}$) and cigarette equivalents with N95 filter protection savings.
5. **Indoor Air Quality (IAQ) Assistant:** Real-time natural ventilation indicator and 5 zero/low-cost practical hacks (Dual-phase kitchen exhaust, microfiber damp mopping, DIY Corsi-Rosenthal boxes, plant bio-filtration).
6. **Gemini GenAI Environmental Copilot:** Context-grounded assistant answering complex lifestyle and protective queries with live readings.
7. **Sustainable Commute & Lifestyle Swap Engine:** Comparative transit calculator (Metro vs EV vs Carpool vs ICE Car vs Bicycle) showing CO₂ saved and particulate exposure.
8. **24-Hour Pollution Trends & Inversion Analysis:** Hourly bar timeline with peak smog warnings and 4-phase diurnal inversion explanations.
9. **Regional Pollution Map & Hub Explorer:** Spatial overview of monitoring stations across major metropolitan basins with one-click station switching.
10. **Family Safety Protocols:** Specialized guidelines for developing pediatric lungs, pregnant mothers, seniors 65+, and respiratory patients.
11. **Intercity Pollution Comparison:** Multi-city live comparison table sorted by AQI severity.
12. **Daily Air Quality Report Generator:** Formatted health advisory card with one-click printing/PDF export.
13. **Bilingual Accessibility:** Complete English and Hindi (हिंदी) localization.

---

## 📐 Scientific Formulas & Methodology

### 1. Inhaled Particulate Bio-Dose Model
$$\text{Inhaled Dose } (\mu\text{g}) = \text{PM}_{2.5} \left(\frac{\mu\text{g}}{\text{m}^3}\right) \times \text{Breathing Rate } \left(\frac{\text{m}^3}{\text{h}}\right) \times \text{Exposure Duration } (\text{h})$$

- **Resting / Desk Work:** $0.5\text{ m}^3/\text{h}$
- **Light Transit:** $1.0\text{ m}^3/\text{h}$
- **Brisk Walking:** $1.3\text{ m}^3/\text{h}$
- **Cardio Jogging / Running:** $2.5\text{ m}^3/\text{h}$

### 2. Cigarette Equivalence (Berkeley Earth Benchmark)
$$\text{Cigarette Equivalent} = \frac{\text{Inhaled PM}_{2.5} \text{ Dose } (\mu\text{g})}{22.0\text{ }\mu\text{g}}$$

---

## 🛠️ Quickstart Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on v26)
- **Python** 3.10+ (tested on 3.12)
- **Google Antigravity** / Git

### 2. Backend Setup
```bash
cd backend
python -m pip install fastapi pydantic uvicorn httpx google-genai
python main.py
```
*Backend runs on `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with proxy routing to the backend.*

### 4. Optional: Gemini API Key
To enable cloud Gemini 2.0 Flash reasoning:
```bash
# In backend/.env or system environment
export GEMINI_API_KEY="your-gemini-api-key"
```
*(If unset, BreatheWise AI automatically runs on its built-in grounded heuristic clinical reasoning engine with 0 downtime.)*

---

## 🧪 Testing & Verification
A comprehensive test suite validates all 9 REST endpoints:
```bash
cd backend
python test_api_endpoints.py
```
Output:
```
PASS: /api/health
PASS: /api/cities (21 cities registered)
PASS: /api/aqi (Delhi AQI: 168, Unhealthy)
PASS: /api/plan (Personalized Routine & Bio-Dose verified)
PASS: /api/indoor-hacks (5 actionable hacks)
PASS: /api/sustainable-swaps (5 transit modes compared)
PASS: /api/compare (4 cities compared)
PASS: /api/briefing
PASS: /api/chat (Grounded Copilot response verified)
ALL 9 ENDPOINT INTEGRATION TESTS PASSED 100%!
```

Frontend production verification:
```bash
cd frontend
npm run build
```
Compiled cleanly in under 1 second with 0 lint/TypeScript warnings.

---

## 🌐 Deployment Architecture
- **Frontend:** Deployable directly to **Vercel** (`cd frontend && vercel deploy`) or **Netlify**.
- **Backend:** Deployable directly to **Render**, **Railway**, or **Google Cloud Run** using standard ASGI container (`uvicorn main:app --host 0.0.0.0 --port $PORT`).

---

## 🏆 Submission Context & Fair Play
- **Event:** PromptWars Virtual 2026
- **Challenge:** Main Challenge 06: Urban Air Quality Assistant
- **Participant:** Rajiv Kumar Sharma
- **Submission Deadline:** 29 November 2026, 11:59 PM IST
- **Ethical Integrity:** Clean original implementation, zero plagiarized templates, verified live sensor integration, and complete data transparency.

---
*Built with ❤️ in India by Rajiv Kumar Sharma for Google for Developers × Hack2skill.*
