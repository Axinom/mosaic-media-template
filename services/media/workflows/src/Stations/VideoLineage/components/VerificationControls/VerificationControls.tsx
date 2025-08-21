import {
  FastForward,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import React from 'react';
import { VerificationControlsProps } from '../../types';
import { formatTime } from '../../utils';
import classes from './VerificationControls.module.scss';

export const VerificationControls: React.FC<VerificationControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  onTimeUpdate,
  onPlayToggle,
  onSkipToStart,
  onSkipToEnd,
  onStepBackward,
  onStepForward,
}) => {
  const handleSeekChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    onTimeUpdate(parseFloat(event.target.value));
  };

  return (
    <div className={classes.verificationControls}>
      <div className={classes.controlsHeader}>
        <h4 className={classes.controlsTitle}>Synchronized Playback Controls</h4>
        <div className={classes.controlsDescription}>
          Both videos play the matching segments in sync
        </div>
      </div>

      <div className={classes.controlsButtons}>
        <button
          className={`${classes.controlButton} ${classes.secondary}`}
          onClick={onSkipToStart}
          title="Skip to start"
          type="button"
        >
          <SkipBack size={16} />
        </button>

        <button
          className={`${classes.controlButton} ${classes.secondary}`}
          onClick={onStepBackward}
          title="Step backward"
          type="button"
        >
          <Rewind size={16} />
        </button>

        <button
          className={`${classes.controlButton} ${classes.primary}`}
          onClick={onPlayToggle}
          title={isPlaying ? 'Pause' : 'Play'}
          type="button"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          className={`${classes.controlButton} ${classes.secondary}`}
          onClick={onStepForward}
          title="Step forward"
          type="button"
        >
          <FastForward size={16} />
        </button>

        <button
          className={`${classes.controlButton} ${classes.secondary}`}
          onClick={onSkipToEnd}
          title="Skip to end"
          type="button"
        >
          <SkipForward size={16} />
        </button>
      </div>

      <div className={classes.seekContainer}>
        <div className={classes.seekLabels}>
          <span className={classes.seekTime}>{formatTime(currentTime)}</span>
          <span className={classes.seekTime}>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeekChange}
          className={classes.seekSlider}
          step="0.1"
        />
      </div>
    </div>
  );
};
