import React from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  Wind,
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  AlertTriangle,
  Leaf,
  Layers,
  Thermometer,
  Eye
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { aqiData, language, setActiveTab } = useAirQuality();
  const curr = aqiData?.current;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-10 mb-8 shadow-2xl">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading and Tagline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PromptWars Virtual 2026 • Challenge 06: Urban Air Quality Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {language === 'en' ? (
              <>
                Understand Your Air. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Protect Your Day.
                </span> <br />
                Breathe Smarter.
              </>
            ) : (
              <>
                हवा को समझें। <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  दिन को सुरक्षित बनाएं।
                </span> <br />
                समझदारी से सांस लें।
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {language === 'en'
              ? 'BreatheWise AI is a decision-support platform that transforms complex atmospheric data into personalized daily routines, scientifically timed indoor ventilation windows, and low-emission commute alternatives.'
              : 'ब्रीदवाइज एआई जटिल वायु प्रदूषण और स्मॉग डेटा को व्यक्तिगत दैनिक दिनचर्या, वैज्ञानिक वेंटिलेशन समय और पर्यावरण-अनुकूल यात्रा विकल्पों में बदलता है।'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
            >
              <Eye className="w-4 h-4" />
              <span>{language === 'en' ? 'Live AQI Dashboard' : 'लाइव AQI डैशबोर्ड'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <Clock className="w-4 h-4" />
              <span>{language === 'en' ? 'Personal Routine' : 'दैनिक योजना'}</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 font-semibold text-sm border border-teal-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{language === 'en' ? 'Ask AI Copilot' : 'AI सहायक से पूछें'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Air Pulse Card */}
        <div className="lg:col-span-5">
          {curr ? (
            <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>{aqiData?.location.name}</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Sensors
                </span>
              </div>

              {/* Main AQI Gauge Display */}
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    US Air Quality Index
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-5xl sm:text-6xl font-black tracking-tight"
                      style={{ color: curr.category_color }}
                    >
                      {curr.us_aqi}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">/ 500</span>
                  </div>
                </div>

                <div 
                  className="px-3 py-1.5 rounded-xl border text-right"
                  style={{
                    backgroundColor: `${curr.category_color}15`,
                    borderColor: `${curr.category_color}40`,
                    color: curr.category_color
                  }}
                >
                  <div className="text-xs uppercase font-extrabold tracking-wide">
                    {curr.category}
                  </div>
                  <div className="text-[11px] font-medium text-slate-300">
                    EU AQI: {curr.european_aqi}
                  </div>
                </div>
              </div>

              {/* Pollutant snapshot row */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">PM2.5</div>
                  <div className="text-sm font-bold text-white">{curr.pollutants.pm2_5.value} <span className="text-[10px] text-slate-400">µg/m³</span></div>
                  <div className="text-[10px] text-red-400">{(curr.pollutants.pm2_5.value / 15).toFixed(1)}x WHO Limit</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">PM10</div>
                  <div className="text-sm font-bold text-white">{curr.pollutants.pm10.value} <span className="text-[10px] text-slate-400">µg/m³</span></div>
                  <div className="text-[10px] text-slate-400">Safe: &lt;45</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Temperature</div>
                  <div className="text-sm font-bold text-white">{curr.weather.temperature}°C</div>
                  <div className="text-[10px] text-slate-400">Wind: {curr.weather.wind_speed} km/h</div>
                </div>
              </div>

              {/* Inversion Window Alert */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <strong className="text-amber-300 font-semibold">Today's Inversion Window:</strong>{' '}
                  Lowest pollution expected around <strong>{curr.optimal_outdoor_window}</strong>. Avoid morning rush ({curr.worst_smog_window}).
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse bg-slate-900 rounded-2xl h-64 border border-slate-800"></div>
          )}
        </div>
      </div>
    </div>
  );
};
