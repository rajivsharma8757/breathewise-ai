import React from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Sun,
  Moon,
  Info,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const PollutionTrends: React.FC = () => {
  const { aqiData, language } = useAirQuality();
  const hourly = aqiData?.hourly_forecast || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? '24-Hour Pollution Trends & Inversion Analysis' : '24 घंटे का वायु प्रदूषण और इनवर्जन विश्लेषण'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hourly forecast showing diurnal thermal inversion cycle and peak particulate concentration windows.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3.5 py-1.5 rounded-xl font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Peak Smog Inversion: Morning 07:00 – 09:30</span>
          </div>
        </div>
      </div>

      {/* Hourly Timeline Visualizer */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {language === 'en' ? 'Hourly AQI & PM2.5 Forecast' : 'प्रति घंटा AQI और PM2.5 पूर्वानुमान'}
          </span>
          <span className="text-xs text-slate-400">
            Location: {aqiData?.location.name}
          </span>
        </div>

        {/* Visual Timeline Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 pt-2">
          {hourly.slice(0, 8).map((slot, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between text-center transition-all hover:border-slate-700"
            >
              <div className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{slot.hour}</span>
              </div>

              <div className="my-3">
                <div
                  className="text-2xl font-black"
                  style={{ color: slot.color }}
                >
                  {slot.aqi}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  PM2.5: {slot.pm25} µg
                </div>
              </div>

              <div
                className="text-[10px] font-bold py-0.5 rounded-md uppercase"
                style={{
                  backgroundColor: `${slot.color}15`,
                  color: slot.color
                }}
              >
                {slot.category.replace('Unhealthy for Sensitive Groups', 'Sensitive')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diurnal Smog Cycle Deep-Dive (Why Air Changes Through the Day) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{language === 'en' ? 'Understanding the 4 Diurnal Smog Phases' : 'दिनभर में वायु प्रदूषण के 4 चरण'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Phase 1 */}
          <div className="bg-slate-950/80 border border-red-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/40 px-2 py-0.5 rounded">Phase 1: 06:00 – 10:00</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Morning Inversion Peak</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Nocturnal ground cooling creates a lid. Cold, dense air traps vehicle cold-start emissions near the ground. Worst time for outdoor running.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">Phase 2: 12:00 – 16:00</span>
              <Sun className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Solar Thermal Dispersion</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Solar radiation heats the Earth's surface, breaking the inversion ceiling. Convective vertical mixing dilutes pollutants. Safest ventilation window.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">Phase 3: 17:30 – 21:30</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Evening Commute Trapping</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              As the sun sets, rapid radiational cooling re-establishes the inversion layer just as evening bumper-to-bumper traffic releases toxic exhaust.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded">Phase 4: 22:00 – 06:00</span>
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Night Stagnation & Biomass</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Low wind speeds (often &lt;5 km/h) allow nocturnal space-heating and background emissions to settle. Keep bedroom air purifiers active overnight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
