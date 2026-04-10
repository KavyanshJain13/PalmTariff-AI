import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ExportToolbar from '../../components/ui/ExportToolbar';
import StatusIndicator from '../../components/ui/StatusIndicator';
import SimulationControls from './components/SimulationControls';
import VisualizationCharts from './components/VisualizationCharts';
import KPICards from './components/KPICards';
import AlertsSection from './components/AlertsSection';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TariffSimulationBuilder = () => {
  const navigate = useNavigate();
  const [tariffChange, setTariffChange] = useState(0);
  const [timeHorizon, setTimeHorizon] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [apiStatus, setApiStatus] = useState('connected');
  const [simulationStatus, setSimulationStatus] = useState('idle');

  // Mock simulation data
  const mockSimulationData = {
    cpoPrice: 1245.50,
    cpoPriceChange: -2.3,
    exchangeRate: 83.25,
    exchangeRateChange: 0.15,
    predictedSavings: 2850.75,
    savingsChange: 12.8,
    importVolumeMetric: 8.45,
    importVolumeChange: -5.2,
    domesticShare: 43.2,
    domesticShareChange: 3.7,
    confidence: 94.8,
    importDependency: 0.57,
    priceVolatility: 82.5,
    marketVolatility: 0.45,
    economicImpact: {
      gdpChange: -0.015
    },
    importVolumeByMonth: {
      jan: 850000 * (1 + (tariffChange * -0.02)),
      feb: 820000 * (1 + (tariffChange * -0.02)),
      mar: 890000 * (1 + (tariffChange * -0.02)),
      apr: 910000 * (1 + (tariffChange * -0.02)),
      may: 875000 * (1 + (tariffChange * -0.02)),
      jun: 920000 * (1 + (tariffChange * -0.02))
    },
    farmerIncome: {
      ap: 45000 * (1 + (tariffChange * 0.015)),
      ka: 42000 * (1 + (tariffChange * 0.015)),
      kl: 38000 * (1 + (tariffChange * 0.015)),
      tn: 41000 * (1 + (tariffChange * 0.015)),
      ts: 43000 * (1 + (tariffChange * 0.015))
    }
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setSimulationStatus('processing');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock API response based on tariff change
      const adjustedData = {
        ...mockSimulationData,
        predictedSavings: mockSimulationData?.predictedSavings * (1 + (tariffChange * 0.1)),
        savingsChange: tariffChange * 2.5,
        importVolumeChange: tariffChange * -2.1,
        domesticShareChange: tariffChange * 0.8,
        priceVolatility: Math.max(60, Math.min(95, 82.5 + Math.abs(tariffChange) * 0.5))
      };
      
      setSimulationData(adjustedData);
      setSimulationStatus('idle');
      
    } catch (error) {
      console.error('Simulation failed:', error);
      setSimulationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareScenarios = () => {
    navigate('/scenario-comparison', { 
      state: { 
        currentScenario: { tariffChange, timeHorizon, data: simulationData } 
      } 
    });
  };

  useEffect(() => {
    // Initialize with default simulation
    if (!simulationData) {
      setSimulationData(mockSimulationData);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Tariff Simulation Builder</h1>
            <p className="text-muted-foreground">
              Configure and execute economic impact scenarios for Crude Palm Oil import duties
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <StatusIndicator 
              apiStatus={apiStatus} 
              simulationStatus={simulationStatus}
            />
            <ExportToolbar simulationData={simulationData} />
          </div>
        </div>

        {/* Simulation Controls */}
        <SimulationControls
          tariffChange={tariffChange}
          setTariffChange={setTariffChange}
          timeHorizon={timeHorizon}
          setTimeHorizon={setTimeHorizon}
          onRunSimulation={handleRunSimulation}
          onCompareScenarios={handleCompareScenarios}
          isLoading={isLoading}
        />

        {/* KPI Cards */}
        <KPICards simulationData={simulationData} isLoading={isLoading} />

        {/* Alerts Section */}
        <AlertsSection 
          simulationData={simulationData} 
          tariffChange={tariffChange}
        />

        {/* Visualization Charts */}
        <VisualizationCharts 
          simulationData={simulationData} 
          isLoading={isLoading}
        />

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Zap" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/stakeholder-impact-analysis')}
              iconName="Users"
              iconPosition="left"
              className="justify-start"
            >
              Stakeholder Analysis
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/nmeo-op-progress-tracker')}
              iconName="TrendingUp"
              iconPosition="left"
              className="justify-start"
            >
              NMEO-OP Tracker
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/overview-dashboard')}
              iconName="BarChart3"
              iconPosition="left"
              className="justify-start"
            >
              Market Overview
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setTariffChange(0);
                setSimulationData(mockSimulationData);
              }}
              iconName="RotateCcw"
              iconPosition="left"
              className="justify-start"
            >
              Reset Simulation
            </Button>
          </div>
        </div>

        {/* Model Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Brain" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">ML Model Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Model Architecture</h4>
              <p className="text-sm text-muted-foreground">
                Weighted ensemble combining GRU, LSTM, and XGBoost models for comprehensive economic impact prediction.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Performance Metrics</h4>
              <p className="text-sm text-muted-foreground">
                RMSE &lt; 5% with 95% confidence intervals. Trained on 10+ years of trade data and economic indicators.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Data Sources</h4>
              <p className="text-sm text-muted-foreground">
                DGFT trade statistics, RBI exchange rates, APEDA export data, and NMEO-OP mission reports.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TariffSimulationBuilder;