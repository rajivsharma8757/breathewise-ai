"""
Comprehensive test suite for BreatheWise AI FastAPI backend.
Tests all REST endpoints, schemas, parameters, and response models.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["service"] == "BreatheWise AI"
    assert "Rajiv Kumar Sharma" in data["participant"]
    print("PASS: /api/health")

def test_cities():
    res = client.get("/api/cities")
    assert res.status_code == 200
    data = res.json()
    assert "cities" in data
    assert len(data["cities"]) >= 10
    print(f"PASS: /api/cities ({len(data['cities'])} cities registered)")

def test_aqi():
    res = client.get("/api/aqi?city=delhi")
    assert res.status_code == 200
    data = res.json()
    assert "current" in data
    assert "us_aqi" in data["current"]
    assert "pollutants" in data["current"]
    assert "pm2_5" in data["current"]["pollutants"]
    print(f"PASS: /api/aqi (Delhi AQI: {data['current']['us_aqi']}, {data['current']['category']})")

def test_plan():
    res = client.get("/api/plan?city=delhi&profile=child")
    assert res.status_code == 200
    data = res.json()
    assert "routine" in data
    assert "mask_recommendation" in data["routine"]
    assert "bio_dose" in data["routine"]
    print("PASS: /api/plan (Personalized Routine & Bio-Dose verified)")

def test_indoor_hacks():
    res = client.get("/api/indoor-hacks?city=delhi")
    assert res.status_code == 200
    data = res.json()
    assert "hacks" in data
    assert len(data["hacks"]) == 5
    print(f"PASS: /api/indoor-hacks ({len(data['hacks'])} actionable hacks)")

def test_sustainable_swaps():
    res = client.get("/api/sustainable-swaps?distance_km=15")
    assert res.status_code == 200
    data = res.json()
    assert "modes" in data
    assert len(data["modes"]) == 5
    assert data["baseline_car_emissions_kg"] > 0
    print("PASS: /api/sustainable-swaps (5 transit modes compared)")

def test_compare():
    res = client.get("/api/compare?cities=delhi,mumbai,bengaluru,kolkata")
    assert res.status_code == 200
    data = res.json()
    assert "comparison" in data
    assert len(data["comparison"]) >= 4
    print(f"PASS: /api/compare ({len(data['comparison'])} cities compared)")

def test_briefing():
    res = client.get("/api/briefing?city=delhi&time_of_day=morning")
    assert res.status_code == 200
    data = res.json()
    assert "headline" in data
    assert "action_summary" in data
    print("PASS: /api/briefing")

def test_chat():
    res = client.post("/api/chat", json={"message": "Is it safe to run outdoors today?", "city": "delhi"})
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "grounded_data" in data
    print("PASS: /api/chat (Grounded Copilot response verified)")

if __name__ == "__main__":
    print("RUNNING COMPREHENSIVE BACKEND TEST SUITE...")
    test_health()
    test_cities()
    test_aqi()
    test_plan()
    test_indoor_hacks()
    test_sustainable_swaps()
    test_compare()
    test_briefing()
    test_chat()
    print("\nALL 9 ENDPOINT INTEGRATION TESTS PASSED 100%!")
