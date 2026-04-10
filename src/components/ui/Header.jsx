import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    { label: 'Overview', path: '/overview-dashboard', icon: 'BarChart3' },
    { label: 'Simulate', path: '/tariff-simulation-builder', icon: 'Calculator' },
    { label: 'Compare', path: '/scenario-comparison', icon: 'GitCompare' },
    { label: 'Stakeholders', path: '/stakeholder-impact-analysis', icon: 'Users' },
  ];

  const secondaryNavItems = [
    { label: 'NMEO-OP Tracker', path: '/nmeo-op-progress-tracker', icon: 'TrendingUp' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="bg-white border-b border-border shadow-elevation-1 sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Zap" size={24} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">PalmTariff-AI</h1>
            <span className="text-xs text-muted-foreground">Government Policy Analytics</span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
          
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              iconName="MoreHorizontal"
              iconPosition="right"
              className="text-muted-foreground hover:text-foreground"
            >
              More
            </Button>
            
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-elevation-2 py-1 z-50">
                {secondaryNavItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors duration-200 ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-popover-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            iconName="Menu"
          />
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-foreground">Policy Admin</span>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMoreMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {[...primaryNavItems, ...secondaryNavItems]?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMoreMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile User Actions */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <span className="text-sm font-medium text-foreground">Policy Admin</span>
              </div>
              <Button variant="outline" size="sm" iconName="Download">
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;