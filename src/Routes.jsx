import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import StakeholderImpactAnalysis from './pages/stakeholder-impact-analysis';
import TariffSimulationBuilder from './pages/tariff-simulation-builder';
import ScenarioComparison from './pages/scenario-comparison';
import NMEOOPProgressTracker from './pages/nmeo-op-progress-tracker';
import OverviewDashboard from './pages/overview-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<TariffSimulationBuilder />} />
        <Route path="/stakeholder-impact-analysis" element={<StakeholderImpactAnalysis />} />
        <Route path="/tariff-simulation-builder" element={<TariffSimulationBuilder />} />
        <Route path="/scenario-comparison" element={<ScenarioComparison />} />
        <Route path="/nmeo-op-progress-tracker" element={<NMEOOPProgressTracker />} />
        <Route path="/overview-dashboard" element={<OverviewDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
