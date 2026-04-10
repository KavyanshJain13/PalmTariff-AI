import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICards = ({ simulationData, isLoading }) => {
  const kpiData = [
    {
      title: 'CPO Price Impact',
      value: simulationData?.cpoPrice?.toFixed(2) || '1,245.50',
      unit: '₹/MT',
      change: simulationData?.cpoPriceChange || -2.3,
      changeType: (simulationData?.cpoPriceChange || -2.3) < 0 ? 'negative' : 'positive',
      icon: 'TrendingDown',
      description: 'Current market price',
      confidence: 92
    },
    {
      title: 'Exchange Rate',
      value: simulationData?.exchangeRate?.toFixed(2) || '83.25',
      unit: '₹/$',
      change: simulationData?.exchangeRateChange || 0.15,
      changeType: 'positive',
      icon: 'DollarSign',
      description: 'USD-INR rate',
      confidence: 89
    },
    {
      title: 'Predicted Savings',
      value: simulationData?.predictedSavings?.toFixed(2) || '2,850.75',
      unit: 'Cr',
      change: simulationData?.savingsChange || 12.8,
      changeType: 'positive',
      icon: 'PiggyBank',
      description: 'Annual economic benefit',
      confidence: simulationData?.confidence || 95
    },
    {
      title: 'Import Volume',
      value: simulationData?.importVolumeMetric?.toFixed(2) || '8.45',
      unit: 'MMT',
      change: simulationData?.importVolumeChange || -5.2,
      changeType: 'negative',
      icon: 'Ship',
      description: 'Monthly import volume',
      confidence: 91
    },
    {
      title: 'Domestic Share',
      value: simulationData?.domesticShare?.toFixed(1) || '43.2',
      unit: '%',
      change: simulationData?.domesticShareChange || 3.7,
      changeType: 'positive',
      icon: 'Home',
      description: 'Local production share',
      confidence: 88
    },
    {
      title: 'Import Dependency',
      value: ((simulationData?.importDependency || 0.57) * 100)?.toFixed(1) || '57.0',
      unit: '%',
      change: -2.1,
      changeType: 'negative',
      icon: 'Globe',
      description: 'Reliance on imports',
      confidence: 85
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'text-primary bg-primary/10',
      success: 'text-success bg-success/10',
      warning: 'text-warning bg-warning/10',
      error: 'text-error bg-error/10'
    };
    return colors?.[color] || colors?.primary;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6]?.map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData?.map((kpi) => (
        <div key={kpi?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${getColorClasses(kpi?.color)}`}>
              <Icon name={kpi?.icon} size={16} />
            </div>
            {kpi?.change !== null && (
              <div className={`flex items-center space-x-1 ${getChangeColor(kpi?.change)}`}>
                <Icon 
                  name={kpi?.change > 0 ? 'ArrowUp' : 'ArrowDown'} 
                  size={12} 
                />
                <span className="text-xs font-medium">
                  {Math.abs(kpi?.change)?.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{kpi?.title}</h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-foreground">
                {typeof kpi?.value === 'number' ? kpi?.value?.toLocaleString('en-IN') : kpi?.value}
              </span>
              <span className="text-sm text-muted-foreground">{kpi?.unit}</span>
            </div>
            <p className="text-xs text-muted-foreground">{kpi?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;