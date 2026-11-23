"""
Quick verification test for BreatheWise AI backend services.
"""
import asyncio
from aqi_service import fetch_live_air_quality
from gemini_service import calculate_bio_dose, generate_personalized_routine, get_sustainable_swaps, answer_copilot_query

async def main():
    print("Testing Live AQI Service...")
    aqi_data = await fetch_live_air_quality(28.6139, 77.2090, "New Delhi, Delhi")
    print("AQI Data Location:", aqi_data["location"]["name"])
    print("Current US AQI:", aqi_data["current"]["us_aqi"], aqi_data["current"]["category"])
    print("PM2.5:", aqi_data["current"]["pollutants"]["pm2_5"]["value"], "µg/m³")

    print("\nTesting Bio-Dose Calculation...")
    dose = calculate_bio_dose(85.0, hours_outdoor=2.0, activity_level="moderate")
    print("Dose Result:", dose)
    assert "who_benchmark_ratio" in dose
    assert "risk_tier" in dose

    print("\nTesting Routine Generation...")
    routine = await generate_personalized_routine(aqi_data, profile="child")
    print("Mask Recommendation:", routine["mask_recommendation"])
    print("Morning Advice:", routine["morning_routine"][:80], "...")

    print("\nTesting Sustainable Commute Swaps...")
    swaps = await get_sustainable_swaps(12.0)
    print(f"Modes calculated: {len(swaps)}")
    for m in swaps[:3]:
        print(f" - {m['mode']}: CO2={m['co2_emissions_kg']}kg, Saved vs Car={m['co2_saved_vs_car_kg']}kg")

    print("\nTesting Grounded Copilot Query...")
    chat = await answer_copilot_query("Is it safe for my child to play football outside today?", aqi_data)
    print("Chat Answer preview:\n", chat["answer"][:180], "...")
    print("\nALL BACKEND SERVICES VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(main())
