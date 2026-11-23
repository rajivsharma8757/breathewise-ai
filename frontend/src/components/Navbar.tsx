import React, { useState } from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import {
  Wind,
  MapPin,
  RefreshCw,
  Navigation,
  Globe,
  FileText,
  Info,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenReport: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReport, onOpenAbout }) => {
  const {
    city,
    setCity,
    aqiData,
    loading,
    language,
    setLanguage,
    refreshData,
    detectLocation,
    isDetectingLocation,
    activeTab,
    setActiveTab
  } = useAirQuality();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const citiesList = [
    { key: "delhi", label: "New Delhi", state: "Delhi" },
    { key: "mumbai", label: "Mumbai", state: "Maharashtra" },
    { key: "bengaluru", label: "Bengaluru", state: "Karnataka" },
    { key: "kolkata", label: "Kolkata", state: "West Bengal" },
    { key: "chennai", label: "Chennai", state: "Tamil Nadu" },
    { key: "hyderabad", label: "Hyderabad", state: "Telangana" },
    { key: "pune", label: "Pune", state: "Maharashtra" },
    { key: "ahmedabad", label: "Ahmedabad", state: "Gujarat" },
    { key: "varanasi", label: "Varanasi", state: "Uttar Pradesh" },
    { key: "lucknow", label: "Lucknow", state: "Uttar Pradesh" },
    { key: "patna", label: "Patna", state: "Bihar" },
    { key: "jaipur", label: "Jaipur", state: "Rajasthan" },
    { key: "chandigarh", label: "Chandigarh", state: "Punjab/Haryana" },
    { key: "gurgaon", label: "Gurugram", state: "Haryana" },
    { key: "noida", label: "Noida", state: "Uttar Pradesh" }
  ];

  const navItems = [
    { id: 'dashboard', labelEn: 'Live AQI', labelHi: 'लाइव AQI' },
    { id: 'planner', labelEn: 'Daily Planner', labelHi: 'दैनिक योजना' },
    { id: 'indoor', labelEn: 'Indoor Hacks', labelHi: 'घर की हवा' },
    { id: 'chat', labelEn: 'AI Copilot', labelHi: 'AI सहायक' },
    { id: 'swaps', labelEn: 'Clean Commute', labelHi: 'स्वच्छ यात्रा' },
    { id: 'trends', labelEn: 'Trends & Smog', labelHi: 'प्रवृत्तियाँ' },
    { id: 'map', labelEn: 'Pollution Map', labelHi: 'प्रदूषण नक्शा' },
    { id: 'family', labelEn: 'Family Safety', labelHi: 'परिवार सुरक्षा' },
    { id: 'compare', labelEn: 'City Compare', labelHi: 'शहर तुलना' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-950/50">
              <Wind className="w-6 h-6 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-950"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  BREATHEWISE<span className="text-white text-sm font-semibold ml-1.5 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {language === 'en' ? 'Understand Your Air. Protect Your Day.' : 'हवा को समझें, सेहत की रक्षा करें'}
              </p>
            </div>
          </div>

          {/* Center Search / Location Selector */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              aria-label="Select City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none cursor-pointer pr-4"
            >
              {citiesList.map((c) => (
                <option key={c.key} value={c.key} className="bg-slate-900 text-slate-200">
                  {c.label}, {c.state}
                </option>
              ))}
            </select>
            <div className="h-4 w-px bg-slate-700"></div>
            <button
              onClick={detectLocation}
              disabled={isDetectingLocation}
              title={language === 'en' ? 'Detect My Location (GPS)' : 'जीपीएस से मेरी लोकेशन खोजें'}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">{isDetectingLocation ? 'Locating...' : 'GPS'}</span>
            </button>
            <button
              onClick={refreshData}
              disabled={loading}
              title={language === 'en' ? 'Refresh live sensor feed' : 'ताज़ा डेटा लोड करें'}
              className="text-slate-400 hover:text-emerald-400 p-1 rounded hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live AQI Badge in Navbar */}
            {aqiData && (
              <div 
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold"
                style={{
                  backgroundColor: `${aqiData.current.category_color}18`,
                  borderColor: `${aqiData.current.category_color}40`,
                  color: aqiData.current.category_color
                }}
              >
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: aqiData.current.category_color }}></span>
                AQI {aqiData.current.us_aqi}
              </div>
            )}

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
              title="Toggle Language (English / हिंदी)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'हिंदी' : 'ENG'}</span>
            </button>

            {/* Daily Report Trigger */}
            <button
              onClick={onOpenReport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Daily Report' : 'दैनिक रिपोर्ट'}</span>
            </button>

            {/* About & Methodology */}
            <button
              onClick={onOpenAbout}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors"
              title="About & Technical Architecture"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-900">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {language === 'en' ? item.labelEn : item.labelHi}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              aria-label="Select City Mobile"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none w-full"
            >
              {citiesList.map((c) => (
                <option key={c.key} value={c.key} className="bg-slate-900 text-slate-200">
                  {c.label}, {c.state}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                detectLocation();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-950/60 rounded"
            >
              GPS
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900/60 text-slate-300'
                }`}
              >
                {language === 'en' ? item.labelEn : item.labelHi}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onOpenReport();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 font-bold text-slate-950 text-xs"
          >
            <FileText className="w-4 h-4" />
            {language === 'en' ? 'Download Daily Report' : 'दैनिक रिपोर्ट डाउनलोड करें'}
          </button>
        </div>
      )}
    </header>
  );
};
