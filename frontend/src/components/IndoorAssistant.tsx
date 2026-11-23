import React, { useState, useEffect } from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import type { IndoorHack } from '../types';
import { fetchIndoorHacks } from '../services/api';
import {
  Home,
  Wind,
  Flame,
  Sparkles,
  Cpu,
  Leaf,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const IndoorAssistant: React.FC = () => {
  const { city, aqiData, language } = useAirQuality();
  const [hacks, setHacks] = useState<IndoorHack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedHacks, setCompletedHacks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchIndoorHacks(city).then((data) => {
      if (isMounted) {
        setHacks(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [city]);

  const toggleHack = (id: string) => {
    setCompletedHacks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const aqi = aqiData?.current.us_aqi || 180;
  const currentHour = new Date().getHours();
  // Safe ventilation window is typically 13:00 (1 PM) to 15:30 (3:30 PM) during winter inversion
  const isSafeWindow = currentHour >= 13 && currentHour <= 15;

  const getHackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Sparkles': return Sparkles;
      case 'Cpu': return Cpu;
      case 'Leaf': return Leaf;
      default: return Wind;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? 'Indoor Air Quality (IAQ) Assistant' : 'घर की वायु गुणवत्ता सुधार सहायक'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'en'
                ? 'Actionable, zero-cost and low-cost strategies to slash indoor particulate and combustion pollutant buildup.'
                : 'कम खर्च और बिना खर्च के घर के अंदर प्रदूषण और धुएं को कम करने के व्यावहारिक उपाय।'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Optimal Window: <strong>1:00 PM – 3:30 PM</strong></span>
          </div>
        </div>
      </div>

      {/* Real-Time Natural Ventilation Indicator */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
        isSafeWindow && aqi <= 250
          ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-emerald-500/40'
          : 'bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border-red-500/40'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl ${
            isSafeWindow && aqi <= 250 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isSafeWindow && aqi <= 250 ? (
              <Wind className="w-8 h-8 animate-spin" />
            ) : (
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isSafeWindow && aqi <= 250 ? 'bg-emerald-400/20 text-emerald-300' : 'bg-red-400/20 text-red-300'
              }`}>
                {isSafeWindow && aqi <= 250
                  ? (language === 'en' ? 'SAFE VENTILATION WINDOW ACTIVE' : 'खिड़की खोलने का सुरक्षित समय')
                  : (language === 'en' ? 'KEEP EXTERIOR WINDOWS SEALED' : 'खिड़कियां और दरवाजे बंद रखें')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {isSafeWindow && aqi <= 250
                ? (language === 'en' ? 'Solar Convection Is Dispersing Ground Smog' : 'धूप से प्रदूषण फैल रहा है, ताजा हवा ले सकते हैं')
                : (language === 'en' ? 'Temperature Inversion Ceiling Traps Ground Pollutants' : 'तापमान उलटाव के कारण जहरीला धुआं नीचे फंसा हुआ है')}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'During morning and night, cold heavy air creates an inversion trap. Opening windows during those hours floods rooms with high PM2.5. Safe air exchange is recommended only around early afternoon (1:00 PM - 3:30 PM).'
                : 'सुबह और रात के समय ठंडी हवा जमीन के पास प्रदूषण को रोक कर रखती है। इस समय खिड़की खोलने से जहरीला धुआं कमरे में आ जाता है।'}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-center bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Current Outdoor AQI</div>
          <div className="text-3xl font-black text-white my-1">{aqi}</div>
          <div className="text-[10px] text-slate-400">Outdoor PM2.5: {aqiData?.current.pollutants.pm2_5.value} µg/m³</div>
        </div>
      </div>

      {/* Practical Actionable Hacks Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{language === 'en' ? '5 Clinical & Practical Indoor Air Hacks' : 'घर की हवा सुधारने के 5 व्यावहारिक उपाय'}</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading IAQ protocols...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hacks.map((hack) => {
              const Icon = getHackIcon(hack.icon);
              const isChecked = !!completedHacks[hack.id];

              return (
                <div
                  key={hack.id}
                  className={`border rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            {hack.category}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {hack.title}
                          </h4>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {hack.difficulty}
                      </span>
                    </div>

                    <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-850 space-y-1">
                      <div className="text-xs font-semibold text-emerald-300">
                        Action: {hack.action}
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        Why: {hack.why}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400">
                      Impact: {hack.impact}
                    </span>

                    <button
                      onClick={() => toggleHack(hack.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isChecked ? 'Active in Home' : 'Mark Implemented'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
