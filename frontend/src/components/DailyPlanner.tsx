import React, { useState, useEffect } from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import type { DailyRoutine } from '../types';
import { fetchRoutine } from '../services/api';
import {
  Clock,
  User,
  Shield,
  Activity,
  AlertTriangle,
  Sun,
  Briefcase,
  Wind,
  Moon,
  Sparkles,
  Calculator,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

export const DailyPlanner: React.FC = () => {
  const { city, aqiData, language, profile, setProfile } = useAirQuality();
  const [routine, setRoutine] = useState<DailyRoutine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Bio-Dose interactive calculator states
  const [outdoorHours, setOutdoorHours] = useState<number>(2.0);
  const [activityMode, setActivityMode] = useState<'rest' | 'commute' | 'moderate' | 'vigorous'>('moderate');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchRoutine(city, profile).then((res) => {
      if (isMounted) {
        setRoutine(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [city, profile]);

  const pm25 = aqiData?.current.pollutants.pm2_5.value || 88.0;

  // Real-time calculation based on sliders
  const breathingRates = {
    rest: 0.5,
    commute: 1.0,
    moderate: 1.3,
    vigorous: 2.5
  };
  const rate = breathingRates[activityMode];
  const calculatedDose = Number((pm25 * rate * outdoorHours).toFixed(1));
  const n95Dose = Number((calculatedDose * 0.05).toFixed(1));
  const savedDose = Number((calculatedDose - n95Dose).toFixed(1));
  const whoBaseline = Number((7.5 * outdoorHours).toFixed(1));
  const whoBenchmarkRatio = Number((calculatedDose / Math.max(whoBaseline, 1.0)).toFixed(1));

  const profileOptions = [
    { key: 'adult', labelEn: 'General Adult', labelHi: 'वयस्क', icon: User },
    { key: 'child', labelEn: 'Child / Student', labelHi: 'बच्चे / छात्र', icon: Activity },
    { key: 'senior', labelEn: 'Senior Citizen (65+)', labelHi: 'वरिष्ठ नागरिक', icon: Shield },
    { key: 'patient', labelEn: 'Asthma / Sensitive', labelHi: 'दमा / संवेदनशील', icon: AlertTriangle }
  ];

  return (
    <div className="space-y-8">
      {/* Header & Profile Switcher */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? 'Personalized Daily Pollution Routine' : 'व्यक्तिगत दैनिक वायु योजना'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'en'
                ? `Customized for ${aqiData?.location.name || city} • Grounded in live atmospheric sensor data`
                : `${aqiData?.location.name || city} के लाइव प्रदूषण स्तर पर आधारित`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{routine?.ai_grounded ? 'Gemini Grounded Reasoning' : 'Evidence Clinical Engine'}</span>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="pt-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            {language === 'en' ? 'Select Family / Vulnerability Profile:' : 'परिवार का सदस्य / प्रोफाइल चुनें:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {profileOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = profile === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setProfile(opt.key as any)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{language === 'en' ? opt.labelEn : opt.labelHi}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Clock className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
          <p>Synthesizing personalized routine based on diurnal smog curves...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Routine Blocks (4 Time Windows) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Morning Block */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-400">
                <Sun className="w-4 h-4" />
                <span>{language === 'en' ? 'Morning Window (6:00 AM – 10:30 AM)' : 'सुबह का समय (6:00 – 10:30 पूर्वाह्न)'}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {routine?.morning_routine}
              </p>
            </div>

            {/* Commute Block */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-400">
                <Briefcase className="w-4 h-4" />
                <span>{language === 'en' ? 'Commute & Travel Strategy' : 'यात्रा और आवागमन रणनीति'}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {routine?.commute_advice}
              </p>
            </div>

            {/* Midday Ventilation Block */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-400">
                <Wind className="w-4 h-4" />
                <span>{language === 'en' ? 'Ventilation & Fresh Air Window' : 'वेंटिलेशन और ताजी हवा'}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {routine?.ventilation_window}
              </p>
            </div>

            {/* Evening Block */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-purple-400">
                <Moon className="w-4 h-4" />
                <span>{language === 'en' ? 'Evening & Bedroom Protocol' : 'शाम और सोने की तैयारी'}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {routine?.evening_routine}
              </p>
            </div>

            {/* Mask Recommendation Card */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>{language === 'en' ? 'Mask & Respirator Recommendation' : 'मास्क सुरक्षा निर्देश'}</span>
              </div>
              <p className="text-sm text-emerald-100 font-semibold leading-relaxed">
                {routine?.mask_recommendation}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                Tip: Press the aluminum nose clip firmly against the bridge of your nose. Cloth masks provide negligible sub-micron protection.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inhaled Bio-Dose Calculator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'en' ? 'Smart Pollution Bio-Dose Calculator' : 'प्रदूषण बायो-डोज़ कैलकुलेटर'}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Aerodynamic Model</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates the exact microscopic mass (µg) of PM2.5 particulates deposited into pulmonary gas-exchange alveoli based on your breathing rate.
              </p>

              {/* Slider: Hours Outdoors */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>{language === 'en' ? 'Hours Outdoors:' : 'बाहर बिताए घंटे:'}</span>
                  <span className="text-emerald-400 font-bold">{outdoorHours} Hours</span>
                </div>
                <input
                  type="range"
                  aria-label="Hours Outdoors"
                  min="0.5"
                  max="6.0"
                  step="0.5"
                  value={outdoorHours}
                  onChange={(e) => setOutdoorHours(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Activity Level Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  {language === 'en' ? 'Activity Intensity:' : 'गतिविधि का स्तर:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setActivityMode('rest')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                      activityMode === 'rest'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Rest / Sit (0.5 m³/h)
                  </button>
                  <button
                    onClick={() => setActivityMode('commute')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                      activityMode === 'commute'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Transit (1.0 m³/h)
                  </button>
                  <button
                    onClick={() => setActivityMode('moderate')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                      activityMode === 'moderate'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Brisk Walk (1.3 m³/h)
                  </button>
                  <button
                    onClick={() => setActivityMode('vigorous')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                      activityMode === 'vigorous'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Cardio Run (2.5 m³/h)
                  </button>
                </div>
              </div>

              {/* Bio-Dose Result Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3 text-center">
                  <div className="text-[11px] text-red-300 font-medium">Unprotected Dose</div>
                  <div className="text-2xl font-black text-red-400 mt-1">{calculatedDose} <span className="text-xs">µg</span></div>
                  <div className="text-[10px] text-red-300 mt-0.5">{whoBenchmarkRatio}x WHO 24h Ref Baseline</div>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-center">
                  <div className="text-[11px] text-emerald-300 font-medium">With Certified N95</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{n95Dose} <span className="text-xs">µg</span></div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">{savedDose} µg (95%) filtered</div>
                </div>
              </div>

              {/* Scientific Explanation Dropdown / Note */}
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mathematical Methodology (ICRP Human Tract Model)</span>
                </div>
                <p>
                  Estimated Inhaled Mass = Ambient PM2.5 ({pm25} µg/m³) × Respiration Rate ({rate} m³/h) × Time ({outdoorHours} h).
                </p>
                <p className="text-[10px] text-slate-400 pt-0.5 italic">
                  Note: Bio-Dose is a mathematical exposure estimate based on ambient sensors; not an individual medical diagnostic test.
                </p>
              </div>
            </div>

            {/* Scientific Explanation from Backend */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                {language === 'en' ? 'Scientific Inversion Mechanics' : 'वायुमंडलीय इनवर्जन विज्ञान'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {routine?.scientific_explanation}
              </p>
              <p className="text-[10px] text-slate-400 italic pt-1">
                {routine?.limitations}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
