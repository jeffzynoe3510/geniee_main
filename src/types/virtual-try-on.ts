export interface MirrorDimensions {
  width: number;
  height: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  imageUrl: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear';
  brand?: string;
  price?: number;
  size?: string;
  color?: string;
}

export interface OverlayPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface AnchorPoint {
  point: string;
  offset: {
    x: number;
    y: number;
  };
}

export interface OverlayData {
  position: OverlayPosition;
  anchors: AnchorPoint[];
}

export interface CalibrationStep {
  instruction: string;
  icon: string;
  validation: () => boolean;
}

export interface BodyTrackingPoints {
  shoulders: { x: number; y: number }[];
  hips: { x: number; y: number }[];
  knees: { x: number; y: number }[];
}

export interface MirrorSettings {
  calibration: boolean;
  lastCalibrated?: string;
  userHeight?: number;
  userWidth?: number;
  preferredLighting?: 'natural' | 'warm' | 'cool';
}

export interface TryOnState {
  activeTab: 'mirror' | 'search' | 'history';
  cameraStream: MediaStream | null;
  selectedItem: ClothingItem | null;
  searchQuery: string;
  searchResults: ClothingItem[];
  error: string | null;
  loading: boolean;
  mirrorCalibrated: boolean;
  calibrationStep: number;
  bodyTrackingPoints: BodyTrackingPoints | null;
} 