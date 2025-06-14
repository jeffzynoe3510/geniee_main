import { useState, useRef, useCallback } from 'react';
import useUser from './useUser';
import {
  SkinAnalysisState,
  SkinAnalysisResult,
  SkinAnalysisSettings,
  SkinAnalysisRequest
} from '@/types/skin-analysis';

const DEFAULT_SETTINGS: SkinAnalysisSettings = {
  sensitivity: 'medium',
  analysisMode: 'basic',
  saveHistory: true,
  notifications: true
};

export function useSkinAnalysis() {
  const { data: user } = useUser();
  const [state, setState] = useState<SkinAnalysisState>({
    loading: false,
    error: null,
    currentImage: null,
    results: [],
    selectedResult: null,
    cameraStream: null,
    isAnalyzing: false
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera
  const startCamera = useCallback(async () => {
    setState(prev => ({ ...prev, error: null }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          facingMode: 'user'
        }
      });
      setState(prev => ({ ...prev, cameraStream: stream }));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        error: 'Camera access failed. Please check your camera permissions.'
      }));
    }
  }, []);

  // Capture image for analysis
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    return canvas.toDataURL('image/jpeg');
  }, []);

  // Analyze skin
  const analyzeSkin = useCallback(async (settings: SkinAnalysisSettings = DEFAULT_SETTINGS) => {
    if (!user) {
      setState(prev => ({
        ...prev,
        error: 'Please sign in to use skin analysis'
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null, isAnalyzing: true }));

    try {
      const imageData = captureImage();
      if (!imageData) {
        throw new Error('Failed to capture image');
      }

      const request: SkinAnalysisRequest = {
        imageData,
        settings,
        userId: user.id
      };

      const response = await fetch('/api/skin-analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result: SkinAnalysisResult = await response.json();
      
      setState(prev => ({
        ...prev,
        currentImage: imageData,
        results: [result, ...prev.results],
        selectedResult: result,
        isAnalyzing: false
      }));
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Analysis failed',
        isAnalyzing: false
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, captureImage]);

  // Load analysis history
  const loadHistory = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/skin-analysis/history?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load history');

      const results: SkinAnalysisResult[] = await response.json();
      setState(prev => ({ ...prev, results }));
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        error: 'Failed to load analysis history'
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
    }
  }, [state.cameraStream]);

  return {
    state,
    setState,
    videoRef,
    canvasRef,
    startCamera,
    analyzeSkin,
    loadHistory,
    cleanup
  };
} 