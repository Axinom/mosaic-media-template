// REST API endpoints for Video Lineage
// This file maintains the same structure as GraphQL queries for easier migration

export const API_ENDPOINTS = {
  // Get video analysis data
  GET_VIDEO_ANALYSIS: (videoId: string) =>
    `/api/video-lineage/analysis/${videoId}`,
  // Update segment status
  UPDATE_SEGMENT_STATUS: (segmentId: string) =>
    `/api/video-lineage/segments/${segmentId}/status`,
  // Get network visualization data
  GET_NETWORK_DATA: (videoId: string) =>
    `/api/video-lineage/network/${videoId}`,
  // Get analysis status for polling
  GET_ANALYSIS_STATUS: (videoId: string) =>
    `/api/video-lineage/analysis/${videoId}/status`,
  // Trigger new analysis
  TRIGGER_ANALYSIS: () => `/api/video-lineage/analysis/trigger`,
} as const;

// Request/Response type definitions for API endpoints
export interface VideoAnalysisRequest {
  videoId: string;
}

export interface UpdateSegmentStatusRequest {
  segmentId: string;
  status: 'pending' | 'verified' | 'rejected' | 'flagged';
}

export interface UpdateSegmentStatusResponse {
  success: boolean;
  segmentId: string;
  status: string;
  timestamp: string;
}

export interface NetworkDataRequest {
  videoId: string;
}

export interface AnalysisStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface TriggerAnalysisRequest {
  videoId: string;
  options?: {
    forceReprocess?: boolean;
    analysisType?: 'full' | 'quick' | 'deep';
  };
}

export interface TriggerAnalysisResponse {
  success: boolean;
  analysisId: string;
  estimatedCompletionTime?: number; // in seconds
}

// API response wrapper type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}
