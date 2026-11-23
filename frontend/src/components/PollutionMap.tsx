import React from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  MapPin,
  Compass,
  Layers,
  Info,
  Navigation,
  Activity,
  ArrowRight
} from 'lucide-react';

interface Station {
  id: string;
  name: string;
  state: string;
  aqi: number;
  pm25: number;
  status: string;
  color: string;
  lat: number;
  lon: number;
  xPercent: number; // For clean svg map projection
  yPercent: number;
}

export const PollutionMap: React.FC = () => {
  const { setCity, setActiveTab, language } = useAirQuality();

  const stations: Station[] = [
    { id: 'delhi', name: 'New Delhi (NCR)', state: 'Delhi', aqi: 218, pm25: 138.4, status: 'Very Unhealthy', color: '#8B5CF6', lat: 28.61, lon: 77.20, xPercent: 38, yPercent: 30 },
    { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', aqi: 188, pm25: 104.2, status: 'Unhealthy', color: '#EF4444', lat: 26.84, lon: 80.94, xPercent: 49, yPercent: 35 },
    { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', aqi: 178, pm25: 98.2, status: 'Unhealthy', color: '#EF4444', lat: 25.31, lon: 82.97, xPercent: 55, yPercent: 39 },
    { id: 'patna', name: 'Patna', state: 'Bihar', aqi: 198, pm25: 112.5, status: 'Unhealthy', color: '#EF4444', lat: 25.59, lon: 85.13, xPercent: 62, yPercent: 38 },
    { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', aqi: 158, pm25: 75.6, status: 'Unhealthy', color: '#EF4444', lat: 22.57, lon: 88.36, xPercent: 70, yPercent: 48 },
    { id: 'mumbai', name: 'Mumbai Coast', state: 'Maharashtra', aqi: 142, pm25: 52.4, status: 'Sensitive', color: '#F97316', lat: 19.07, lon: 72.87, xPercent: 28, yPercent: 60 },
    { id: 'pune', name: 'Pune', state: 'Maharashtra', aqi: 115, pm25: 41.2, status: 'Sensitive', color: '#F97316', lat: 18.52, lon: 73.85, xPercent: 31, yPercent: 63 },
    { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', aqi: 88, pm25: 29.5, status: 'Moderate', color: '#F59E0B', lat: 17.38, lon: 78.48, xPercent: 44, yPercent: 67 },
    { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', aqi: 68, pm25: 20.1, status: 'Moderate', color: '#F59E0B', lat: 12.97, lon: 77.59, xPercent: 41, yPercent: 82 },
    { id: 'chennai', name: 'Chennai Coast', state: 'Tamil Nadu', aqi: 62, pm25: 18.5, status: 'Moderate', color: '#F59E0B', lat: 13.08, lon: 80.27, xPercent: 49, yPercent: 81 },
  ];

  const handleSelectStation = (stationId: string) => {
    setCity(stationId);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? 'Regional Air Quality & Pollution Map' : 'क्षेत्रीय वायु गुणवत्ता एवं प्रदूषण नक्शा'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any regional monitoring station to immediately ground BreatheWise AI in that basin's live sensors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>10 Synchronized Metro Hubs</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visualizer Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Spatial Map Canvas Box */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[460px] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Geospatial Inversion Basin View</span>
            </span>
            <span className="text-[11px] text-slate-400">Click a pin to view city</span>
          </div>

          {/* Interactive Stations Canvas */}
          <div className="relative w-full h-[360px] my-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
            {/* Background grid lines for spatial reference */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Regional Smog Basin Cloud Graphic */}
            <div className="absolute top-[20%] left-[30%] w-72 h-36 bg-red-950/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-[28%] left-[35%] text-[10px] text-red-400/60 font-black uppercase tracking-widest pointer-events-none">
              Indo-Gangetic Smog Inversion Basin
            </div>

            {/* Station Pins */}
            {stations.map((st) => (
              <div
                key={st.id}
                onClick={() => handleSelectStation(st.id)}
                className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 z-20"
                style={{ top: `${st.yPercent}%`, left: `${st.xPercent}%` }}
              >
                {/* Pin Circle */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center ring-4 shadow-lg"
                  style={{
                    backgroundColor: st.color,
                    borderColor: '#0f172a'
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </div>

                {/* Hover / Label Card */}
                <div className="opacity-80 group-hover:opacity-100 bg-slate-900/95 border border-slate-700/80 rounded-lg px-2 py-1 shadow-md text-center mt-1 whitespace-nowrap transition-all">
                  <div className="text-[10px] font-bold text-white">{st.name}</div>
                  <div className="text-[9px] font-extrabold" style={{ color: st.color }}>
                    AQI {st.aqi}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="z-10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Air Quality Palette:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> 0–50 Good</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 51–100 Mod</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> 101–200 Unhealthy</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span> 201+ Very Unhealthy</span>
            </div>
          </div>
        </div>

        {/* Stations List Explorer */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
            {language === 'en' ? 'Active Monitoring Hubs' : 'सक्रिय निगरानी केंद्र'}
          </h3>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {stations.map((st) => (
              <div
                key={st.id}
                onClick={() => handleSelectStation(st.id)}
                className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  ></div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{st.name}</h4>
                    <span className="text-[10px] text-slate-400">{st.state} • PM2.5: {st.pm25} µg</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold" style={{ color: st.color }}>
                      {st.aqi}
                    </span>
                    <div className="text-[10px] text-slate-400 font-medium">US AQI</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
