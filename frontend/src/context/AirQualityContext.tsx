import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AirQualityResponse } from '../types';
import { fetchAQI } from '../services/api';

interface AirQualityContextType {
  city: string;
  setCity: (city: string) => void;
  aqiData: AirQualityResponse | null;
  loading: boolean;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  profile: 'adult' | 'child' | 'senior' | 'patient';
  setProfile: (profile: 'adult' | 'child' | 'senior' | 'patient') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refreshData: () => void;
  detectLocation: () => void;
  isDetectingLocation: boolean;
}

const AirQualityContext = createContext<AirQualityContextType | undefined>(undefined);

export const AirQualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [city, setCity] = useState<string>('delhi');
  const [aqiData, setAqiData] = useState<AirQualityResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [profile, setProfile] = useState<'adult' | 'child' | 'senior' | 'patient'>('adult');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  const loadData = async (cityName: string, lat?: number, lon?: number) => {
    setLoading(true);
    try {
      const data = await fetchAQI(cityName, lat, lon);
      setAqiData(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(city);
  }, [city]);

  const refreshData = () => {
    loadData(city);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert(language === 'en' ? 'Geolocation is not supported by your browser' : 'आपका ब्राउज़र जियोलोकेशन सपोर्ट नहीं करता');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await loadData(`GPS (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`, latitude, longitude);
        setIsDetectingLocation(false);
      },
      (err) => {
        console.warn('Geolocation denied or failed, staying on city:', err);
        setIsDetectingLocation(false);
        alert(language === 'en' ? 'Location permission was denied or timed out. Defaulting to Delhi.' : 'लोकेशन अनुमति नहीं मिली। दिल्ली डिफ़ॉल्ट पर सेट किया गया।');
      },
      { timeout: 8000 }
    );
  };

  return (
    <AirQualityContext.Provider
      value={{
        city,
        setCity,
        aqiData,
        loading,
        language,
        setLanguage,
        profile,
        setProfile,
        activeTab,
        setActiveTab,
        refreshData,
        detectLocation,
        isDetectingLocation,
      }}
    >
      {children}
    </AirQualityContext.Provider>
  );
};

export const useAirQuality = () => {
  const context = useContext(AirQualityContext);
  if (!context) {
    throw new Error('useAirQuality must be used within an AirQualityProvider');
  }
  return context;
};
