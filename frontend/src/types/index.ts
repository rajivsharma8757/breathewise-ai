export interface PollutantDetail {
  value: number;
  unit: string;
  label: string;
  safe_limit: number;
}

export interface CurrentAQI {
  us_aqi: number;
  european_aqi: number;
  category: string;
  category_color: string;
  severity_index: number;
  description: string;
  recommendation: string;
  pollutants: {
    pm2_5: PollutantDetail;
    pm10: PollutantDetail;
    no2: PollutantDetail;
    so2: PollutantDetail;
    o3: PollutantDetail;
    co: PollutantDetail;
  };
  weather: {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    condition: string;
  };
  optimal_outdoor_window: string;
  worst_smog_window: string;
  updated_at: string;
  data_source: string;
  is_live: boolean;
}

export interface HourlyDataPoint {
  timestamp: string;
  hour: string;
  aqi: number;
  pm25: number;
  pm10: number;
  category: string;
  color: string;
}

export interface AirQualityResponse {
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  current: CurrentAQI;
  hourly_forecast: HourlyDataPoint[];
}

export interface BioDose {
  unprotected_dose_ug: number;
  n95_protected_dose_ug: number;
  dose_saved_ug: number;
  cigarette_equivalent: number;
  assumptions: string;
}

export interface DailyRoutine {
  morning_routine: string;
  commute_advice: string;
  ventilation_window: string;
  evening_routine: string;
  mask_recommendation: string;
  bio_dose: BioDose;
  scientific_explanation: string;
  limitations: string;
  ai_grounded: boolean;
}

export interface IndoorHack {
  id: string;
  title: string;
  category: string;
  icon: string;
  action: string;
  why: string;
  impact: string;
  difficulty: string;
}

export interface CommuteMode {
  mode: string;
  icon: string;
  co2_emissions_kg: number;
  co2_saved_vs_car_kg: number;
  pm25_exposure_ug: number;
  calories_burned: number;
  duration_min: number;
  sustainability_score: number;
  badge: string;
}

export interface CitySummary {
  city: string;
  us_aqi: number;
  category: string;
  color: string;
  pm25: number;
  pm10: number;
  temperature: number;
}
