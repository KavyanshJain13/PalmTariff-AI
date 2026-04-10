import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const VisualizationCharts = ({ simulationData, isLoading }) => {
  const importVolumeData = [
    { month: 'Jan', baseline: 850000, projected: simulationData?.importVolumeByMonth?.jan || 850000 },
    { month: 'Feb', baseline: 820000, projected: simulationData?.importVolumeByMonth?.feb || 820000 },
    { month: 'Mar', baseline: 890000, projected: simulationData?.importVolumeByMonth?.mar || 890000 },
    { month: 'Apr', baseline: 910000, projected: simulationData?.importVolumeByMonth?.apr || 910000 },
    { month: 'May', baseline: 875000, projected: simulationData?.importVolumeByMonth?.may || 875000 },
    { month: 'Jun', baseline: 920000, projected: simulationData?.importVolumeByMonth?.jun || 920000 }
  ];

  const farmerIncomeData = [
    { region: 'Andhra Pradesh', baseline: 45000, projected: simulationData?.farmerIncome?.ap || 45000 },
    { region: 'Karnataka', baseline: 42000, projected: simulationData?.farmerIncome?.ka || 42000 },
    { region: 'Kerala', baseline: 38000, projected: simulationData?.farmerIncome?.kl || 38000 },
    { region: 'Tamil Nadu', baseline: 41000, projected: simulationData?.farmerIncome?.tn || 41000 },
    { region: 'Telangana', baseline: 43000, projected: simulationData?.farmerIncome?.ts || 43000 }
  ];

  const priceVolatilityData = [
    { state: 'AP', consumer: 85, wholesale: 78, retail: 92 },
    { state: 'KA', consumer: 82, wholesale: 75, retail: 89 },
    { state: 'KL', consumer: 88, wholesale: 81, retail: 95 },
    { state: 'TN', consumer: 84, wholesale: 77, retail: 91 },
    { state: 'TS', consumer: 86, wholesale: 79, retail: 93 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-md p-3 shadow-lg">
          <p className="font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: ₹{entry?.value?.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3]?.map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Import Volume Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Import Volume Projection</h3>
          <span className="text-sm text-muted-foreground">(Metric Tons)</span>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={importVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000)?.toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="var(--color-muted-foreground)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Baseline"
              />
              <Line 
                type="monotone" 
                dataKey="projected" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                name="Projected"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer Income Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Users" size={20} className="text-success" />
            <h3 className="text-lg font-semibold text-foreground">Farmer Income Impact</h3>
            <span className="text-sm text-muted-foreground">(₹/Month)</span>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={farmerIncomeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  type="number"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000)?.toFixed(0)}K`}
                />
                <YAxis 
                  type="category"
                  dataKey="region" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="baseline" 
                  fill="var(--color-muted)" 
                  name="Current"
                  radius={[0, 4, 4, 0]}
                />
                <Bar 
                  dataKey="projected" 
                  fill="var(--color-success)" 
                  name="Projected"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Volatility Heatmap */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Activity" size={20} className="text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Price Volatility Index</h3>
            <span className="text-sm text-muted-foreground">(0-100 Scale)</span>
          </div>
          
          <div className="space-y-3">
            {priceVolatilityData?.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{item?.state}</span>
                  <span className="text-xs text-muted-foreground">
                    Avg: {Math.round((item?.consumer + item?.wholesale + item?.retail) / 3)}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div 
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                        item?.consumer > 90 ? 'bg-error text-error-foreground' :
                        item?.consumer > 80 ? 'bg-warning text-warning-foreground': 'bg-success text-success-foreground'
                      }`}
                    >
                      {item?.consumer}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">Consumer</span>
                  </div>
                  
                  <div className="text-center">
                    <div 
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                        item?.wholesale > 90 ? 'bg-error text-error-foreground' :
                        item?.wholesale > 80 ? 'bg-warning text-warning-foreground': 'bg-success text-success-foreground'
                      }`}
                    >
                      {item?.wholesale}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">Wholesale</span>
                  </div>
                  
                  <div className="text-center">
                    <div 
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                        item?.retail > 90 ? 'bg-error text-error-foreground' :
                        item?.retail > 80 ? 'bg-warning text-warning-foreground': 'bg-success text-success-foreground'
                      }`}
                    >
                      {item?.retail}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">Retail</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-xs text-muted-foreground">Low (&lt;80)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-xs text-muted-foreground">Medium (80-90)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-xs text-muted-foreground">High (&gt;90)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationCharts;