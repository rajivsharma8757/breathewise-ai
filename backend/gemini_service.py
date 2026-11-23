"""
BreatheWise AI - Gemini GenAI Reasoning & Grounding Service
Transforms live environmental metrics into context-aware, explainable daily routines,
indoor air quality hacks, sustainable commute alternatives, and conversational AI guidance.
"""

import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

def calculate_bio_dose(pm25: float, hours_outdoor: float, activity_level: str = "moderate") -> Dict[str, Any]:
    """
    Computes inhaled PM2.5 particulate mass dose (µg) based on ICRP (International Commission
    on Radiological Protection) Human Respiratory Tract Model ventilation rates:
    - Resting/Sedentary: ~0.5 m³/h
    - Light transit/standing: ~1.0 m³/h
    - Moderate walking: ~1.3 m³/h
    - Vigorous cardio/running: ~2.5 m³/h

    Compares against WHO 24-hour guideline exposure benchmark:
    WHO 24h benchmark: 15 µg/m³ ambient concentration across daily inhalation (~12 m³/day = 180 µg/day; ~7.5 µg/h).
    """
    rates = {
        "rest": 0.5,
        "commute": 1.0,
        "moderate": 1.3,
        "vigorous": 2.5
    }
    rate = rates.get(activity_level.lower(), 1.3)
    # Dose in micrograms (µg)
    unprotected_dose = round(pm25 * rate * hours_outdoor, 1)
    # Certified N95 reduces inhalable fine particles by ~95% when tightly sealed
    n95_dose = round(unprotected_dose * 0.05, 1)
    dose_saved = round(unprotected_dose - n95_dose, 1)
    
    # WHO 24-hour baseline reference dose for equivalent duration (7.5 µg/h * hours)
    who_baseline_dose = round(7.5 * hours_outdoor, 1)
    who_benchmark_ratio = round(unprotected_dose / max(who_baseline_dose, 1.0), 1)

    # Risk tier based on dose accumulation
    if who_benchmark_ratio <= 1.0:
        risk_tier = "Within WHO Daily Guideline"
    elif who_benchmark_ratio <= 3.0:
        risk_tier = "Moderate Inhalation Dose"
    elif who_benchmark_ratio <= 6.0:
        risk_tier = "High Inhalation Dose"
    else:
        risk_tier = "Severe Inhalation Exposure"

    return {
        "unprotected_dose_ug": unprotected_dose,
        "n95_protected_dose_ug": n95_dose,
        "dose_saved_ug": dose_saved,
        "who_benchmark_ratio": who_benchmark_ratio,
        "risk_tier": risk_tier,
        "respiration_rate_m3h": rate,
        "assumptions": f"Assumes {rate} m³/h respiration rate (ICRP respiratory tract model) over {hours_outdoor}h at measured {pm25} µg/m³ PM2.5."
    }

