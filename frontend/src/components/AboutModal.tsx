import React from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  X,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Code,
  Layers,
  Activity,
  Heart
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { language } = useAirQuality();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold">
            BW
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>BREATHEWISE AI</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">v1.0.0</span>
            </h2>
            <p className="text-xs text-slate-400">
              "Understand Your Air. Protect Your Day. Breathe Smarter."
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 pt-5 text-xs sm:text-sm text-slate-300">
          
          {/* Mission */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Mission & Purpose</span>
            </h3>
            <p className="leading-relaxed text-slate-300">
              Built as a flagship submission for <strong>PromptWars Virtual 2026 — Main Challenge 06: Urban Air Quality Assistant</strong>, organized by <strong>Hack2skill in collaboration with Google for Developers</strong>.
            </p>
          </div>

          {/* Participant Information */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Participant Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-400">Builder:</span> <strong className="text-white">Rajiv Kumar Sharma</strong></div>
              <div><span className="text-slate-400">Country:</span> <strong className="text-white">India</strong></div>
              <div><span className="text-slate-400">Challenge:</span> <span className="text-emerald-400 font-semibold">Challenge 06 (Air Quality)</span></div>
              <div><span className="text-slate-400">Target:</span> <span className="text-amber-400 font-semibold">Top 100 Leaderboard</span></div>
            </div>
          </div>

          {/* Technology Architecture */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>Technical Architecture</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• <strong>Frontend:</strong> React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.</li>
              <li>• <strong>Backend:</strong> Python 3.12, FastAPI, Uvicorn, Pydantic data validation.</li>
              <li>• <strong>GenAI Integration:</strong> Google Gemini API (gemini-2.0-flash) with structured grounding.</li>
              <li>• <strong>Environmental Sensors:</strong> Open-Meteo Air Quality & Weather API (Copernicus CAMS & GFS).</li>
              <li>• <strong>Biomedical Modeling:</strong> Inhaled particulate Bio-Dose aerodynamic model.</li>
            </ul>
          </div>

          {/* Compliance & Fair Play */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Truth & Competition Integrity</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              BreatheWise AI strictly adheres to the official PromptWars evaluation criteria. Never exposes API keys in frontend code, never hallucinates fabricated values, and clearly distinguishes between live satellite/sensor data, calculated estimates, and general health advisories.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
