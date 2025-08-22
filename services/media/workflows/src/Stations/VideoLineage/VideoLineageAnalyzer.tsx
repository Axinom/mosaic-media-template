import { EmptyStation, InfoPanel, Paragraph, Section } from '@axinom/mosaic-ui';
import { AlertTriangle, Clock, Network } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// Hooks and utilities
import { useSegmentVerification, useVideoAnalysis } from './hooks';
import { getActiveSegment, sortSourceMatchesByTime } from './utils';

// Components
import {
  DemoControls,
  SourceSummaryCard,
  Timeline,
  VerificationActions,
  VerificationControls,
  VideoPlayer,
} from './components';

// Types
import { SourceMatch } from './types';

// Styles
import classes from './VideoLineageAnalyzer.module.scss';

type ViewMode = 'timeline' | 'network';

interface VideoLineageAnalyzerProps {
  videoId?: string;
  onError?: (error: string) => void;
  onSegmentVerified?: (segmentId: string, action: string) => void;
}

export const VideoLineageAnalyzer: React.FC<VideoLineageAnalyzerProps> = ({
  videoId: propVideoId,
  onError,
  onSegmentVerified,
}) => {
  // Get video ID from props (for demo, we'll use a default if not provided)
  // NOTE: The hooks use mock data directly - no actual API calls are made
  const videoId = propVideoId || 'demo-video-001';

  // State management
  const [activeView, setActiveView] = useState<ViewMode>('timeline');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [verificationMode, setVerificationMode] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SourceMatch | null>(
    null,
  );
  const [verificationTime, setVerificationTime] = useState(0);

  // Custom hooks
  const {
    data: analysisData,
    loading,
    error,
    refetch,
  } = useVideoAnalysis(videoId);
  const { updateSegmentStatus, flaggedSegments, isProcessing, isFlagged } =
    useSegmentVerification();

  // Handle errors
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Memoized sorted source matches
  const sortedSourceMatches = useMemo(() => {
    return analysisData?.sourceMatches
      ? sortSourceMatchesByTime(analysisData.sourceMatches)
      : [];
  }, [analysisData?.sourceMatches]);

  // Event handlers
  const handleSegmentClick = useCallback((segment: SourceMatch) => {
    setSelectedSegment(segment);
    setVerificationMode(true);
    setVerificationTime(0);
    setIsPlaying(false);
  }, []);

  const exitVerification = useCallback(() => {
    setVerificationMode(false);
    setSelectedSegment(null);
    setVerificationTime(0);
    setIsPlaying(false);
  }, []);

  const handleVerifySegment = useCallback(
    async (action: string) => {
      if (!selectedSegment) {
        return;
      }

      try {
        // Note: await is intentional for mock delay simulation
        await updateSegmentStatus(selectedSegment.id, action);
        if (onSegmentVerified) {
          onSegmentVerified(selectedSegment.id, action);
        }
        exitVerification();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to verify segment:', err);
        // Could show toast notification here
      }
    },
    [selectedSegment, updateSegmentStatus, onSegmentVerified, exitVerification],
  );

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleVerificationTimeUpdate = useCallback((time: number) => {
    setVerificationTime(time);
  }, []);

  // Get currently active segment
  const activeSegment = useMemo(() => {
    return verificationMode
      ? null
      : getActiveSegment(currentTime, sortedSourceMatches);
  }, [verificationMode, currentTime, sortedSourceMatches]);

  // Loading state
  if (loading) {
    return (
      <div className={classes.videoLineageLoading}>
        <div className={classes.loadingSpinner}></div>
        <div className={classes.loadingText}>Analyzing video content...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={classes.videoLineageError}>
        <div className={classes.errorIcon}>
          <AlertTriangle size={48} />
        </div>
        <div className={classes.errorMessage}>
          <h3>Analysis Failed</h3>
          <p>{error}</p>
          <button onClick={refetch} className={classes.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!analysisData || !videoId) {
    return (
      <div className={classes.videoLineageEmpty}>
        <div className={classes.emptyMessage}>
          No video analysis data available
        </div>
      </div>
    );
  }

  const { video, sourceMatches, analysisMetadata } = analysisData;

  return (
    <EmptyStation
      title="Video Lineage Analyzer"
      subtitle={`${sourceMatches.length} Sources Detected`}
    >
      <div className={classes.main}>
        <div className={classes.videoLineageAnalyzer}>
          {/* Demo Controls */}
          <DemoControls onRefresh={refetch} isLoading={loading} />

          {/* Header */}
          <div className={classes.analyzerHeader}>
            {/* View Toggle - hide in verification mode */}
            {!verificationMode && (
              <div className={classes.viewToggle}>
                <button
                  onClick={() => setActiveView('timeline')}
                  className={`${classes.toggleButton} ${
                    activeView === 'timeline' ? classes.active : ''
                  }`}
                  type="button"
                >
                  <Clock size={16} />
                  Timeline View
                </button>
                <button
                  onClick={() => setActiveView('network')}
                  className={`${classes.toggleButton} ${
                    activeView === 'network' ? classes.active : ''
                  }`}
                  type="button"
                >
                  <Network size={16} />
                  Network View
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className={classes.analyzerContent}>
            <div className={classes.mainContent}>
              {verificationMode ? (
                /* Verification View */
                <div className={classes.verificationView}>
                  <div className={classes.verificationHeader}>
                    <div className={classes.verificationInfo}>
                      <h3>Verifying: {selectedSegment?.sourceVideo.title}</h3>
                      <p>Compare segments to verify match accuracy</p>
                    </div>
                    <button
                      onClick={exitVerification}
                      className={classes.backButton}
                      type="button"
                    >
                      ← Back to Overview
                    </button>
                  </div>

                  {/* Main Video */}
                  <div className={classes.videoSection}>
                    <h4>Main Video - Segment Being Verified</h4>
                    <VideoPlayer
                      video={video}
                      currentTime={
                        selectedSegment
                          ? selectedSegment.mainVideoSegment.startTime +
                            verificationTime
                          : 0
                      }
                      isPlaying={isPlaying}
                      onTimeUpdate={() => {
                        // TODO: Implement time update handler
                      }}
                      onPlayToggle={() => {
                        // TODO: Implement play toggle handler
                      }}
                      showControls={false}
                      className={classes.mainVideo}
                    />
                  </div>

                  {/* Source Video */}
                  <div className={classes.videoSection}>
                    <h4>Source Video - Detected Match</h4>
                    <VideoPlayer
                      video={selectedSegment?.sourceVideo || video}
                      currentTime={
                        selectedSegment
                          ? selectedSegment.sourceVideoSegment.startTime +
                            verificationTime
                          : 0
                      }
                      isPlaying={isPlaying}
                      onTimeUpdate={() => {
                        // TODO: Implement time update handler
                      }}
                      onPlayToggle={() => {
                        // TODO: Implement play toggle handler
                      }}
                      showControls={false}
                      className={classes.sourceVideo}
                    />
                  </div>

                  {/* Verification Controls */}
                  {selectedSegment && (
                    <VerificationControls
                      currentTime={verificationTime}
                      duration={
                        selectedSegment.mainVideoSegment.endTime -
                        selectedSegment.mainVideoSegment.startTime
                      }
                      isPlaying={isPlaying}
                      onTimeUpdate={handleVerificationTimeUpdate}
                      onPlayToggle={handlePlayToggle}
                      onSkipToStart={() => setVerificationTime(0)}
                      onSkipToEnd={() => {
                        const duration =
                          selectedSegment.mainVideoSegment.endTime -
                          selectedSegment.mainVideoSegment.startTime;
                        setVerificationTime(duration);
                      }}
                      onStepBackward={() =>
                        setVerificationTime(Math.max(0, verificationTime - 1))
                      }
                      onStepForward={() => {
                        const duration =
                          selectedSegment.mainVideoSegment.endTime -
                          selectedSegment.mainVideoSegment.startTime;
                        setVerificationTime(
                          Math.min(duration, verificationTime + 1),
                        );
                      }}
                    />
                  )}

                  {/* Verification Actions */}
                  <VerificationActions
                    onAccept={() => handleVerifySegment('verified')}
                    onReject={() => handleVerifySegment('rejected')}
                    onFlag={() => handleVerifySegment('flagged')}
                    onCancel={exitVerification}
                  />
                </div>
              ) : activeView === 'timeline' ? (
                /* Timeline View */
                <div className={classes.timelineView}>
                  <div className={classes.mainVideoSection}>
                    <VideoPlayer
                      video={video}
                      currentTime={currentTime}
                      isPlaying={isPlaying}
                      onTimeUpdate={handleTimeUpdate}
                      onPlayToggle={handlePlayToggle}
                    />

                    <Timeline
                      video={video}
                      sourceMatches={sortedSourceMatches}
                      currentTime={currentTime}
                      onSegmentClick={handleSegmentClick}
                      flaggedSegments={flaggedSegments}
                    />
                  </div>

                  {/* Source Summary Cards */}
                  <div className={classes.sourceSummaryGrid}>
                    {sortedSourceMatches.map((match, index) => (
                      <SourceSummaryCard
                        key={match.id}
                        match={match}
                        index={index}
                        onClick={handleSegmentClick}
                        isFlagged={isFlagged(match.id)}
                        isProcessing={isProcessing(match.id)}
                      />
                    ))}
                  </div>

                  {/* Active Segment Hint */}
                  {activeSegment && (
                    <div className={classes.activeSegmentHint}>
                      <div className={classes.hintContent}>
                        <strong>Currently viewing:</strong>{' '}
                        {activeSegment.sourceVideo.title}
                      </div>
                      <button
                        onClick={() => handleSegmentClick(activeSegment)}
                        className={classes.verifyButton}
                        type="button"
                      >
                        Verify Match
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Network View - Placeholder for now */
                <div className={classes.networkView}>
                  <div className={classes.networkPlaceholder}>
                    <Network size={64} />
                    <h3>Network View</h3>
                    <p>
                      Content relationship network visualization coming soon
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Sidebar - only show in overview mode */}
        {!verificationMode && (
          <InfoPanel>
            <Section title="Analysis Summary">
              <Paragraph title="Processing Time">
                {analysisMetadata.processingTime}s
              </Paragraph>
              <Paragraph title="Frames Analyzed">
                {analysisMetadata.totalFramesAnalyzed.toLocaleString()}
              </Paragraph>
              <Paragraph title="Average Confidence">
                {analysisMetadata.confidence.average}%
              </Paragraph>
            </Section>
            <Section title="Detection Details">
              <Paragraph title="High Confidence">
                {analysisMetadata.confidence.high} matches (≥90%)
              </Paragraph>
              <Paragraph title="Medium Confidence">
                {analysisMetadata.confidence.medium} matches (75-89%)
              </Paragraph>
              <Paragraph title="Low Confidence">
                {analysisMetadata.confidence.low} matches (&lt;75%)
              </Paragraph>
            </Section>
          </InfoPanel>
        )}
      </div>
    </EmptyStation>
  );
};
