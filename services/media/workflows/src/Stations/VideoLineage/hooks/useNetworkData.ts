import { useCallback, useEffect, useState } from 'react';
import { mockNetworkData, simulateApiDelay } from '../services/mockData';
import { NetworkData, UseNetworkDataResult } from '../types';

export const useNetworkData = (
  videoId: string | null,
): UseNetworkDataResult => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkData = useCallback(async () => {
    if (!videoId) {
      setNetworkData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await simulateApiDelay(600);
      
      // Return mock data directly
      setNetworkData(mockNetworkData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load network data';
      setError(errorMessage);
      setNetworkData(null);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  // Load data when videoId changes
  useEffect(() => {
    fetchNetworkData();
  }, [fetchNetworkData]);

  return {
    networkData,
    loading,
    error,
  };
};
