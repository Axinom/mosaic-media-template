// Video Lineage Domain Types

export interface VideoSegment {
  startTime: number;
  endTime: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  duration: number;
  thumbnail?: string;
  url: string;
}

export interface SegmentMetadata {
  motionSimilarity: number;
  colorMatching: number;
  objectDetection: number;
}

export interface SourceMatch {
  id: string;
  sourceVideo: VideoInfo;
  mainVideoSegment: VideoSegment;
  sourceVideoSegment: VideoSegment;
  confidence: number;
  frameMatches: number;
  status: 'pending' | 'verified' | 'rejected' | 'flagged';
  metadata: SegmentMetadata;
}

export interface VideoAnalysis {
  video: VideoInfo;
  sourceMatches: SourceMatch[];
  analysisMetadata: {
    totalFramesAnalyzed: number;
    processingTime: number;
    confidence: {
      average: number;
      high: number;
      medium: number;
      low: number;
    };
  };
}

export interface NetworkNode {
  id: string;
  title: string;
  x: number;
  y: number;
  type: 'main' | 'source' | 'derivative';
}

export interface NetworkConnection {
  from: string;
  to: string;
  strength: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
}

// Component Props Types
export interface VideoPlayerProps {
  video: VideoInfo;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onPlayToggle: () => void;
  className?: string;
  showControls?: boolean;
  overlayContent?: React.ReactNode;
}

export interface TimelineProps {
  video: VideoInfo;
  sourceMatches: SourceMatch[];
  currentTime: number;
  onSegmentClick: (match: SourceMatch) => void;
  flaggedSegments?: Set<string>;
}

export interface VerificationControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onPlayToggle: () => void;
  onSkipToStart: () => void;
  onSkipToEnd: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
}

export interface VerificationActionsProps {
  onAccept: () => void;
  onReject: () => void;
  onFlag: () => void;
  onCancel: () => void;
}

// API Response Types
export interface VideoAnalysisResponse {
  videoAnalysis: VideoAnalysis;
}

export interface UpdateSegmentStatusResponse {
  updateSegmentStatus: {
    success: boolean;
    segmentId: string;
    status: string;
  };
}

export interface NetworkDataResponse {
  networkData: NetworkData;
}

// Hook Types
export interface UseVideoAnalysisResult {
  data: VideoAnalysis | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseNetworkDataResult {
  networkData: NetworkData | null;
  loading: boolean;
  error: string | null;
}

// Event Handler Types
export type SegmentClickHandler = (segment: SourceMatch) => void;
export type VerificationActionHandler = (
  segmentId: string,
  action: string,
) => void;
export type TimeUpdateHandler = (time: number) => void;
export type PlayToggleHandler = () => void;
