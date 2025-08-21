import { VideoAnalysis, NetworkData } from '../types';
import { mockVideoAnalysis, mockNetworkData } from './mockData';

// NOTE: This API service is currently unused - the hooks return mock data directly
// This is kept for future backend integration when the API is ready
// Configuration for API endpoints
const API_BASE_URL = process.env.REACT_APP_VIDEO_LINEAGE_API_URL || '/api/video-lineage';

class VideoLineageApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // For development, fall back to mock data when API is not available
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('API not available, using mock data:', error);
        return this.getMockData<T>(endpoint);
      }
      throw error;
    }
  }

  private getMockData<T>(endpoint: string): T {
    if (endpoint.includes('/analysis/')) {
      return mockVideoAnalysis as T;
    }
    if (endpoint.includes('/network/')) {
      return mockNetworkData as T;
    }
    throw new Error(`No mock data available for endpoint: ${endpoint}`);
  }

  // Get video analysis data
  async getVideoAnalysis(videoId: string): Promise<VideoAnalysis> {
    return this.fetchApi<VideoAnalysis>(`/analysis/${videoId}`);
  }

  // Update segment verification status
  async updateSegmentStatus(
    segmentId: string,
    status: 'pending' | 'verified' | 'rejected' | 'flagged',
  ): Promise<{ success: boolean; segmentId: string; status: string }> {
    return this.fetchApi(`/segments/${segmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Get network visualization data
  async getNetworkData(videoId: string): Promise<NetworkData> {
    return this.fetchApi<NetworkData>(`/network/${videoId}`);
  }

  // Get analysis status (for polling)
  async getAnalysisStatus(videoId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
  }> {
    return this.fetchApi(`/analysis/${videoId}/status`);
  }

  // Trigger new analysis
  async triggerAnalysis(videoId: string): Promise<{ success: boolean; analysisId: string }> {
    return this.fetchApi(`/analysis/trigger`, {
      method: 'POST',
      body: JSON.stringify({ videoId }),
    });
  }
}

export const videoLineageApi = new VideoLineageApiService();