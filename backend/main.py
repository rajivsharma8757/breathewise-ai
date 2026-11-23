"""
BreatheWise AI - FastAPI Application
Main backend entrypoint providing REST endpoints for live environmental intelligence,
personalized daily routines, indoor air quality hacks, sustainable commute swaps,
and Gemini-grounded conversational copilot.
"""

from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import uvicorn
import asyncio

from models import CITY_COORDINATES
from aqi_service import fetch_live_air_quality
from gemini_service import (
    generate_personalized_routine,
    generate_indoor_air_hacks,
    get_sustainable_swaps,
    answer_copilot_query
)

app = FastAPI(
    title="BreatheWise AI Backend",
    description="Intelligent Urban Air Quality Decision Support Engine for PromptWars Virtual 2026",
    version="1.0.0"
)

# Enable CORS for Vite frontend (typically localhost:5173 / localhost:3000) and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "BreatheWise AI",
        "version": "1.0.0",
        "challenge": "PromptWars Virtual Main Challenge 06 - Urban Air Quality Assistant",
        "participant": "Rajiv Kumar Sharma",
        "frameworks": ["FastAPI", "Open-Meteo", "Gemini 2.0 Flash"]
    }

@app.get("/api/cities")
async def get_supported_cities():
    cities = []
    for key, data in CITY_COORDINATES.items():
        if key == data["name"].lower():
            cities.append(data)
    return {"cities": sorted(cities, key=lambda x: x["name"])}

def resolve_coordinates(city: Optional[str], lat: Optional[float], lon: Optional[float]):
    if lat is not None and lon is not None:
        loc_name = city if city else f"Coord ({round(lat, 2)}, {round(lon, 2)})"
        return lat, lon, loc_name

    c_key = city.lower().strip() if city else "delhi"
    if c_key in CITY_COORDINATES:
        info = CITY_COORDINATES[c_key]
        return info["lat"], info["lon"], f"{info['name']}, {info['state']}"

    # Default fallback to New Delhi if unknown
    delhi = CITY_COORDINATES["delhi"]
    return delhi["lat"], delhi["lon"], city if city else "New Delhi, Delhi"

@app.get("/api/aqi")
async def get_air_quality(
    city: Optional[str] = Query("delhi", description="City name (e.g. Delhi, Mumbai, Bengaluru)"),
    lat: Optional[float] = Query(None, description="Optional latitude for GPS coordinates"),
    lon: Optional[float] = Query(None, description="Optional longitude for GPS coordinates")
):
    target_lat, target_lon, loc_name = resolve_coordinates(city, lat, lon)
    return await fetch_live_air_quality(target_lat, target_lon, loc_name)

@app.get("/api/plan")
async def get_daily_routine(
    city: Optional[str] = Query("delhi"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    profile: Optional[str] = Query("adult", description="Profile type: adult, child, senior, patient")
):
    target_lat, target_lon, loc_name = resolve_coordinates(city, lat, lon)
    aqi_data = await fetch_live_air_quality(target_lat, target_lon, loc_name)
    routine = await generate_personalized_routine(aqi_data, profile=profile)
    return {
        "location": aqi_data["location"],
        "profile": profile,
        "current_aqi": aqi_data["current"]["us_aqi"],
        "category": aqi_data["current"]["category"],
        "routine": routine
    }

@app.get("/api/indoor-hacks")
async def get_indoor_hacks(
    city: Optional[str] = Query("delhi"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None)
):
    target_lat, target_lon, loc_name = resolve_coordinates(city, lat, lon)
    aqi_data = await fetch_live_air_quality(target_lat, target_lon, loc_name)
    hacks = await generate_indoor_air_hacks(aqi_data)
    return {
        "location": aqi_data["location"],
        "current_aqi": aqi_data["current"]["us_aqi"],
        "category": aqi_data["current"]["category"],
        "hacks": hacks
    }

@app.get("/api/sustainable-swaps")
async def get_swaps(
    distance_km: float = Query(12.0, ge=1.0, le=100.0, description="Trip distance in kilometers")
):
    swaps = await get_sustainable_swaps(distance_km)
    return {
        "distance_km": distance_km,
        "modes": swaps,
        "baseline_car_emissions_kg": round(distance_km * 0.192, 2)
    }

@app.post("/api/chat")
async def chat_copilot(
    payload: Dict[str, Any] = Body(...)
):
    query = payload.get("message", "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Message is required.")

    city = payload.get("city", "delhi")
    lat = payload.get("lat")
    lon = payload.get("lon")
    chat_history = payload.get("history", [])

    target_lat, target_lon, loc_name = resolve_coordinates(city, lat, lon)
    aqi_data = await fetch_live_air_quality(target_lat, target_lon, loc_name)
    response = await answer_copilot_query(query, aqi_data, chat_history)
    return response

@app.get("/api/compare")
async def compare_cities(
    cities: Optional[str] = Query("delhi,mumbai,bengaluru,kolkata,varanasi,pune", description="Comma separated city keys")
):
    city_list = [c.strip().lower() for c in cities.split(",") if c.strip().lower() in CITY_COORDINATES]
    if not city_list:
        city_list = ["delhi", "mumbai", "bengaluru", "kolkata"]

    tasks = []
    for c_key in city_list:
        info = CITY_COORDINATES[c_key]
        tasks.append(fetch_live_air_quality(info["lat"], info["lon"], f"{info['name']}, {info['state']}"))

    results = await asyncio.gather(*tasks, return_exceptions=True)
    comparison = []
    for item in results:
        if isinstance(item, dict) and "current" in item:
            comparison.append({
                "city": item["location"]["name"],
                "us_aqi": item["current"]["us_aqi"],
                "category": item["current"]["category"],
                "color": item["current"]["category_color"],
                "pm25": item["current"]["pollutants"]["pm2_5"]["value"],
                "pm10": item["current"]["pollutants"]["pm10"]["value"],
                "temperature": item["current"]["weather"]["temperature"]
            })

    comparison.sort(key=lambda x: x["us_aqi"], reverse=True)
    return {"comparison": comparison}

@app.get("/api/briefing")
async def get_briefing(
    city: Optional[str] = Query("delhi"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    time_of_day: Optional[str] = Query("morning", description="morning or evening")
):
    target_lat, target_lon, loc_name = resolve_coordinates(city, lat, lon)
    aqi_data = await fetch_live_air_quality(target_lat, target_lon, loc_name)
    curr = aqi_data["current"]
    aqi = curr["us_aqi"]

    if time_of_day == "morning":
        title = f"Morning Air Intelligence Briefing for {loc_name}"
        headline = "Heavy Ground-Level Smog Inversion Detected" if aqi > 150 else "Moderate Morning Atmosphere"
        action_summary = "Delay outdoor jogging. Keep east/north windows sealed until 1:00 PM." if aqi > 150 else "Good morning for light outdoor exercise before 8:30 AM."
    else:
        title = f"Evening Air Protection Briefing for {loc_name}"
        headline = "Nighttime Particulate Trapping Expected" if aqi > 150 else "Clearer Evening Air Flow"
        action_summary = "Turn on indoor air purifiers and prepare draft seals for bedroom windows." if aqi > 150 else "Pleasant evening for a neighbourhood stroll."

    return {
        "title": title,
        "time_of_day": time_of_day,
        "location": loc_name,
        "aqi": aqi,
        "category": curr["category"],
        "category_color": curr["category_color"],
        "headline": headline,
        "pm25": curr["pollutants"]["pm2_5"]["value"],
        "action_summary": action_summary,
        "optimal_slot": curr["optimal_outdoor_window"],
        "worst_smog_slot": curr["worst_smog_window"]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
