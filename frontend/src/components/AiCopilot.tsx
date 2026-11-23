import React, { useState } from 'react';
import { useAirQuality } from '../context/AirQualityContext';
import { sendChatMessage } from '../services/api';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Compass,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  grounded_data?: any;
  timestamp: string;
}

export const AiCopilot: React.FC = () => {
  const { city, aqiData, language } = useAirQuality();
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: `Hello! I am **BreatheWise AI Copilot**. I am directly grounded in real-time air quality metrics for **${aqiData?.location.name || city}** (AQI: ${aqiData?.current.us_aqi || 180}, PM2.5: ${aqiData?.current.pollutants.pm2_5.value || 88} µg/m³).\n\nAsk me about safe workout windows, mask efficiency, natural ventilation timing, or clean commute choices!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const quickPrompts = [
    "Is it safe to exercise outdoors today?",
    "When should I open my bedroom windows?",
    "Which commute is safer today: Metro or Two-Wheeler?",
    "How can I protect my children from winter smog?",
    "How can I reduce indoor air pollution with zero cost?"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(textToSend, city);
      const botMsg: ChatMessage = {
        sender: 'assistant',
        text: response.answer,
        grounded_data: response.grounded_data,
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "I encountered an error connecting to the reasoning engine. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Grounded Sensor Context Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{language === 'en' ? 'BreatheWise GenAI Environmental Copilot' : 'जेनेरेटिव एआई पर्यावरण सहायक'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Powered by Google Gemini 2.0 Flash • Strictly grounded in real-time measured pollutant concentrations
            </p>
          </div>

          {aqiData && (
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">Context:</span>
              <strong className="text-white">{aqiData.location.name}</strong>
              <span className="text-emerald-400 font-bold">AQI {aqiData.current.us_aqi}</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Carousel */}
        <div className="pt-4 border-t border-slate-800/80 mt-4">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'en' ? 'Suggested Decision Queries:' : 'सुझाए गए प्रश्न:'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-xs text-slate-300 hover:text-emerald-300 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 px-3 py-1.5 rounded-xl transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 min-h-[460px] flex flex-col justify-between shadow-xl">
        
        {/* Messages Scroll Area */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-slate-950 font-semibold'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 shadow-md'
                }`}>
                  <div className="whitespace-pre-line font-sans">
                    {m.text}
                  </div>

                  <div className={`mt-2 pt-2 border-t text-[10px] flex items-center justify-between ${
                    isUser ? 'border-emerald-700/60 text-emerald-950 font-bold' : 'border-slate-850 text-slate-400'
                  }`}>
                    <span>{isUser ? 'You' : 'BreatheWise Copilot'}</span>
                    <span>{m.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-400 flex items-center gap-2">
                <span>Reasoning over real-time atmospheric measurements...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'en'
                ? `Ask anything about air quality, outdoor safety, or smog in ${city}...`
                : `वायु प्रदूषण, सुरक्षा या दिनचर्या के बारे में कुछ भी पूछें...`
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex items-center justify-center p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