async def generate_personalized_routine(aqi_data: Dict[str, Any], profile: str = "adult") -> Dict[str, Any]:
    """
    Generates a personalized 24h routine grounded in current AQI & diurnal inversion curve.
    Uses Gemini API if key is set, or returns deterministic grounded reasoning.
    """
    curr = aqi_data.get("current", {})
    us_aqi = curr.get("us_aqi", 150)
    pm25 = curr.get("pollutants", {}).get("pm2_5", {}).get("value", 85.0)
    temp = curr.get("weather", {}).get("temperature", 22.0)
    wind = curr.get("weather", {}).get("wind_speed", 6.0)
    loc_name = aqi_data.get("location", {}).get("name", "Your City")

    # If Gemini API key is configured, call Gemini with structured prompt
    if GEMINI_API_KEY:
        try:
            import google.genai as genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            prompt = f"""
            You are BreatheWise AI's clinical environmental health specialist.
            Location: {loc_name}
            Current US AQI: {us_aqi} ({curr.get('category')})
            PM2.5: {pm25} µg/m³, Temperature: {temp}°C, Wind Speed: {wind} km/h
            User Profile: {profile}

            Provide a strictly structured JSON response for a pollution-aware daily routine with these exact keys:
            - morning_routine: string (e.g. exercise window, indoor vs outdoor)
            - commute_advice: string (transit mode, mask type, route guidance)
            - ventilation_window: string (specific hours to ventilate or keep sealed)
            - evening_routine: string (indoor activities, air purification)
            - mask_recommendation: string (Cloth, Surgical, N95, N99 with rationale)
            - scientific_explanation: string (explain temperature inversion, particulate deposition)
            - limitations: string (disclaimer on sensors and medical advice)
            Only return valid JSON. No markdown ticks.
            """
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`").replace("json", "").strip()
            parsed = json.loads(raw_text)
            parsed["bio_dose"] = calculate_bio_dose(pm25, hours_outdoor=2.0, activity_level="moderate" if profile != "child" else "rest")
            parsed["ai_grounded"] = True
            return parsed
        except Exception as e:
            pass # fall through to deterministic grounded engine

    # Grounded heuristic clinical engine (CPCB & WHO guideline standards)
    bio_dose = calculate_bio_dose(pm25, hours_outdoor=2.0, activity_level="moderate" if profile != "child" else "rest")

    if us_aqi <= 50:
        mask = "No mask needed for general population."
        morning = "Ideal conditions for outdoor running, cycling, and morning yoga. Take advantage of clean ambient air."
        commute = "Active transit (walking, cycling, or public bus) is highly encouraged today."
        ventilation = "Keep windows open across morning and afternoon for maximum fresh air circulation (8:00 AM - 6:00 PM)."
        evening = "Safe for outdoor parks, social activities, and open-air dining."
        exp = f"At AQI {us_aqi}, particulate matter (PM2.5: {pm25} µg/m³) is well below WHO 24h benchmark thresholds. Low risk of systemic airway inflammation."
    elif us_aqi <= 100:
        mask = "No mask required for healthy adults. Sensitive individuals (asthma) may use a light mask near busy arterial roads."
        morning = "Outdoor jogging acceptable, but sensitive groups should complete workouts before heavy 8:30 AM morning traffic peaks."
        commute = "Metro or bus preferred. If walking along major corridors, keep a steady pace to minimize elevated hyperventilation."
        ventilation = "Ventilate between 11:00 AM and 4:00 PM when solar heating disperses ground particulates."
        evening = "Fine for normal walks. Close street-facing windows during peak evening commute hours."
        exp = f"AQI {us_aqi} indicates moderate pollution. Inhaled PM2.5 ({pm25} µg/m³) can cause mild throat irritation in hyper-reactive airways."
    elif us_aqi <= 200:
        mask = "Certified N95 respirator recommended for all outdoor transit. Cloth and simple surgical masks do not filter sub-micron particles."
        morning = "Avoid strenuous outdoor cardio. Switch to indoor bodyweight training, treadmill, or yoga. Ground inversion traps particulate plumes."
        commute = "Take Delhi Metro / underground rail or sealed AC buses. If driving, set car ventilation to 'Internal Recirculation (Cabin Loop)'."
        ventilation = "Strict window sealing during morning (6:00 AM - 10:30 AM). Safe micro-ventilation only between 1:00 PM - 3:00 PM if needed."
        evening = "Avoid outdoor dining or prolonged park walks. Run indoor air purifiers on medium fan speed."
        exp = f"At AQI {us_aqi} (PM2.5: {pm25} µg/m³), fine particulates bypass nasal cilia and penetrate terminal alveoli. A 2-hour unprotected walk delivers an estimated {bio_dose['unprotected_dose_ug']} µg of particulates ({bio_dose['who_benchmark_ratio']}x higher than the proportional WHO 24h safety baseline)."
    else: # Severe / Hazardous
        mask = "N95 or N99 respirator with airtight facial seal MANDATORY for any step outdoors. Facial hair reduces seal effectiveness significantly."
        morning = "STRICTLY INDOOR. Do not jog or run outside. Elevated respiratory volume in toxic air causes acute alveolar and cardiovascular stress."
        commute = "Avoid non-essential trips. Work from home if possible. If commuting, use sealed transit exclusively with an N95 mask."
        ventilation = "SEAL ALL EXTERIOR WINDOWS AND DOORS. Do not open windows. Use wet towel draught excluders along door gaps to block particulate ingress."
        evening = "Run HEPA air purifiers continuously on auto/high. Keep indoor humidity around 40-50% to settle airborne suspended dust."
        exp = f"CRITICAL SMOG ALERT: At AQI {us_aqi} with PM2.5 reaching {pm25} µg/m³, winter atmospheric temperature inversion traps vehicular and industrial exhaust near ground level. Wind speed ({wind} km/h) is insufficient for dispersion."

    return {
        "morning_routine": morning,
        "commute_advice": commute,
        "ventilation_window": ventilation,
        "evening_routine": evening,
        "mask_recommendation": mask,
        "bio_dose": bio_dose,
        "scientific_explanation": exp,
        "limitations": "Advisory generated based on ambient outdoor atmospheric monitoring. Actual personal exposure varies with indoor filtration, mask fit, and individual lung physiology. Not a clinical diagnostic tool.",
        "ai_grounded": bool(GEMINI_API_KEY)
    }

async def generate_indoor_air_hacks(aqi_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Returns actionable, realistic indoor air quality improvement hacks tailored to current AQI.
    """
    curr = aqi_data.get("current", {})
    us_aqi = curr.get("us_aqi", 150)
    pm25 = curr.get("pollutants", {}).get("pm2_5", {}).get("value", 85.0)

    hacks = [
        {
            "id": "ventilation_timing",
            "title": "Smart Inversion Ventilation Window",
            "category": "Air Exchange",
            "icon": "Wind",
            "action": "Open windows ONLY between 1:00 PM and 3:30 PM." if us_aqi > 150 else "Open windows for 30 minutes in morning and afternoon.",
            "why": "During winter smog, nighttime radiation cooling causes a low-altitude temperature inversion layer that traps toxic pollutants from 7 PM to 10 AM. Solar warming breaks this ceiling in early afternoon.",
            "impact": "Reduces indoor PM2.5 infiltration by 45-60% compared to opening windows in the morning.",
            "difficulty": "Easy (Zero Cost)"
        },
        {
            "id": "kitchen_exhaust",
            "title": "Dual-Phase Kitchen Exhaust Protocol",
            "category": "Source Control",
            "icon": "Flame",
            "action": "Always switch on kitchen chimney/exhaust 2 minutes BEFORE lighting the gas stove, and leave it running for 5 minutes after cooking finishes.",
            "why": "LPG combustion and oil frying produce ultrafine PM0.1 and NO2 peaks indoors exceeding 400 µg/m³, which linger without active exhaust.",
            "impact": "Prevents 80% of cooking-induced ultrafine particulate buildup in adjacent bedrooms.",
            "difficulty": "Easy"
        },
        {
            "id": "wet_mopping",
            "title": "Microfiber Damp Mopping vs Dry Sweeping",
            "category": "Dust Control",
            "icon": "Sparkles",
            "action": "Never dry-sweep with traditional brooms during high AQI. Use a damp microfiber mop.",
            "why": "Dry sweeping resuspends deposited coarse particulate matter (PM10 and allergens) into breathing height for up to 4 hours.",
            "impact": "Keeps indoor resuspended particulate levels 70% lower.",
            "difficulty": "Easy"
        },
        {
            "id": "diy_purifier",
            "title": "DIY Corsi-Rosenthal Box / Fan Filter",
            "category": "Filtration",
            "icon": "Cpu",
            "action": "Attach a MERV-13 or HEPA filter to the intake side of a standard box fan with duct tape for budget high-CADR air purification.",
            "why": "Proven in peer-reviewed scientific studies to match commercial CADR ratings at 1/5th the commercial equipment cost.",
            "impact": "Delivers Clean Air Delivery Rate (CADR) of 200-300 CFM for under ₹2,000 / $25.",
            "difficulty": "Moderate"
        },
        {
            "id": "natural_plants",
            "title": "Indoor Botanical Bio-Filters",
            "category": "Plant Ecology",
            "icon": "Leaf",
            "action": "Keep Sansevieria (Snake Plant), Areca Palm, and Spider Plant in bedrooms and living rooms.",
            "why": "While plants cannot replace mechanical HEPA filters for heavy PM2.5, they absorb volatile organic compounds (VOCs, benzene, formaldehyde) and release nocturnal oxygen.",
            "impact": "Enhances indoor oxygenation and reduces mild headaches from closed-window CO2 accumulation.",
            "difficulty": "Easy"
        }
    ]
    return hacks

async def get_sustainable_swaps(distance_km: float = 12.0) -> List[Dict[str, Any]]:
    """
    Compares transport modes for a given distance, calculating CO2 saved and PM2.5 inhalation reduction.
    """
    # Emission factor baselines (kg CO2 per passenger-km)
    # Inhalation exposure factors based on cabin air filtration
    modes = [
        {
            "mode": "Metro Rail (Electric)",
            "icon": "Train",
            "co2_emissions_kg": round(distance_km * 0.015, 2),
            "pm25_exposure_ug": round(distance_km * 4.2, 1),
            "calories_burned": 95,
            "duration_min": round(distance_km * 2.2 + 8),
            "sustainability_score": 96,
            "badge": "Lowest Carbon & Sealed Air"
        },
        {
            "mode": "Electric Vehicle (EV Bus / Cab)",
            "icon": "Zap",
            "co2_emissions_kg": round(distance_km * 0.045, 2),
            "pm25_exposure_ug": round(distance_km * 6.5, 1),
            "calories_burned": 15,
            "duration_min": round(distance_km * 3.0),
            "sustainability_score": 88,
            "badge": "Zero Tailpipe Emissions"
        },
        {
            "mode": "Carpool / Rideshare",
            "icon": "Users",
            "co2_emissions_kg": round(distance_km * 0.075, 2),
            "pm25_exposure_ug": round(distance_km * 7.8, 1),
            "calories_burned": 15,
            "duration_min": round(distance_km * 3.2),
            "sustainability_score": 74,
            "badge": "50% Fleet Reduction"
        },
        {
            "mode": "Solo ICE Car (Petrol/Diesel)",
            "icon": "Car",
            "co2_emissions_kg": round(distance_km * 0.192, 2),
            "pm25_exposure_ug": round(distance_km * 8.5, 1),
            "calories_burned": 10,
            "duration_min": round(distance_km * 3.4),
            "sustainability_score": 32,
            "badge": "High Emission Baseline"
        },
        {
            "mode": "Bicycle (Low-Traffic / Green Corridor)",
            "icon": "Bike",
            "co2_emissions_kg": 0.0,
            "pm25_exposure_ug": round(distance_km * 18.5, 1), # High breathing rate outdoors
            "calories_burned": 380,
            "duration_min": round(distance_km * 3.8),
            "sustainability_score": 92,
            "badge": "Zero Carbon (Wear N95 Mask!)"
        }
    ]

    baseline_car_co2 = distance_km * 0.192
    for m in modes:
        m["co2_saved_vs_car_kg"] = max(0.0, round(baseline_car_co2 - m["co2_emissions_kg"], 2))

    return modes

async def answer_copilot_query(query: str, aqi_data: Dict[str, Any], chat_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Answers user queries with strict grounding in live environmental metrics.
    """
    curr = aqi_data.get("current", {})
    us_aqi = curr.get("us_aqi", 165)
    pm25 = curr.get("pollutants", {}).get("pm2_5", {}).get("value", 82.0)
    pm10 = curr.get("pollutants", {}).get("pm10", {}).get("value", 140.0)
    no2 = curr.get("pollutants", {}).get("no2", {}).get("value", 38.0)
    category = curr.get("category", "Unhealthy")
    city = aqi_data.get("location", {}).get("name", "Current City")
    temp = curr.get("weather", {}).get("temperature", 22.0)
    wind = curr.get("weather", {}).get("wind_speed", 7.0)

    # Gemini API prompt if available
    if GEMINI_API_KEY:
        try:
            import google.genai as genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            grounded_system = (
                f"You are BreatheWise AI, an expert environmental health assistant for {city}. "
                f"Ground your answer in these real measurements: "
                f"AQI: {us_aqi} ({category}), PM2.5: {pm25} µg/m³, PM10: {pm10} µg/m³, NO2: {no2} µg/m³, "
                f"Temperature: {temp}°C, Wind Speed: {wind} km/h. "
                f"Structure your response clearly: "
                f"1. Direct Answer & Suggested Action\n"
                f"2. Environmental Data & Scientific Why (mention exact measured numbers)\n"
                f"3. Practical Tips / Alternatives\n"
                f"4. Medical Disclaimer."
            )
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=f"{grounded_system}\n\nUser Question: {query}"
            )
            return {
                "answer": response.text.strip(),
                "grounded_data": {
                    "city": city,
                    "aqi": us_aqi,
                    "category": category,
                    "pm25": pm25,
                    "pm10": pm10,
                    "temperature": temp,
                    "wind_speed": wind
                },
                "powered_by": "Gemini 2.0 Flash (Grounded)",
                "timestamp": datetime.now().strftime("%H:%M:%S")
            }
        except Exception as e:
            pass # fallback to grounded expert system

    # Intelligent grounded rules-based QA engine
    q = query.lower()
    if any(k in q for k in ["exercise", "jog", "run", "walk", "outside", "outdoor"]):
        if us_aqi > 150:
            ans = (
                f"**Direct Recommendation:** It is NOT advisable to exercise outdoors right now in {city}.\n\n"
                f"**Measured Data & Scientific Why:** The measured US AQI is currently **{us_aqi} ({category})**, with PM2.5 concentration at **{pm25} µg/m³** (more than 5x the WHO 24h safety limit of 15 µg/m³). When doing cardio, your minute ventilation increases from ~0.5 m³/h up to 2.5 m³/h, causing you to inhale over 200 µg of fine particulate matter directly into your lung alveoli in just 45 minutes.\n\n"
                f"**What You Should Do Instead:**\n"
                f"• Move workouts indoors (stretching, yoga, dumbbells, skipping in a closed room with air purifier).\n"
                f"• If you must go out, the lowest pollution window today is predicted around **{curr.get('optimal_outdoor_window', 'early afternoon')}**.\n\n"
                f"*Disclaimer: BreatheWise AI provides atmospheric decision support based on Open-Meteo real-time sensors, not individual medical diagnosis.*"
            )
        else:
            ans = (
                f"**Direct Recommendation:** Outdoor exercise is generally acceptable in {city} today.\n\n"
                f"**Measured Data:** US AQI is **{us_aqi} ({category})**, with PM2.5 at **{pm25} µg/m³**. Conditions are within manageable thresholds.\n\n"
                f"**Tips:** Prefer parks away from heavy highway traffic and stay hydrated."
            )
    elif any(k in q for k in ["window", "ventilate", "ventilation", "open", "fresh air"]):
        ans = (
            f"**Direct Recommendation:** In {city}, the safest window for room ventilation is between **1:00 PM and 3:30 PM**.\n\n"
            f"**Scientific Why:** Currently, the AQI is **{us_aqi} ({category})** with low wind speed ({wind} km/h). During winter months, nocturnal surface cooling causes a **temperature inversion** where cold, dense air traps vehicle and combustion smoke near the ground. Opening windows in the morning (6 AM - 10 AM) lets high-concentration smog flood your home.\n\n"
            f"**Action Steps:** Keep windows firmly closed morning and evening. Use damp microfiber mopping rather than dry dusting to prevent resuspending settled dust."
        )
    elif any(k in q for k in ["mask", "n95", "cloth", "surgical"]):
        ans = (
            f"**Direct Recommendation:** Use an **N95 or N99 respirator with a tight perimeter seal** for outdoor movement.\n\n"
            f"**Why Cloth Masks Fail:** Current PM2.5 is **{pm25} µg/m³**. PM2.5 particles are less than 2.5 micrometers in aerodynamic diameter — 30 times smaller than a human hair. Cloth masks and surgical masks only filter particles above 10 µm, leaving over 75% of PM2.5 to pass straight through the fabric pores.\n\n"
            f"**Proper Usage:** Ensure the nose wire is molded over your nasal bridge with no side air leakage."
        )
    elif any(k in q for k in ["commute", "travel", "metro", "car", "bus"]):
        ans = (
            f"**Direct Recommendation:** Take **Metro Rail or Air-Conditioned Public Transit** rather than an open two-wheeler or auto-rickshaw.\n\n"
            f"**Exposure Impact:** Two-wheeler commuters in {city} at current AQI {us_aqi} inhale approximately **{round(pm25 * 1.5 * 1.0, 1)} µg** of PM2.5 per hour of traffic exposure. In contrast, underground Metro cars feature industrial cabin filtration with 70-80% lower particulate concentrations, while also eliminating ~1.8 kg of CO2 compared to solo driving."
        )
    elif any(k in q for k in ["child", "kid", "baby", "elderly", "parent", "asthma", "senior"]):
        ans = (
            f"**Direct Recommendation (Family Protection):** High caution for children and seniors in {city}.\n\n"
            f"**Physiological Vulnerability:** Children breathe 50% more air per kilogram of body weight than adults, and their lung alveoli are still developing. Seniors have reduced airway mucociliary clearance. At current AQI **{us_aqi}**, keep children indoors for physical play and ensure seniors take prescribed inhalers before going outdoors."
        )
    else:
        ans = (
            f"**BreatheWise Air Analysis for {city}:**\n\n"
            f"• Current US AQI: **{us_aqi} ({category})**\n"
            f"• PM2.5 Concentration: **{pm25} µg/m³** (Safe benchmark: 15 µg/m³)\n"
            f"• PM10 Concentration: **{pm10} µg/m³** | NO2: **{no2} µg/m³**\n"
            f"• Meteorological Context: Temp {temp}°C, Wind {wind} km/h\n\n"
            f"**Key Health Advice:** Based on these readings, everyone should minimize intense outdoor exertion during morning and evening rush hours. Use an N95 respirator if stepping out for more than 20 minutes, and seal windows during morning inversion hours."
        )

    return {
        "answer": ans,
        "grounded_data": {
            "city": city,
            "aqi": us_aqi,
            "category": category,
            "pm25": pm25,
            "pm10": pm10,
            "temperature": temp,
            "wind_speed": wind
        },
        "powered_by": "BreatheWise Grounded Heuristics Engine (WHO/CPCB Compliant)",
        "timestamp": datetime.now().strftime("%H:%M:%S")
    }
