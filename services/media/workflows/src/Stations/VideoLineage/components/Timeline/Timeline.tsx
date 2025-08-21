import React from 'react';
import { TimelineProps } from '../../types';
import { formatTime, getSegmentColor } from '../../utils';
import classes from './Timeline.module.scss';

export const Timeline: React.FC<TimelineProps> = ({
  video,
  sourceMatches,
  currentTime,
  onSegmentClick,
  flaggedSegments = new Set(),
}) => {
  return (
    <div className={classes.videoTimeline}>
      <div className={classes.timelineHeader}>
        <h4 className={classes.timelineTitle}>Source Detection Timeline</h4>
        <div className={classes.timelineTime}>
          {formatTime(currentTime)} / {formatTime(video.duration)}
        </div>
      </div>

      <div className={classes.timelineContainer}>
        <div className={classes.timelineTrack}>
          <div className={classes.timelineBackground}></div>

          {sourceMatches.map((match, index) => {
            const isFlagged = flaggedSegments.has(match.id);
            const segment = match.mainVideoSegment;
            const leftPercent = (segment.startTime / video.duration) * 100;
            const widthPercent =
              ((segment.endTime - segment.startTime) / video.duration) * 100;

            return (
              <div
                key={match.id}
                className={`${classes.timelineSegment} ${isFlagged ? classes.flagged : ''}`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  backgroundColor: isFlagged
                    ? '#DC2626'
                    : getSegmentColor(index),
                }}
                onClick={() => onSegmentClick(match)}
                title={`Click to verify: ${match.sourceVideo.title}`}
              >
                <div className={classes.segmentContent}>
                  <div className={classes.segmentTitle}>{match.sourceVideo.title}</div>
                </div>
              </div>
            );
          })}

          <div
            className={classes.timelinePlayhead}
            style={{ left: `${(currentTime / video.duration) * 100}%` }}
          >
            <div className={classes.playheadHandle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
