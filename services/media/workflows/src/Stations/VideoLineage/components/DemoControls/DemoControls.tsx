import { MessageBar } from '@axinom/mosaic-ui';
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
    <MessageBar
      title={
        isLoading
          ? 'Loading...'
          : `DEMO MODE. Using mock data only - No API calls made`
      }
      type="info"
      onRetry={onRefresh}
    />
  );
};
