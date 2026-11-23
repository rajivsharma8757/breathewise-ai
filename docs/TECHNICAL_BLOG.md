# Engineering BreatheWise AI: How We Built a GenAI Urban Air Quality Assistant for PromptWars Virtual 2026
**Author:** Rajiv Kumar Sharma  
**Event:** PromptWars Virtual 2026 (Google for Developers × Hack2skill) — Main Challenge 06  
**Stack:** Google Antigravity, React 19, TypeScript, Tailwind CSS v4, FastAPI, Google Gemini 2.0 Flash, Open-Meteo  

---

## 1. Introduction: Beyond the Number on the Screen
Every winter, metropolitan cities across northern India and industrial river basins experience catastrophic smog inversions. When an air quality app displays **"AQI 380 - Hazardous"**, what does that actually mean for a family? 

Does it mean you should seal every window all day, letting indoor CO₂ and cooking VOCs build up? Does it mean walking to the local grocery store delivers the same particulate dose as a 5-kilometer jog?

The truth is, standard AQI apps fail at **decision support**. They present raw numbers without contextual translation into human life. 

For **PromptWars Virtual 2026 — Main Challenge 06**, I set out to build **BreatheWise AI**: an intelligent assistant that transforms raw atmospheric sensor feeds into actionable, explainable, and scientifically validated daily guidance.

---

## 2. Atmospheric Physics: The Diurnal Temperature Inversion
To give real advice, an application must understand atmospheric physics:
During winter nights, the Earth's surface rapidly radiates heat into space. The air in contact with the ground cools much faster than the air above it, establishing a **temperature inversion ceiling** (cold, dense air trapped beneath a warmer aloft layer). 

Under normal daytime conditions, warm air rises and disperses pollutants vertically. During a morning inversion (6:00 AM – 10:00 AM), vehicular exhaust, dust, and smoke are trapped within a shallow boundary layer of just 100–250 meters. 

**The BreatheWise AI Solution:**
Instead of generic ventilation advice, BreatheWise AI models the diurnal curve:
- **06:00 – 10:30 AM (Inversion Trap):** Exterior windows must remain sealed to prevent ground particulate flooding.
- **13:00 – 15:30 PM (Solar Convection Window):** Solar radiation breaks the inversion ceiling, inducing vertical mixing and reducing surface PM2.5 by 35–55%. This is the optimal window for natural fresh air exchange.

---

## 3. Mathematical Modeling: Inhaled Particulate Bio-Dose
Not all outdoor exposure is equal. Walking slowly is biologically different from running. 

BreatheWise AI implements the **ICRP (International Commission on Radiological Protection) Human Respiratory Tract Model**:
$$\text{Inhaled Mass } (\mu\text{g}) = \text{PM}_{2.5} \left(\frac{\mu\text{g}}{\text{m}^3}\right) \times \text{Ventilation Rate } \left(\frac{\text{m}^3}{\text{h}}\right) \times \text{Duration } (\text{h})$$

- **Resting / Sedentary:** $\approx 0.5\text{ m}^3/\text{h}$
- **Transit Commute:** $\approx 1.0\text{ m}^3/\text{h}$
- **Brisk Walking:** $\approx 1.3\text{ m}^3/\text{h}$
- **Cardio Running:** $\approx 2.5\text{ m}^3/\text{h}$

### Why This Matters:
A citizen jogging for 1 hour at an outdoor AQI of 220 ($\text{PM}_{2.5} = 110\,\mu\text{g/m}^3$) inhales:
$$110\,\mu\text{g/m}^3 \times 2.5\,\text{m}^3/\text{h} \times 1\,\text{h} = 275\,\mu\text{g of fine particulate matter}$$
This is more than **15 times** the WHO daily reference inhalation baseline! The app visualizes this dose dynamically and demonstrates that wearing a certified, sealed N95 respirator reduces that dose by 95% ($13.8\,\mu\text{g}$), saving $261.2\,\mu\text{g}$ of pulmonary alveolar deposition.

---

## 4. System Architecture & Tech Stack

```
React 19 + Vite (Frontend)
   │
   ▼ HTTP/REST (Port 8000)
FastAPI Backend (Python 3.12)
   ├── Open-Meteo Air Quality & Weather API (Copernicus CAMS & GFS)
   ├── Google Gemini 2.0 Flash (Grounded Reasoning)
   └── Deterministic Clinical Heuristic Fallback Engine
```

### Prompt Grounding Architecture:
To prevent LLM hallucinations, BreatheWise AI injects live sensor readings directly into structured system prompts:
```python
grounded_system = (
    f"You are BreatheWise AI's clinical environmental health specialist for {city}. "
    f"Ground your answer strictly in these real measurements: "
    f"AQI: {us_aqi} ({category}), PM2.5: {pm25} µg/m³, PM10: {pm10} µg/m³, NO2: {no2} µg/m³, "
    f"Temperature: {temp}°C, Wind Speed: {wind} km/h. "
    f"Structure: 1. Direct Recommendation, 2. Measured Data & Scientific Why, "
    f"3. Practical Tips/Alternatives, 4. Medical Disclaimer."
)
```

---

## 5. Development with Google Antigravity
Developing this project inside Google Antigravity enabled intent-driven engineering:
- Automated scaffolding of React 19 + Tailwind v4 frontend.
- Zero-drift Pydantic v2 data contracts between Python and TypeScript.
- Comprehensive end-to-end integration tests (`test_api_endpoints.py`) testing all 9 routes with 100% pass rates.
- Verification of repository footprint (under 116 KiB, well within the 10 MB competition limit).

---

## 6. Key Learnings & Conclusion
1. **Explainability Drives Action:** People don't change habits because of an abstract number; they change habits when you explain *why* an action works (e.g. diurnal inversion timing).
2. **Grounding is Non-Negotiable:** In health and environmental applications, GenAI must be firmly grounded in verified, real-world sensor streams.
3. **True Accessibility:** Making the application bilingual (English and Hindi) ensures real communities can benefit from air quality decision support.

*Built for PromptWars Virtual 2026 by Rajiv Kumar Sharma.*
