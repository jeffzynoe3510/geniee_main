export interface SkinCondition {
  type: 'acne' | 'wrinkles' | 'darkSpots' | 'dryness' | 'oiliness' | 'redness';
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number; // 0-1
  location?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SkinAnalysisResult {
  id: string;
  timestamp: string;
  conditions: SkinCondition[];
  overallHealth: number; // 0-100
  recommendations: string[];
  imageUrl: string;
}

export interface SkinAnalysisState {
  loading: boolean;
  error: string | null;
  currentImage: string | null;
  results: SkinAnalysisResult[];
  selectedResult: SkinAnalysisResult | null;
  cameraStream: MediaStream | null;
  isAnalyzing: boolean;
}

export interface SkinAnalysisSettings {
  sensitivity: 'low' | 'medium' | 'high';
  analysisMode: 'basic' | 'detailed';
  saveHistory: boolean;
  notifications: boolean;
}

export interface SkinAnalysisRequest {
  imageData: string; // base64 encoded image
  settings: SkinAnalysisSettings;
  userId: string;
}

export interface SkinAnalysisResponse {
  success: boolean;
  result?: SkinAnalysisResult;
  error?: string;
} 