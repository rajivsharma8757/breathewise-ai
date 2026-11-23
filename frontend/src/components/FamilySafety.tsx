import React from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  ShieldCheck,
  Heart,
  Baby,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Info
} from 'lucide-react';

export const FamilySafety: React.FC = () => {
  const { aqiData, language } = useAirQuality();
  const aqi = aqiData?.current.us_aqi || 180;
  const isHighSmog = aqi > 150;

  const demographics = [
    {
      titleEn: "Infants & Young Children",
      titleHi: "शिशु और छोटे बच्चे",
      icon: Baby,
      badge: "Highest Biological Vulnerability",
      color: "border-cyan-500/30 bg-cyan-950/20",
      iconColor: "text-cyan-400",
      reasons: [
        "Breathe 50% more air per kilogram of body weight compared to adults.",
        "Alveoli and airway immunity are actively developing until age 8.",
        "Mouth-breathing during physical play bypasses nasal filtration."
      ],
      actions: [
        "Cancel or reschedule outdoor school sports when AQI exceeds 150.",
        "Ensure properly sized child-fit N95 respirators (adult masks leak).",
        "Keep bedroom HEPA purifiers running continuously on auto."
      ]
    },
    {
      titleEn: "Senior Citizens (65+)",
      titleHi: "वरिष्ठ नागरिक (65+ वर्ष)",
      icon: Users,
      badge: "Cardiovascular & Pulmonary Strain",
      color: "border-purple-500/30 bg-purple-950/20",
      iconColor: "text-purple-400",
      reasons: [
        "Reduced mucociliary clearance slows particulate expulsion.",
        "Fine particulates trigger systemic inflammation, increasing arterial blood pressure.",
        "Pre-existing hypertension or cardiac history elevates risk."
      ],
      actions: [
        "Strictly avoid early morning park walks (6 AM - 9 AM inversion trap).",
        "Monitor blood pressure and pulse oximeter readings regularly during severe smog.",
        "Do light indoor stretching or yoga rather than outdoor walks."
      ]
    },
    {
      titleEn: "Asthma, COPD & Allergy Patients",
      titleHi: "दमा एवं एलर्जी से ग्रस्त व्यक्ति",
      icon: Stethoscope,
      badge: "Acute Bronchial Hyper-Reactivity",
      color: "border-red-500/30 bg-red-950/20",
      iconColor: "text-red-400",
      reasons: [
        "PM2.5 and NO2 cause acute bronchospasm and terminal airway narrowing.",
        "Secondary particulate aerosols induce rapid mucous hypersecretion.",
        "Cold winter air combined with pollutants triggers nocturnal coughing fits."
      ],
      actions: [
        "Always carry prescribed rescue bronchodilator inhalers.",
        "Use a spacer device for maximum medication delivery during smog days.",
        "Seal door and window frames to eliminate outdoor particulate intrusion."
      ]
    },
    {
      titleEn: "Expectant Mothers",
      titleHi: "गर्भवती महिलाएं",
      icon: Heart,
      badge: "Maternal & Fetal Protection",
      color: "border-amber-500/30 bg-amber-950/20",
      iconColor: "text-amber-400",
      reasons: [
        "Ultrafine particulates (PM0.1) can cross the placental barrier.",
        "Elevated carbon monoxide levels reduce placental oxygen transfer.",
        "Maternal systemic inflammation increases preeclampsia risk."
      ],
      actions: [
        "Stay indoors during high smog advisories with active HEPA filtration.",
        "Avoid indoor combustion sources (mosquito coils, incense sticks, frying).",
        "Ensure adequate hydration and consult obstetrician if coughing occurs."
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? 'Family Safety Protocols & Vulnerable Groups' : 'पारिवारिक सुरक्षा और संवेदनशील वर्ग'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Physiologically tailored protocols to protect infants, expectant mothers, elderly parents, and respiratory patients.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl font-semibold">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>WHO & CPCB Pediatric/Geriatric Guidelines</span>
          </div>
        </div>
      </div>

      {/* High Smog Warning Banner if AQI is Elevated */}
      {isHighSmog && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-5 flex items-start gap-3.5 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              {language === 'en' ? 'Active High Smog Vulnerability Alert' : 'गंभीर वायु प्रदूषण चेतावनी सक्रिय'}
            </h4>
            <p className="text-xs text-red-200 leading-relaxed">
              At current AQI levels ({aqi}), family members with asthma, heart conditions, or developing lungs are at high risk of acute symptoms. Please enforce indoor isolation and certified N95 respirators.
            </p>
          </div>
        </div>
      )}

      {/* 4 Demographics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demographics.map((demo, idx) => {
          const Icon = demo.icon;
          return (
            <div
              key={idx}
              className={`rounded-3xl border p-6 flex flex-col justify-between shadow-xl transition-all ${demo.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <Icon className={`w-6 h-6 ${demo.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {language === 'en' ? demo.titleEn : demo.titleHi}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {demo.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Biological Vulnerability Reasons */}
                <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-850 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Biological Vulnerability Factors:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {demo.reasons.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Practical Clinical Actions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                    Recommended Protective Actions:
                  </span>
                  <ul className="text-xs text-slate-200 space-y-1.5">
                    {demo.actions.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-slate-400 italic">
                *Advisory guidance based on ambient atmospheric concentrations. Not an individual medical prescription.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
