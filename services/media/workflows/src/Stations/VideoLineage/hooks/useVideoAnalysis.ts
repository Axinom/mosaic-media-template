import { useCallback, useEffect, useState } from 'react';
import { mockVideoAnalysis, simulateApiDelay } from '../services/mockData';
import { UseVideoAnalysisResult, VideoAnalysis } from '../types';

export const useVideoAnalysis = (
  videoId: string | null,
): UseVideoAnalysisResult => {
  const [data, setData] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoAnalysis = useCallback(async () => {
    if (!videoId) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay for realistic experience
      await simulateApiDelay(800);
      
      // Return mock data directly
      setData(mockVideoAnalysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load video analysis';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  // Load data when videoId changes
  useEffect(() => {
    fetchVideoAnalysis();
  }, [fetchVideoAnalysis]);

  const refetch = useCallback(async () => {
    await fetchVideoAnalysis();
  }, [fetchVideoAnalysis]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
