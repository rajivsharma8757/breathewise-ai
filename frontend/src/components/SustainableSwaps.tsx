import React, { useState, useEffect } from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import type { CommuteMode } from '../types';
import { fetchSwaps } from '../services/api';
import {
  Leaf,
  Train,
  Zap,
  Users,
  Car,
  Bike,
  Sliders,
  CheckCircle2,
  TrendingDown,
  Shield,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const SustainableSwaps: React.FC = () => {
  const { language } = useAirQuality();
  const [distance, setDistance] = useState<number>(14.0);
  const [modes, setModes] = useState<CommuteMode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeHabits, setActiveHabits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchSwaps(distance).then((data) => {
      if (isMounted) {
        setModes(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [distance]);

  const getModeIcon = (name: string) => {
    if (name.includes('Metro')) return Train;
    if (name.includes('Electric')) return Zap;
    if (name.includes('Carpool')) return Users;
    if (name.includes('Bicycle')) return Bike;
    return Car;
  };

  const sustainableHabits = [
    {
      id: 'carpool',
      title: 'Shared / Pooled Work Commute',
      savings: 'Saves ~2.8 kg CO₂ per trip & removes 1 car from morning bottleneck.',
      icon: Users
    },
    {
      id: 'induction',
      title: 'Induction / Electric Cooking',
      savings: 'Eliminates 100% of indoor LPG combustion NO₂ & unburnt VOC vapors.',
      icon: Zap
    },
    {
      id: 'metro_card',
      title: 'Monthly Public Transit Pass',
      savings: 'Reduces individual carbon footprint by 78% annually (~1.2 tonnes CO₂).',
      icon: Train
    },
    {
      id: 'filter_maintenance',
      title: 'Regular Vacuuming of Pre-Filter Mesh',
      savings: 'Extends HEPA filter life by 4 months and reduces motor power draw by 15W.',
      icon: Leaf
    }
  ];

  const toggleHabit = (id: string) => {
    setActiveHabits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Header & Distance Slider */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? 'Sustainable Commute & Lifestyle Swap Engine' : 'पर्यावरण-अनुकूल यात्रा व जीवनशैली विकल्प'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Transparent carbon emission and particulate exposure trade-offs across modern urban transit modes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs text-emerald-300 font-semibold">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>Target: Cut Individual Smog Footprint</span>
          </div>
        </div>

        {/* Distance Slider Control */}
        <div className="pt-5 space-y-2 max-w-xl">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>{language === 'en' ? 'Adjust One-Way Commute Distance:' : 'एकतरफा यात्रा की दूरी चुनें:'}</span>
            <span className="text-emerald-400 text-sm font-bold">{distance} Kilometres</span>
          </div>
          <input
            type="range"
            aria-label="Commute Distance in Kilometres"
            min="2.0"
            max="40.0"
            step="1.0"
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>2 km (Local)</span>
            <span>15 km (Suburban)</span>
            <span>40 km (Intercity Corridor)</span>
          </div>
        </div>
      </div>

      {/* Transit Modes Comparison Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Train className="w-4 h-4 text-emerald-400" />
          <span>{language === 'en' ? 'Trip Mode Breakdown' : 'यातायात विकल्पों की तुलना'}</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Calculating emissions & exposure...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modes.map((m, idx) => {
              const Icon = getModeIcon(m.mode);
              const isBest = m.sustainability_score >= 90;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all shadow-md ${
                    isBest
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-emerald-950/20'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2.5 rounded-xl ${
                          isBest ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {m.mode}
                          </h4>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            {m.badge}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-400">Score</span>
                        <div className={`text-base font-black ${
                          m.sustainability_score > 75 ? 'text-emerald-400' : m.sustainability_score > 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {m.sustainability_score}/100
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-850">
                      <div>
                        <div className="text-[10px] text-slate-400">CO₂ Emitted</div>
                        <div className="font-bold text-white mt-0.5">{m.co2_emissions_kg} kg</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-emerald-400 font-medium">CO₂ Saved vs Car</div>
                        <div className="font-bold text-emerald-400 mt-0.5">{m.co2_saved_vs_car_kg} kg</div>
                      </div>
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-[10px] text-slate-400">PM2.5 Inhaled</div>
                        <div className="font-bold text-slate-300 mt-0.5">{m.pm25_exposure_ug} µg</div>
                      </div>
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-[10px] text-slate-400">Trip Duration</div>
                        <div className="font-bold text-slate-300 mt-0.5">~{m.duration_min} mins</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Burned: ~{m.calories_burned} kcal</span>
                    <span className="text-emerald-400 font-semibold">
                      {m.co2_saved_vs_car_kg > 0 ? `-${Math.round((m.co2_saved_vs_car_kg / (distance * 0.192)) * 100)}% Carbon` : 'Baseline'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sustainable Lifestyle Habits Checklist */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{language === 'en' ? 'Community Clean Air Habits' : 'स्वच्छ हवा के लिए सामुदायिक आदतें'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sustainableHabits.map((habit) => {
            const Icon = habit.icon;
            const isChecked = !!activeHabits[habit.id];

            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isChecked ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{habit.title}</h4>
                    <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{habit.savings}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
