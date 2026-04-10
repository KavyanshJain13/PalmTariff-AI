import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ExportToolbar from '../../components/ui/ExportToolbar';
import AlertBanner from '../../components/ui/AlertBanner';
import StatusIndicator from '../../components/ui/StatusIndicator';
import KPICard from './components/KPICard';
import MarketSummaryPanel from './components/MarketSummaryPanel';
import ImportDependencyTracker from './components/ImportDependencyTracker';
import ExportActionsPanel from './components/ExportActionsPanel';
import Icon from '../../components/AppIcon';

const OverviewDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('connected');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data for the dashboard
  const mockDashboardData = {
    kpiMetrics: [
      {
        id: 'cpo-price',
        title: 'Current CPO Price',
        value: '₹1,24,500',
        unit: 'per MT',
        change: 3.2,
        changeType: 'positive',
        icon: 'TrendingUp',
        description: 'Crude Palm Oil spot price',
        actionLabel: 'View Price History',
        trend: [85, 92, 78, 95, 88, 96, 100],
        confidence: 94
      },
      {
        id: 'import-volume',
        title: 'Monthly Import Volume',
        value: '8.45',
        unit: 'Lakh MT',
        change: -2.1,
        changeType: 'negative',
        icon: 'Ship',
        description: 'Palm oil imports this month',
        actionLabel: 'Analyze Trends',
        trend: [100, 95, 88, 92, 85, 78, 82],
        confidence: 91
      },
      {
        id: 'farmer-income',
        title: 'Avg Farmer Income',
        value: '₹2,85,000',
        unit: 'per hectare/year',
        change: 5.7,
        changeType: 'positive',
        icon: 'Users',
        description: 'Oil palm farmer earnings',
        actionLabel: 'View Impact Analysis',
        trend: [70, 75, 82, 88, 92, 95, 100],
        confidence: 88
      },
      {
        id: 'consumer-price',
        title: 'Consumer Price Index',
        value: '156.8',
        unit: 'CPI points',
        change: 1.4,
        changeType: 'positive',
        icon: 'ShoppingCart',
        description: 'Edible oil price index',
        actionLabel: 'Price Breakdown',
        trend: [88, 90, 92, 94, 96, 98, 100],
        confidence: 92
      },
      {
        id: 'exchange-rate',
        title: 'INR/USD Exchange',
        value: '83.25',
        unit: 'INR per USD',
        change: -0.8,
        changeType: 'negative',
        icon: 'DollarSign',
        description: 'Current exchange rate',
        actionLabel: 'Currency Impact',
        trend: [102, 100, 98, 96, 94, 92, 90],
        confidence: 96
      },
      {
        id: 'policy-savings',
        title: 'Projected Savings',
        value: '₹12,450',
        unit: 'Crore annually',
        change: 8.3,
        changeType: 'positive',
        icon: 'PiggyBank',
        description: 'Estimated policy impact',
        actionLabel: 'Savings Breakdown',
        trend: [60, 70, 75, 80, 85, 92, 100],
        confidence: 87
      }
    ],
    mlPredictions: [
      {
        metric: 'Import Volume Forecast',
        description: 'Next month import predictions',
        predictedChange: -5.2,
        changeType: 'negative',
        icon: 'TrendingDown'
      },
      {
        metric: 'Price Volatility Risk',
        description: 'Market stability assessment',
        predictedChange: 12.8,
        changeType: 'negative',
        icon: 'AlertTriangle'
      },
      {
        metric: 'Farmer Income Impact',
        description: 'Projected earnings change',
        predictedChange: 7.4,
        changeType: 'positive',
        icon: 'TrendingUp'
      },
      {
        metric: 'Consumer Price Effect',
        description: 'Retail price predictions',
        predictedChange: 2.1,
        changeType: 'positive',
        icon: 'ArrowUp'
      }
    ],
    performanceMetrics: {
      rmse: 3.8,
      confidence: 95,
      lastTraining: '2025-10-25T14:30:00Z'
    },
    importDependency: {
      current: 54.2,
      target: 45.0,
      milestones: [
        {
          title: 'Phase 1: Infrastructure Development',
          description: 'Processing facilities and farmer training',
          target: 52,
          timeline: 'Q2 2025',
          completed: true,
          inProgress: false
        },
        {
          title: 'Phase 2: Production Scaling',
          description: 'Expand cultivation to 10 lakh hectares',
          target: 48,
          timeline: 'Q4 2026',
          completed: false,
          inProgress: true
        },
        {
          title: 'Phase 3: Self-Sufficiency Target',
          description: 'Achieve 45% import dependency',
          target: 45,
          timeline: 'Q4 2030',
          completed: false,
          inProgress: false
        }
      ],
      domesticIncrease: 18.5,
      farmerCount: 125000
    },
    marketVolatility: 0.65,
    economicImpact: {
      gdpChange: 0.012
    }
  };

  useEffect(() => {
    // Simulate data loading
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDashboardData(mockDashboardData);
        setApiStatus('connected');
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setApiStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Auto-refresh every 15 minutes
    const refreshInterval = setInterval(() => {
      setLastRefresh(new Date());
      loadDashboardData();
    }, 15 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleKPIAction = (kpiId) => {
    switch (kpiId) {
      case 'cpo-price': case'import-volume': navigate('/tariff-simulation-builder');
        break;
      case 'farmer-income': case'consumer-price': navigate('/stakeholder-impact-analysis');
        break;
      default:
        navigate('/scenario-comparison');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading market intelligence...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Market Overview Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive palm oil trade intelligence and policy impact analysis
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <StatusIndicator 
              apiStatus={apiStatus} 
              simulationStatus="idle"
            />
            <ExportToolbar 
              simulationData={dashboardData}
            />
          </div>
        </div>

        {/* Alert Banner */}
        <AlertBanner 
          simulationData={dashboardData}
          className="mb-6"
        />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardData?.kpiMetrics?.map((kpi) => (
            <KPICard
              key={kpi?.id}
              title={kpi?.title}
              value={kpi?.value}
              unit={kpi?.unit}
              change={kpi?.change}
              changeType={kpi?.changeType}
              icon={kpi?.icon}
              description={kpi?.description}
              actionLabel={kpi?.actionLabel}
              onAction={() => handleKPIAction(kpi?.id)}
              trend={kpi?.trend}
              confidence={kpi?.confidence}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Market Summary Panel - Takes 2 columns */}
          <div className="xl:col-span-2">
            <MarketSummaryPanel
              mlPredictions={dashboardData?.mlPredictions || []}
              performanceMetrics={dashboardData?.performanceMetrics || {}}
              lastUpdated={lastRefresh}
            />
          </div>
          
          {/* Export Actions Panel */}
          <div className="xl:col-span-1">
            <ExportActionsPanel
              dashboardData={dashboardData}
            />
          </div>
        </div>

        {/* Import Dependency Tracker */}
        <ImportDependencyTracker
          currentDependency={dashboardData?.importDependency?.current || 54.2}
          targetDependency={dashboardData?.importDependency?.target || 45.0}
          progressData={dashboardData?.importDependency || {}}
          className="mb-8"
        />

        {/* Quick Navigation */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Navigation</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/tariff-simulation-builder')}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-left"
            >
              <Icon name="Calculator" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-card-foreground">Build Simulation</p>
                <p className="text-xs text-muted-foreground">Create tariff scenarios</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/scenario-comparison')}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-left"
            >
              <Icon name="GitCompare" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-card-foreground">Compare Scenarios</p>
                <p className="text-xs text-muted-foreground">Side-by-side analysis</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/stakeholder-impact-analysis')}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-left"
            >
              <Icon name="Users" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-card-foreground">Stakeholder Impact</p>
                <p className="text-xs text-muted-foreground">Analyze effects by group</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/nmeo-op-progress-tracker')}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-left"
            >
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-card-foreground">NMEO-OP Tracker</p>
                <p className="text-xs text-muted-foreground">Mission progress</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>© {new Date()?.getFullYear()} PalmTariff-AI</span>
              <span>•</span>
              <span>Government of India</span>
              <span>•</span>
              <span>MEITY Compliant</span>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Icon name="Shield" size={14} className="text-success" />
              <span>Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;