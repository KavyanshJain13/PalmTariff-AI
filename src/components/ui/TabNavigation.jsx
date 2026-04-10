import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const location = useLocation();

  const tabs = [
    { 
      label: 'Overview', 
      path: '/overview-dashboard', 
      icon: 'BarChart3',
      description: 'Market intelligence and current state assessment'
    },
    { 
      label: 'Simulate', 
      path: '/tariff-simulation-builder', 
      icon: 'Calculator',
      description: 'Interactive tariff scenario modeling'
    },
    { 
      label: 'Compare', 
      path: '/scenario-comparison', 
      icon: 'GitCompare',
      description: 'Side-by-side scenario analysis'
    },
    { 
      label: 'Stakeholders', 
      path: '/stakeholder-impact-analysis', 
      icon: 'Users',
      description: 'Impact assessment across segments'
    },
    { 
      label: 'NMEO-OP', 
      path: '/nmeo-op-progress-tracker', 
      icon: 'TrendingUp',
      description: 'Mission progress and import monitoring'
    },
  ];

  const isActiveTab = (path) => location?.pathname === path;

  return (
    <div className="bg-white border-b border-border sticky top-16 z-40">
      <div className="px-6">
        <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
          {tabs?.map((tab) => (
            <Link
              key={tab?.path}
              to={tab?.path}
              className={`group flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                isActiveTab(tab?.path)
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
              }`}
            >
              <Icon 
                name={tab?.icon} 
                size={18} 
                className={`transition-colors duration-200 ${
                  isActiveTab(tab?.path) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              <span className="font-medium text-sm">{tab?.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;