"""
BreatheWise AI - Pydantic / Dict Data Models
Provides strict schemas for AQI data, daily planner, indoor air recommendations,
sustainable swaps, family safety, and AI copilot conversations.
"""

from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field

# City Coordinate Registry for fast lookup & geocoding fallback
CITY_COORDINATES = {
    "delhi": {"name": "New Delhi", "state": "Delhi", "country": "India", "lat": 28.6139, "lon": 77.2090},
    "new delhi": {"name": "New Delhi", "state": "Delhi", "country": "India", "lat": 28.6139, "lon": 77.2090},
    "mumbai": {"name": "Mumbai", "state": "Maharashtra", "country": "India", "lat": 19.0760, "lon": 72.8777},
    "bengaluru": {"name": "Bengaluru", "state": "Karnataka", "country": "India", "lat": 12.9716, "lon": 77.5946},
    "bangalore": {"name": "Bengaluru", "state": "Karnataka", "country": "India", "lat": 12.9716, "lon": 77.5946},
    "kolkata": {"name": "Kolkata", "state": "West Bengal", "country": "India", "lat": 22.5726, "lon": 88.3639},
    "chennai": {"name": "Chennai", "state": "Tamil Nadu", "country": "India", "lat": 13.0827, "lon": 80.2707},
    "hyderabad": {"name": "Hyderabad", "state": "Telangana", "country": "India", "lat": 17.3850, "lon": 78.4867},
    "pune": {"name": "Pune", "state": "Maharashtra", "country": "India", "lat": 18.5204, "lon": 73.8567},
    "ahmedabad": {"name": "Ahmedabad", "state": "Gujarat", "country": "India", "lat": 23.0225, "lon": 72.5714},
    "lucknow": {"name": "Lucknow", "state": "Uttar Pradesh", "country": "India", "lat": 26.8467, "lon": 80.9462},
    "patna": {"name": "Patna", "state": "Bihar", "country": "India", "lat": 25.5941, "lon": 85.1376},
    "varanasi": {"name": "Varanasi", "state": "Uttar Pradesh", "country": "India", "lat": 25.3176, "lon": 82.9739},
    "jaipur": {"name": "Jaipur", "state": "Rajasthan", "country": "India", "lat": 26.9124, "lon": 75.7873},
    "chandigarh": {"name": "Chandigarh", "state": "Punjab/Haryana", "country": "India", "lat": 30.7333, "lon": 76.7794},
    "gurgaon": {"name": "Gurugram", "state": "Haryana", "country": "India", "lat": 28.4595, "lon": 77.0266},
    "gurugram": {"name": "Gurugram", "state": "Haryana", "country": "India", "lat": 28.4595, "lon": 77.0266},
    "noida": {"name": "Noida", "state": "Uttar Pradesh", "country": "India", "lat": 28.5355, "lon": 77.3910},
    "kanpur": {"name": "Kanpur", "state": "Uttar Pradesh", "country": "India", "lat": 26.4499, "lon": 80.3319},
    "london": {"name": "London", "state": "England", "country": "United Kingdom", "lat": 51.5074, "lon": -0.1278},
    "new york": {"name": "New York", "state": "New York", "country": "United States", "lat": 40.7128, "lon": -74.0060},
    "san francisco": {"name": "San Francisco", "state": "California", "country": "United States", "lat": 37.7749, "lon": -122.4194},
    "tokyo": {"name": "Tokyo", "state": "Kanto", "country": "Japan", "lat": 35.6762, "lon": 139.6503},
    "beijing": {"name": "Beijing", "state": "Beijing", "country": "China", "lat": 39.9042, "lon": 116.4074}
}
