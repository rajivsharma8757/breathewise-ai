import React, { useState } from 'react';
import { AirQualityProvider, useAirQuality } from './context/AirQualityContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { LiveDashboard } from './components/LiveDashboard';
import { DailyPlanner } from './components/DailyPlanner';
import { IndoorAssistant } from './components/IndoorAssistant';
import { AiCopilot } from './components/AiCopilot';
import { SustainableSwaps } from './components/SustainableSwaps';
import { PollutionTrends } from './components/PollutionTrends';
import { PollutionMap } from './components/PollutionMap';
import { FamilySafety } from './components/FamilySafety';
import { CityComparison } from './components/CityComparison';
import { AboutModal } from './components/AboutModal';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { activeTab } = useAirQuality();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <LandingHero />
            <LiveDashboard />
          </>
        );
      case 'planner':
        return <DailyPlanner />;
      case 'indoor':
        return <IndoorAssistant />;
      case 'chat':
        return <AiCopilot />;
      case 'swaps':
        return <SustainableSwaps />;
      case 'trends':
        return <PollutionTrends />;
      case 'map':
        return <PollutionMap />;
      case 'family':
        return <FamilySafety />;
      case 'compare':
        return <CityComparison />;
      default:
        return (
          <>
            <LandingHero />
            <LiveDashboard />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar
        onOpenReport={() => setReportModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveScreen()}
      </main>

      <Footer />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AirQualityProvider>
      <MainContent />
    </AirQualityProvider>
  );
}

export default App;
