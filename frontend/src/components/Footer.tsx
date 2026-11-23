import React from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import { ShieldCheck, Heart, Sparkles, ExternalLink, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useAirQuality();

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand & Mission */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white">
              BREATHEWISE <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'en'
              ? 'An intelligent GenAI-powered urban air quality decision support system engineered for PromptWars Virtual 2026.'
              : 'प्रॉम्प्टवार्स वर्चुअल 2026 के लिए निर्मित जेनेरेटिव एआई संचालित शहरी वायु गुणवत्ता निर्णय सहायता प्रणाली।'}
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Open-Meteo & Gemini Grounded</span>
          </div>
        </div>

        {/* Col 2: Event & Challenge */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {language === 'en' ? 'Challenge Context' : 'प्रतियोगिता संदर्भ'}
          </h4>
          <ul className="text-xs space-y-1.5 text-slate-400">
            <li><span className="text-slate-300">Event:</span> PromptWars Virtual 2026</li>
            <li><span className="text-slate-300">Organizers:</span> Google for Developers × Hack2skill</li>
            <li><span className="text-slate-300">Challenge:</span> Main Challenge 06</li>
            <li><span className="text-slate-300">Topic:</span> Urban Air Quality Assistant</li>
            <li><span className="text-slate-300">Participant:</span> Rajiv Kumar Sharma</li>
          </ul>
        </div>

        {/* Col 3: Standards & Methodology */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {language === 'en' ? 'Scientific Standards' : 'वैज्ञानिक मानक'}
          </h4>
          <ul className="text-xs space-y-1.5 text-slate-400">
            <li>US EPA & Indian CPCB AQI Indexing</li>
            <li>WHO Global Air Quality Guidelines (2021)</li>
            <li>Copernicus Atmosphere Monitoring (CAMS)</li>
            <li>Inhaled Bio-Dose Aerodynamic Model</li>
            <li>Zero Simulated / Synthetic Data Claim</li>
          </ul>
        </div>

        {/* Col 4: Medical & Usage Disclaimer */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {language === 'en' ? 'Medical Disclaimer' : 'चिकित्सीय अस्वीकरण'}
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {language === 'en'
              ? 'BreatheWise AI provides general environmental risk assessment and lifestyle optimization based on measured outdoor sensor feeds. It does not provide clinical diagnosis or individualized medical prescriptions. Individuals with pre-existing cardiopulmonary conditions should consult healthcare professionals.'
              : 'ब्रीदवाइज एआई मापे गए वायु प्रदूषण डेटा पर आधारित सामान्य स्वास्थ्य सुरक्षा सलाह देता है। यह किसी व्यक्तिगत चिकित्सकीय निदान या दवा का विकल्प नहीं है। अस्थमा या हृदय रोगी अपने चिकित्सक से परामर्श लें।'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div>
          © 2026 BreatheWise AI • Built by <strong>Rajiv Kumar Sharma</strong> for PromptWars Virtual
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://promptwars.in/promptwarsVirtual.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            PromptWars Portal <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://hack2skill.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            Hack2skill <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
