# BreatheWise AI — Project Overview
**PromptWars Virtual 2026 — Main Challenge 06: Urban Air Quality Assistant**  
**Participant:** Rajiv Kumar Sharma | **Organizer:** Google for Developers × Hack2skill  

---

## 1. Problem Context: The Urban Air Crisis
Every winter, metropolitan regions across northern India and industrial river basins experience severe atmospheric smog episodes. Key meteorological factors include:
- **Nocturnal Radiation Inversion:** Rapid radiative cooling of the ground at night creates an atmospheric temperature ceiling, trapping cold dense air and particulates within 100–300 meters of the surface.
- **Vehicular & Biomass Emissions:** Heavy morning and evening traffic congestion coincides with this inversion trap, driving PM2.5 concentrations up to 10–25 times above the WHO 24-hour safety benchmark (15 µg/m³).
- **Public Information Asymmetry:** Standard air quality apps show only raw AQI numbers (e.g., "AQI 340 - Hazardous"). Citizens are left without practical answers to basic daily questions:
  - *When is it safe to ventilate bedrooms without flooding the house with toxic particulates?*
  - *What is the actual particulate mass dose inhaled during an outdoor walk or jog?*
  - *Which travel mode provides the highest particulate filtration while cutting carbon emissions?*
  - *How can a family protect an asthmatic child or elderly parent on high-smog days without costly equipment?*

---

## 2. Product Identity: BreatheWise AI
- **Tagline:** *"Understand Your Air. Protect Your Day. Breathe Smarter."*
- **Positioning:** An intelligent decision-support assistant that bridges the gap between environmental sensor metrics and daily lifestyle routines.

---

## 3. Core Capabilities & Architecture Pillars

### Pillar A: Diurnal Inversion Timing & Indoor Ventilation
Rather than advising families to either "keep windows open" or "keep windows closed all day," BreatheWise AI analyzes the diurnal thermal cycle:
- **Danger Inversion Window (06:00 – 10:30 AM & 18:00 – 22:00 PM):** Ground air is stagnant; windows must remain sealed to block particulate ingress.
- **Safe Solar Convection Window (13:00 – 15:30 PM):** Peak solar radiation breaks the inversion ceiling, inducing vertical mixing and lowering surface PM2.5 by 35–55%. This is the optimal window for natural room ventilation.

### Pillar B: Inhaled Particulate Bio-Dose Inhalation Modeling
Based on the **ICRP (International Commission on Radiological Protection) Human Respiratory Tract Model**:
$$\text{Inhaled Mass } (\mu\text{g}) = \text{PM}_{2.5} (\mu\text{g/m}^3) \times \text{Respiration Rate } (\text{m}^3/\text{h}) \times \text{Time } (\text{h})$$
- Quantifies exact fine particulate deposition in pulmonary alveoli.
- Compares against the proportional WHO 24-hour reference exposure benchmark.
- Demonstrates measurable 95% particulate mass elimination using certified N95/N99 respirators.

### Pillar C: Sustainable Commute & Lifestyle Swap Engine
Compares 5 urban transit modes (Metro Rail, EV Bus/Cab, Carpooling, Solo ICE Car, Bicycle) for a user-specified trip distance (2–40 km):
- Computes CO₂ emissions (kg).
- Calculates CO₂ saved vs. solo petrol car baseline.
- Estimates particulate exposure during transit.
- Highlights the dual benefit of electric mass transit: zero tailpipe emissions and sealed, filtered cabin air.

### Pillar D: Context-Grounded GenAI Copilot
Powered by **Google Gemini 2.0 Flash**:
- Every response is strictly grounded in live measured metrics (PM2.5, PM10, NO₂, SO₂, O₃, CO, temperature, and wind speed).
- Never invents simulated numbers or unsupported clinical claims.
- Provides actionable steps, scientific rationales, and explicit medical disclaimers.

---

## 4. Target User Personas
1. **Urban Commuters & Office Workers:** Need optimal route planning, cabin recirculation advice, and mask guidance.
2. **Parents of Infants & School Children:** Require safe outdoor play guidance, school commute precautions, and bedroom air filtration protocols.
3. **Senior Citizens (65+) & Respiratory Patients:** Need blood pressure and bronchospasm precautions, avoiding early-morning inversion traps.
4. **Environmentally Conscious Citizens:** Seeking quantifiable carbon and particulate reduction metrics through public transit and sustainable habits.

---

## 5. Technical Specifications
- **Client Application:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend Service:** Python 3.12, FastAPI, Uvicorn, Pydantic v2.
- **External Data Providers:** Open-Meteo Air Quality API (Copernicus Atmosphere Monitoring Service & NOAA GFS).
- **GenAI Framework:** Google Gemini 2.0 Flash API via `google-genai` SDK.
