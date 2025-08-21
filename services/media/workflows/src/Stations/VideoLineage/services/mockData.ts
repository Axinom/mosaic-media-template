import { VideoAnalysis, NetworkData, VideoInfo, SourceMatch } from '../types';

// Mock video data
const mockMainVideo: VideoInfo = {
  id: 'main-video-001',
  title: 'Breaking News: Climate Summit 2024',
  duration: 180, // 3 minutes
  thumbnail: 'https://via.placeholder.com/320x180/1f2937/ffffff?text=Climate+Summit',
  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
};

const mockSourceVideos: VideoInfo[] = [
  {
    id: 'source-video-001',
    title: 'Reuters: UN Climate Conference Opening',
    duration: 240,
    thumbnail: 'https://via.placeholder.com/320x180/059669/ffffff?text=Reuters+Climate',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 'source-video-002', 
    title: 'AP News: World Leaders Arrive',
    duration: 156,
    thumbnail: 'https://via.placeholder.com/320x180/dc2626/ffffff?text=AP+News',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'source-video-003',
    title: 'BBC: Environmental Protesters March',
    duration: 198,
    thumbnail: 'https://via.placeholder.com/320x180/7c3aed/ffffff?text=BBC+Protesters',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'source-video-004',
    title: 'CNN: Climate Data Presentation',
    duration: 312,
    thumbnail: 'https://via.placeholder.com/320x180/ea580c/ffffff?text=CNN+Data',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
];

const mockSourceMatches: SourceMatch[] = [
  {
    id: 'match-001',
    sourceVideo: mockSourceVideos[0],
    mainVideoSegment: {
      startTime: 15,
      endTime: 45,
    },
    sourceVideoSegment: {
      startTime: 30,
      endTime: 60,
    },
    confidence: 94,
    frameMatches: 890,
    status: 'pending',
    metadata: {
      motionSimilarity: 0.92,
      colorMatching: 0.89,
      objectDetection: 0.96,
    },
  },
  {
    id: 'match-002',
    sourceVideo: mockSourceVideos[1],
    mainVideoSegment: {
      startTime: 52,
      endTime: 78,
    },
    sourceVideoSegment: {
      startTime: 10,
      endTime: 36,
    },
    confidence: 87,
    frameMatches: 624,
    status: 'verified',
    metadata: {
      motionSimilarity: 0.85,
      colorMatching: 0.91,
      objectDetection: 0.84,
    },
  },
  {
    id: 'match-003',
    sourceVideo: mockSourceVideos[2],
    mainVideoSegment: {
      startTime: 95,
      endTime: 125,
    },
    sourceVideoSegment: {
      startTime: 45,
      endTime: 75,
    },
    confidence: 91,
    frameMatches: 756,
    status: 'flagged',
    metadata: {
      motionSimilarity: 0.93,
      colorMatching: 0.88,
      objectDetection: 0.92,
    },
  },
  {
    id: 'match-004',
    sourceVideo: mockSourceVideos[3],
    mainVideoSegment: {
      startTime: 140,
      endTime: 165,
    },
    sourceVideoSegment: {
      startTime: 120,
      endTime: 145,
    },
    confidence: 82,
    frameMatches: 445,
    status: 'rejected',
    metadata: {
      motionSimilarity: 0.79,
      colorMatching: 0.84,
      objectDetection: 0.83,
    },
  },
  {
    id: 'match-005',
    sourceVideo: mockSourceVideos[0],
    mainVideoSegment: {
      startTime: 170,
      endTime: 180,
    },
    sourceVideoSegment: {
      startTime: 200,
      endTime: 210,
    },
    confidence: 76,
    frameMatches: 234,
    status: 'pending',
    metadata: {
      motionSimilarity: 0.74,
      colorMatching: 0.78,
      objectDetection: 0.76,
    },
  },
];

export const mockVideoAnalysis: VideoAnalysis = {
  video: mockMainVideo,
  sourceMatches: mockSourceMatches,
  analysisMetadata: {
    totalFramesAnalyzed: 5400, // 180 seconds * 30 fps
    processingTime: 42.3,
    confidence: {
      average: 86,
      high: 2, // matches with >90% confidence
      medium: 2, // matches with 75-90% confidence
      low: 1, // matches with <75% confidence
    },
  },
};

export const mockNetworkData: NetworkData = {
  nodes: [
    {
      id: 'main-video-001',
      title: 'Climate Summit 2024',
      x: 400,
      y: 300,
      type: 'main',
    },
    {
      id: 'source-video-001',
      title: 'Reuters Climate',
      x: 200,
      y: 150,
      type: 'source',
    },
    {
      id: 'source-video-002',
      title: 'AP News Leaders',
      x: 600,
      y: 150,
      type: 'source',
    },
    {
      id: 'source-video-003',
      title: 'BBC Protesters',
      x: 150,
      y: 450,
      type: 'source',
    },
    {
      id: 'source-video-004',
      title: 'CNN Data',
      x: 650,
      y: 450,
      type: 'source',
    },
  ],
  connections: [
    {
      from: 'source-video-001',
      to: 'main-video-001',
      strength: 0.94,
    },
    {
      from: 'source-video-002',
      to: 'main-video-001',
      strength: 0.87,
    },
    {
      from: 'source-video-003',
      to: 'main-video-001',
      strength: 0.91,
    },
    {
      from: 'source-video-004',
      to: 'main-video-001',
      strength: 0.82,
    },
  ],
};

// Helper function to simulate API delays for realistic development experience
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Function to generate additional mock data for testing
export const generateMockSourceMatch = (index: number): SourceMatch => {
  const sourceVideo: VideoInfo = {
    id: `generated-source-${index}`,
    title: `Generated Source Video ${index}`,
    duration: Math.floor(Math.random() * 300) + 60,
    thumbnail: `https://via.placeholder.com/320x180/4f46e5/ffffff?text=Source+${index}`,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  const startTime = Math.floor(Math.random() * 120);
  const duration = Math.floor(Math.random() * 30) + 10;

  return {
    id: `generated-match-${index}`,
    sourceVideo,
    mainVideoSegment: {
      startTime,
      endTime: startTime + duration,
    },
    sourceVideoSegment: {
      startTime: Math.floor(Math.random() * 100),
      endTime: Math.floor(Math.random() * 100) + duration,
    },
    confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
    frameMatches: Math.floor(Math.random() * 500) + 200,
    status: ['pending', 'verified', 'rejected', 'flagged'][Math.floor(Math.random() * 4)] as any,
    metadata: {
      motionSimilarity: Math.random() * 0.3 + 0.7, // 0.7-1.0
      colorMatching: Math.random() * 0.3 + 0.7,
      objectDetection: Math.random() * 0.3 + 0.7,
    },
  };
};