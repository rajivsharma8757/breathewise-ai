import React, { useState } from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  Wind,
  Droplets,
  Thermometer,
  Compass,
  AlertCircle,
  ShieldCheck,
  Activity,
  Info,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LiveDashboard: React.FC = () => {
  const { aqiData, language, setActiveTab } = useAirQuality();
  const [standard, setStandard] = useState<'us' | 'eu'>('us');

  if (!aqiData) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
        <p>Loading real-time atmospheric sensor data...</p>
      </div>
    );
  }

  const { location, current: curr } = aqiData;
  const p = curr.pollutants;

  const pollutantCards = [
    {
      key: 'pm25',
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter (≤2.5 µm)',
      val: p.pm2_5.value,
      unit: p.pm2_5.unit,
      limit: p.pm2_5.safe_limit,
      descEn: 'Microscopic particles that bypass respiratory filters and penetrate directly into bloodstream and pulmonary alveoli.',
      descHi: 'सूक्ष्म कण जो फेफड़ों की गहराई और रक्तप्रवाह में प्रवेश करते हैं।'
    },
    {
      key: 'pm10',
      name: 'PM10',
      fullName: 'Inhalable Particulate Matter (≤10 µm)',
      val: p.pm10.value,
      unit: p.pm10.unit,
      limit: p.pm10.safe_limit,
      descEn: 'Coarse dust, construction debris, road dust, and pollen that cause airway irritation, coughing, and bronchitis.',
      descHi: 'धूल और सड़क के कण जो गले में जलन और खांसी पैदा करते हैं।'
    },
    {
      key: 'no2',
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      val: p.no2.value,
      unit: p.no2.unit,
      limit: p.no2.safe_limit,
      descEn: 'Emitted primarily from motor vehicle exhaust and power generation; triggers severe asthma exacerbations.',
      descHi: 'वाहनों के धुएं से निकलने वाली गैस जो दमा बढ़ाती है।'
    },
    {
      key: 'o3',
      name: 'O₃',
      fullName: 'Ground-Level Ozone',
      val: p.o3.value,
      unit: p.o3.unit,
      limit: p.o3.safe_limit,
      descEn: 'Formed when vehicular NOx and VOCs react in intense sunlight; causes chest tightness and burning sensation.',
      descHi: 'धूप में रासायनिक क्रिया से बनने वाली हानिकारक गैस।'
    },
    {
      key: 'so2',
      name: 'SO₂',
      fullName: 'Sulphur Dioxide',
      val: p.so2.value,
      unit: p.so2.unit,
      limit: p.so2.safe_limit,
      descEn: 'Combustion byproduct of heavy diesel fuels, coal, and industrial boilers; forms secondary sulphate aerosols.',
      descHi: 'कोयले और भारी डीजल के जलने से निकलने वाली गैस।'
    },
    {
      key: 'co',
      name: 'CO',
      fullName: 'Carbon Monoxide',
      val: p.co.value,
      unit: p.co.unit,
      limit: p.co.safe_limit,
      descEn: 'Colourless, odourless gas from incomplete combustion; reduces oxygen delivery in arterial bloodstream.',
      descHi: 'रंगहीन गैस जो खून में ऑक्सीजन सोखने की क्षमता घटाती है।'
    }
  ];

  const getPollutantStatus = (val: number, limit: number) => {
    const ratio = val / limit;
    if (ratio <= 1.0) return { label: 'Within Safe Benchmark', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/20' };
    if (ratio <= 2.5) return { label: `${ratio.toFixed(1)}x Safe Limit`, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/20' };
    return { label: `${ratio.toFixed(1)}x Safe Limit (Elevated)`, color: 'text-red-400', bg: 'bg-red-950/40 border-red-500/20' };
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Standard Toggle & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>{language === 'en' ? 'Live Air Quality Intelligence' : 'लाइव वायु गुणवत्ता विश्लेषण'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {location.name} • {curr.updated_at} • Source: <span className="text-slate-300 font-medium">{curr.data_source}</span>
          </p>
        </div>

        {/* Standard Selector Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setStandard('us')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              standard === 'us'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            US AQI (EPA 0–500)
          </button>
          <button
            onClick={() => setStandard('eu')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              standard === 'eu'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            European AQI (0–100)
          </button>
        </div>
      </div>

      {/* Primary AQI Display & Health Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main AQI Gauge Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-extrabold text-slate-400">
                {standard === 'us' ? 'Air Quality Index (US EPA)' : 'European Air Quality Index'}
              </span>
              <span 
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border"
                style={{
                  backgroundColor: `${curr.category_color}20`,
                  borderColor: `${curr.category_color}50`,
                  color: curr.category_color
                }}
              >
                {curr.category}
              </span>
            </div>

            <div className="my-6">
              <div 
                className="text-6xl sm:text-7xl font-black tracking-tight"
                style={{ color: curr.category_color }}
              >
                {standard === 'us' ? curr.us_aqi : curr.european_aqi}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {standard === 'us' ? '0–500 Scale (Continuous)' : '0–100 European Scale'}
              </div>
            </div>

            {/* Gradient Spectrum Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden relative">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(100, standard === 'us' ? (curr.us_aqi / 400) * 100 : curr.european_aqi)}%`,
                    backgroundColor: curr.category_color
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>0 Good</span>
                <span>100 Mod</span>
                <span>200 Unhealthy</span>
                <span>300+ Haz</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {curr.description}
            </p>
          </div>
        </div>

        {/* Immediate Action & Meteorology Card */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Health Recommendation Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'en' ? 'Evidence-Based Protective Guidance' : 'वैज्ञानिक स्वास्थ्य सुरक्षा निर्देश'}</span>
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {curr.recommendation}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setActiveTab('planner')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-2 rounded-xl transition-colors"
              >
                <span>{language === 'en' ? 'Build 24h Daily Routine' : '24 घंटे की दिनचर्या बनाएं'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('indoor')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                <span>{language === 'en' ? 'Check Ventilation Windows' : 'खिड़की खोलने का समय देखें'}</span>
              </button>
            </div>
          </div>

          {/* Meteorological Atmospheric Context */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
              <Thermometer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">{language === 'en' ? 'Temperature' : 'तापमान'}</div>
              <div className="text-base font-bold text-white">{curr.weather.temperature}°C</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
              <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">{language === 'en' ? 'Humidity' : 'नमी'}</div>
              <div className="text-base font-bold text-white">{curr.weather.humidity}%</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
              <Wind className="w-4 h-4 text-teal-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">{language === 'en' ? 'Wind Speed' : 'हवा की गति'}</div>
              <div className="text-base font-bold text-white">{curr.weather.wind_speed} <span className="text-[10px]">km/h</span></div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
              <Compass className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">{language === 'en' ? 'Inversion Risk' : 'स्मॉग चक्र'}</div>
              <div className="text-xs font-bold text-amber-400">{curr.weather.condition}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Pollutants Grid (6 Air Pollutants) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{language === 'en' ? 'Measured Atmospheric Pollutants' : 'मापे गए वायु प्रदूषक'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'en'
                ? 'Measured concentrations vs. WHO & Indian CPCB 24-hour health benchmark limits'
                : 'विश्व स्वास्थ्य संगठन और सीपीसीबी 24 घंटे सुरक्षा मानकों की तुलना'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutantCards.map((pItem) => {
            const status = getPollutantStatus(pItem.val, pItem.limit);
            return (
              <div 
                key={pItem.key}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-400 tracking-wide">
                        {pItem.name}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-200">
                        {pItem.fullName}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="my-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">
                      {pItem.val}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {pItem.unit}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto font-medium">
                      Safe: ≤{pItem.limit} {pItem.unit}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                  {language === 'en' ? pItem.descEn : pItem.descHi}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
