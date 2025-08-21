import { SourceMatch, VideoInfo } from './types';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getSegmentColor = (index: number): string => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return colors[index % colors.length];
};

export const getActiveSegment = (
  time: number,
  sourceMatches: SourceMatch[],
): SourceMatch | null => {
  return (
    sourceMatches.find(
      (match) =>
        time >= match.mainVideoSegment.startTime &&
        time <= match.mainVideoSegment.endTime,
    ) || null
  );
};

export const calculateSegmentDuration = (match: SourceMatch): number => {
  return match.mainVideoSegment.endTime - match.mainVideoSegment.startTime;
};

export const getSegmentProgress = (
  currentTime: number,
  match: SourceMatch,
): number => {
  const duration = calculateSegmentDuration(match);
  const progress = (currentTime - match.mainVideoSegment.startTime) / duration;
  return Math.max(0, Math.min(1, progress));
};

export const getConfidenceLevel = (
  confidence: number,
): 'high' | 'medium' | 'low' => {
  if (confidence >= 90) {
    return 'high';
  }
  if (confidence >= 75) {
    return 'medium';
  }
  return 'low';
};

export const getConfidenceColor = (confidence: number): string => {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high':
      return '#10B981'; // green
    case 'medium':
      return '#F59E0B'; // yellow
    case 'low':
      return '#EF4444'; // red
  }
};

export const generateThumbnailPlaceholder = (
  title: string,
  width = 320,
  height = 180,
  bgColor = '#112720',
  textColor = '#9CA3AF',
): string => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="${width / 2}" y="${
    height / 2
  }" fill="${textColor}" text-anchor="middle" dy="0.3em" font-family="system-ui" font-size="14">${title}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const validateVideoData = (video: VideoInfo): boolean => {
  return !!(video.id && video.title && video.duration > 0 && video.url);
};

export const validateSourceMatch = (match: SourceMatch): boolean => {
  return !!(
    match.id &&
    match.sourceVideo &&
    validateVideoData(match.sourceVideo) &&
    match.mainVideoSegment.startTime >= 0 &&
    match.mainVideoSegment.endTime > match.mainVideoSegment.startTime &&
    match.sourceVideoSegment.startTime >= 0 &&
    match.sourceVideoSegment.endTime > match.sourceVideoSegment.startTime &&
    match.confidence >= 0 &&
    match.confidence <= 100
  );
};

export const sortSourceMatchesByTime = (
  matches: SourceMatch[],
): SourceMatch[] => {
  return [...matches].sort(
    (a, b) => a.mainVideoSegment.startTime - b.mainVideoSegment.startTime,
  );
};

export const filterMatchesByConfidence = (
  matches: SourceMatch[],
  minConfidence: number,
): SourceMatch[] => {
  return matches.filter((match) => match.confidence >= minConfidence);
};

export const groupMatchesByStatus = (
  matches: SourceMatch[],
): Record<string, SourceMatch[]> => {
  return matches.reduce((groups, match) => {
    const status = match.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(match);
    return groups;
  }, {} as Record<string, SourceMatch[]>);
};
