import { useCallback, useState } from 'react';
import { simulateApiDelay } from '../services/mockData';
import { VerificationActionHandler } from '../types';

export const useSegmentVerification = (): {
  updateSegmentStatus: VerificationActionHandler;
  flaggedSegments: Set<string>;
  isProcessing: (segmentId: string) => boolean;
  isFlagged: (segmentId: string) => boolean;
  resetFlags: () => void;
} => {
  const [flaggedSegments, setFlaggedSegments] = useState<Set<string>>(
    new Set(),
  );
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  // No need for GraphQL mutation setup

  const updateSegmentStatus: VerificationActionHandler = useCallback(
    async (segmentId: string, action: string) => {
      try {
        setProcessing((prev) => new Set([...prev, segmentId]));

        // Simulate API delay
        await simulateApiDelay(500);

        // Mock successful response - always succeed for demo
        const success = true;

        if (success) {
          // Update local flagged segments state
          if (action === 'flagged') {
            setFlaggedSegments((prev) => new Set([...prev, segmentId]));
          } else {
            setFlaggedSegments((prev) => {
              const newSet = new Set(prev);
              newSet.delete(segmentId);
              return newSet;
            });
          }
        } else {
          throw new Error('Failed to update segment status');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `Failed to update segment ${segmentId} status to ${action}:`,
          error,
        );
        throw error;
      } finally {
        setProcessing((prev) => {
          const newSet = new Set(prev);
          newSet.delete(segmentId);
          return newSet;
        });
      }
    },
    [],
  );

  const isProcessing = useCallback(
    (segmentId: string): boolean => processing.has(segmentId),
    [processing],
  );

  const isFlagged = useCallback(
    (segmentId: string): boolean => flaggedSegments.has(segmentId),
    [flaggedSegments],
  );

  const resetFlags = useCallback(() => {
    setFlaggedSegments(new Set());
  }, []);

  return {
    updateSegmentStatus,
    flaggedSegments,
    isProcessing,
    isFlagged,
    resetFlags,
  };
};
