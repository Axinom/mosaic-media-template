import React from 'react';
import { SourceMatch } from '../../types';
import { formatTime, getSegmentColor } from '../../utils';
import './SourceSummaryCard.module.scss';

interface SourceSummaryCardProps {
  match: SourceMatch;
  index: number;
  onClick: (match: SourceMatch) => void;
  isFlagged?: boolean;
  isProcessing?: boolean;
}

export const SourceSummaryCard: React.FC<SourceSummaryCardProps> = ({
  match,
  index,
  onClick,
  isFlagged = false,
  isProcessing = false,
}) => {
  const handleClick = () => {
    if (!isProcessing) {
      onClick(match);
    }
  };

  return (
    <div
      className={`source-summary-card ${isFlagged ? 'flagged' : ''} ${
        isProcessing ? 'processing' : ''
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="card-header">
        <div
          className="color-indicator"
          style={{
            backgroundColor: isFlagged ? '#DC2626' : getSegmentColor(index),
          }}
        ></div>
        <h4 className="source-title">{match.sourceVideo.title}</h4>
      </div>

      <div className="card-content">
        <div className="timing-info">
          <div className="timing-row">
            <span className="label">Used:</span>
            <span className="value">
              {formatTime(match.mainVideoSegment.startTime)} -{' '}
              {formatTime(match.mainVideoSegment.endTime)}
            </span>
          </div>
          <div className="timing-row">
            <span className="label">From:</span>
            <span className="value">
              {formatTime(match.sourceVideoSegment.startTime)} in source
            </span>
          </div>
          <div className="timing-row">
            <span className="label">Confidence:</span>
            <span className="value confidence">{match.confidence}%</span>
          </div>
        </div>

        {isFlagged && (
          <div className="flag-indicator">⚠ Flagged for review</div>
        )}

        {isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            Processing...
          </div>
        )}
      </div>
    </div>
  );
};
