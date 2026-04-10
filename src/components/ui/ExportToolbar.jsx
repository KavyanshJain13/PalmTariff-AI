import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const ExportToolbar = ({ simulationData = null, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const location = useLocation();

  const getExportConfig = () => {
    const configs = {
      '/overview-dashboard': {
        title: 'Market Overview Report',
        formats: ['PDF', 'Excel', 'PowerPoint'],
        defaultFormat: 'PDF'
      },
      '/tariff-simulation-builder': {
        title: 'Tariff Simulation Results',
        formats: ['PDF', 'Excel', 'CSV'],
        defaultFormat: 'Excel'
      },
      '/scenario-comparison': {
        title: 'Scenario Comparison Analysis',
        formats: ['PDF', 'Excel', 'PowerPoint'],
        defaultFormat: 'PDF'
      },
      '/stakeholder-impact-analysis': {
        title: 'Stakeholder Impact Assessment',
        formats: ['PDF', 'Excel', 'Word'],
        defaultFormat: 'PDF'
      },
      '/nmeo-op-progress-tracker': {
        title: 'NMEO-OP Progress Report',
        formats: ['PDF', 'Excel'],
        defaultFormat: 'Excel'
      }
    };
    
    return configs?.[location?.pathname] || {
      title: 'Policy Analysis Report',
      formats: ['PDF'],
      defaultFormat: 'PDF'
    };
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportMenuOpen(false);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const config = getExportConfig();
      const timestamp = new Date()?.toISOString()?.slice(0, 19)?.replace(/:/g, '-');
      const filename = `${config?.title?.replace(/\s+/g, '_')}_${timestamp}.${format?.toLowerCase()}`;
      
      // In a real implementation, this would trigger the actual export
      console.log(`Exporting ${filename} with data:`, simulationData);
      
      // Show success feedback
      // This could be replaced with a toast notification
      alert(`${config?.title} exported successfully as ${format}`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const config = getExportConfig();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Quick Export Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport(config?.defaultFormat)}
        disabled={isExporting}
        loading={isExporting}
        iconName="Download"
        iconPosition="left"
        className="hidden sm:flex"
      >
        Export {config?.defaultFormat}
      </Button>
      {/* Export Menu */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExportMenuOpen(!exportMenuOpen)}
          disabled={isExporting}
          iconName="ChevronDown"
          iconPosition="right"
          className="sm:hidden"
        >
          Export
        </Button>

        {/* Desktop Export Menu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExportMenuOpen(!exportMenuOpen)}
          disabled={isExporting}
          iconName="MoreVertical"
          className="hidden sm:flex"
        />

        {exportMenuOpen && (
          <>
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-elevation-2 py-1 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Export Formats
                </p>
              </div>
              
              {config?.formats?.map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  disabled={isExporting}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 disabled:opacity-50"
                >
                  <Icon 
                    name={
                      format === 'PDF' ? 'FileText' :
                      format === 'Excel' ? 'Sheet' :
                      format === 'CSV' ? 'Database' :
                      format === 'PowerPoint' ? 'Presentation' :
                      format === 'Word' ? 'FileText' : 'File'
                    } 
                    size={16} 
                  />
                  <span>{format}</span>
                  {format === config?.defaultFormat && (
                    <span className="ml-auto text-xs text-primary">Default</span>
                  )}
                </button>
              ))}
              
              <div className="px-3 py-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Includes MEITY compliance headers
                </p>
              </div>
            </div>
            
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setExportMenuOpen(false)}
            />
          </>
        )}
      </div>
      {/* Export Status Indicator */}
      {isExporting && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="hidden sm:inline">Generating report...</span>
        </div>
      )}
    </div>
  );
};

export default ExportToolbar;