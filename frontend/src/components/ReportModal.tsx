import React from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  X,
  Printer,
  Download,
  Wind,
  ShieldCheck,
  Calendar,
  Clock,
  Compass,
  AlertTriangle
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const { aqiData, language } = useAirQuality();

  if (!isOpen || !aqiData) return null;

  const { location, current: curr } = aqiData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header for Printable Area */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            <span>Official Daily Air Quality Health Advisory Card</span>
          </span>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md mr-10"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* Printable Card Body */}
        <div id="printable-report" className="mt-4 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 text-slate-200">
          
          {/* Header of Report */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-base font-black text-white tracking-tight">
                BREATHEWISE AI • DAILY AIR ADVISORY
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>{location.name}</span>
                <span>•</span>
                <span>{curr.updated_at}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
              <div
                className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full border mt-0.5 inline-block"
                style={{
                  backgroundColor: `${curr.category_color}20`,
                  borderColor: `${curr.category_color}50`,
                  color: curr.category_color
                }}
              >
                {curr.category}
              </div>
            </div>
          </div>

          {/* Core Numbers */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">US AQI</div>
              <div className="text-2xl font-black" style={{ color: curr.category_color }}>{curr.us_aqi}</div>
              <div className="text-[10px] text-slate-400">EU AQI: {curr.european_aqi}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">PM2.5 Mass</div>
              <div className="text-2xl font-black text-white">{curr.pollutants.pm2_5.value}</div>
              <div className="text-[10px] text-slate-400">Safe: ≤15 µg/m³</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</div>
              <div className="text-2xl font-black text-white">{curr.weather.temperature}°C</div>
              <div className="text-[10px] text-slate-400">Wind: {curr.weather.wind_speed} km/h</div>
            </div>
          </div>

          {/* Action Guidelines */}
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <strong className="text-emerald-400 font-bold block mb-1">
                Optimal Outdoor Activity Window:
              </strong>
              <span>Lowest pollution expected around <strong>{curr.optimal_outdoor_window}</strong>. Avoid morning peak smog ({curr.worst_smog_window}).</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <strong className="text-cyan-400 font-bold block mb-1">
                Room Ventilation Recommendation:
              </strong>
              <span>Open windows strictly between <strong>1:00 PM and 3:30 PM</strong> when solar convection dilutes inversion smog. Keep sealed morning and night.</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <strong className="text-purple-400 font-bold block mb-1">
                Respiratory Protection Standard:
              </strong>
              <span>Certified N95 respirator recommended for all outdoor movement over 15 minutes. Ensure tight nose-clip seal.</span>
            </div>
          </div>

          {/* Footer of Card */}
          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Prepared by BreatheWise AI for <strong>Rajiv Kumar Sharma</strong></span>
            <span>Source: Open-Meteo & Copernicus CAMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
