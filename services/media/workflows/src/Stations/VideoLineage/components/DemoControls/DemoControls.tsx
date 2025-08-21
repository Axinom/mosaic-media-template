import { RefreshCw } from 'lucide-react';
import React from 'react';
import './DemoControls.module.scss';

interface DemoControlsProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="demo-controls">
      <div className="demo-badge">
        <span className="demo-label">DEMO MODE</span>
        <span className="demo-description">
          Using mock data only - No API calls made
        </span>
      </div>
      
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="demo-refresh-btn"
        title="Refresh analysis data"
      >
        <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
        {isLoading ? 'Loading...' : 'Refresh Data'}
      </button>
    </div>
  );
};