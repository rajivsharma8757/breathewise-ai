import React, { useState, useEffect } from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import type { CitySummary } from '../types';
import { fetchCityComparison } from '../services/api';
import {
  Globe,
  ArrowUpDown,
  Compass,
  Thermometer,
  Activity,
  ArrowRight
} from 'lucide-react';

export const CityComparison: React.FC = () => {
  const { setCity, setActiveTab, language } = useAirQuality();
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCityComparison().then((data) => {
      if (isMounted) {
        setCities(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleSelect = (cityName: string) => {
    // Map full string like "New Delhi, Delhi" to key "delhi"
    const lower = cityName.toLowerCase();
    let key = 'delhi';
    if (lower.includes('mumbai')) key = 'mumbai';
    else if (lower.includes('bengaluru') || lower.includes('bangalore')) key = 'bengaluru';
    else if (lower.includes('kolkata')) key = 'kolkata';
    else if (lower.includes('pune')) key = 'pune';
    else if (lower.includes('varanasi')) key = 'varanasi';
    else if (lower.includes('patna')) key = 'patna';
    else if (lower.includes('chennai')) key = 'chennai';

    setCity(key);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? 'Intercity Pollution & Smog Comparison' : 'विभिन्न शहरों की वायु गुणवत्ता तुलना'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time cross-basin analysis comparing major metropolitan and northern river-valley cities.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Sorted by Current Severity (High to Low)
          </div>
        </div>
      </div>

      {/* Comparison Table / Cards */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Fetching intercity environmental metrics...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">City / Region</th>
                  <th className="py-3 px-4">US AQI</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">PM2.5 (µg/m³)</th>
                  <th className="py-3 px-4">PM10 (µg/m³)</th>
                  <th className="py-3 px-4">Temp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {cities.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                      <span>{c.city}</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm" style={{ color: c.color }}>
                      {c.us_aqi}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${c.color}15`,
                          color: c.color
                        }}
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {c.pm25} µg
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-400">
                      {c.pm10} µg
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-400">
                      {c.temperature}°C
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSelect(c.city)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-all"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
