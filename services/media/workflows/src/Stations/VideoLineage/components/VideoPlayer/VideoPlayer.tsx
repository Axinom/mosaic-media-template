import { Pause, Play } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { VideoPlayerProps } from '../../types';
import { formatTime } from '../../utils';
import classes from './VideoPlayer.module.scss';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onPlayToggle,
  className = '',
  showControls = true,
  overlayContent = null,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekBarRef = useRef<HTMLInputElement>(null);

  // Update video player time when currentTime prop changes
  useEffect(() => {
    if (
      videoRef.current &&
      Math.abs(videoRef.current.currentTime - currentTime) > 0.5
    ) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Handle play/pause state synchronization
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to play video:', error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleVideoTimeUpdate = (): void => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleSeekChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const newTime = parseInt(event.target.value, 10);
    onTimeUpdate(newTime);
  };

  const handleVideoClick = (): void => {
    onPlayToggle();
  };

  return (
    <div className={`${classes.videoPlayer} ${className}`}>
      <div className={classes.videoContainer}>
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          onTimeUpdate={handleVideoTimeUpdate}
          onClick={handleVideoClick}
          className={classes.videoElement}
          preload="metadata"
        />

        {/* Overlay content */}
        {overlayContent && (
          <div className={classes.videoOverlay}>{overlayContent}</div>
        )}

        {/* Play indicator */}
        {isPlaying && (
          <div className={classes.playIndicator}>
            <div className={classes.indicatorDot}></div>
            PLAYING
          </div>
        )}

        {/* Time display */}
        <div className={classes.timeDisplay}>
          {formatTime(currentTime)} / {formatTime(video.duration)}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className={classes.videoControls}>
          <div className={classes.controlRow}>
            <button
              className={classes.playButton}
              onClick={onPlayToggle}
              type="button"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <div className={classes.seekContainer}>
              <input
                ref={seekBarRef}
                type="range"
                min="0"
                max={video.duration}
                value={currentTime}
                onChange={handleSeekChange}
                className={classes.seekBar}
                step="0.1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
