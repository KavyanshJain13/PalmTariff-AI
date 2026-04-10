import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SimulationControls = ({ 
  tariffChange, 
  setTariffChange, 
  timeHorizon, 
  setTimeHorizon, 
  onRunSimulation, 
  onCompareScenarios, 
  isLoading 
}) => {
  const [sliderValue, setSliderValue] = useState(tariffChange);

  const timeHorizonOptions = [
    { value: 1, label: '1 Month' },
    { value: 2, label: '2 Months' },
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 9, label: '9 Months' },
    { value: 12, label: '12 Months' }
  ];

  const handleSliderChange = (e) => {
    const value = parseFloat(e?.target?.value);
    setSliderValue(value);
    setTariffChange(value);
  };

  const handleInputChange = (e) => {
    const value = parseFloat(e?.target?.value) || 0;
    const clampedValue = Math.max(-50, Math.min(50, value));
    setSliderValue(clampedValue);
    setTariffChange(clampedValue);
  };

  const getSliderColor = () => {
    if (sliderValue > 20) return 'bg-error';
    if (sliderValue > 10) return 'bg-warning';
    if (sliderValue < -20) return 'bg-success';
    if (sliderValue < -10) return 'bg-primary';
    return 'bg-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Settings" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Simulation Parameters</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tariff Adjustment Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Tariff Adjustment
            </label>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold ${
                sliderValue > 0 ? 'text-error' : sliderValue < 0 ? 'text-success' : 'text-muted-foreground'
              }`}>
                {sliderValue > 0 ? '+' : ''}{sliderValue?.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="-50"
              max="50"
              step="0.1"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>-50%</span>
              <span>0%</span>
              <span>+50%</span>
            </div>
          </div>

          {/* Manual Input */}
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Enter value"
              value={sliderValue}
              onChange={handleInputChange}
              min="-50"
              max="50"
              step="0.1"
              className="flex-1"
              disabled={isLoading}
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>

          {/* Impact Indicator */}
          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
            <Icon 
              name={sliderValue > 0 ? 'TrendingUp' : sliderValue < 0 ? 'TrendingDown' : 'Minus'} 
              size={16} 
              className={sliderValue > 0 ? 'text-error' : sliderValue < 0 ? 'text-success' : 'text-muted-foreground'}
            />
            <span className="text-sm text-muted-foreground">
              {sliderValue > 0 ? 'Tariff Increase' : sliderValue < 0 ? 'Tariff Reduction' : 'No Change'}
            </span>
          </div>
        </div>

        {/* Time Horizon & Actions */}
        <div className="space-y-4">
          <Select
            label="Projection Time Horizon"
            options={timeHorizonOptions}
            value={timeHorizon}
            onChange={setTimeHorizon}
            placeholder="Select duration"
            disabled={isLoading}
          />

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              variant="default"
              size="lg"
              fullWidth
              onClick={onRunSimulation}
              loading={isLoading}
              iconName="Play"
              iconPosition="left"
              disabled={!tariffChange && tariffChange !== 0}
            >
              Run Simulation
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onCompareScenarios}
              iconName="GitCompare"
              iconPosition="left"
              disabled={isLoading}
            >
              Compare Scenarios
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Quick Presets:</p>
            <div className="grid grid-cols-3 gap-2">
              {[-10, 0, 10]?.map((preset) => (
                <Button
                  key={preset}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSliderValue(preset);
                    setTariffChange(preset);
                  }}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {preset > 0 ? '+' : ''}{preset}%
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default SimulationControls;