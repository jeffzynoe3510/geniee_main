import { useState, useEffect, useRef, useCallback } from 'react';
import useUser from './useUser';
import { 
  TryOnState, 
  ClothingItem, 
  MirrorSettings, 
  OverlayData,
  MirrorDimensions 
} from '@/types/virtual-try-on';

const DEFAULT_MIRROR_DIMENSIONS: MirrorDimensions = {
  width: 392.7,
  height: 698.1
};

export function useVirtualTryOn() {
  const { data: user } = useUser();
  const [state, setState] = useState<TryOnState>({
    activeTab: 'mirror',
    cameraStream: null,
    selectedItem: null,
    searchQuery: '',
    searchResults: [],
    error: null,
    loading: false,
    mirrorCalibrated: false,
    calibrationStep: 0,
    bodyTrackingPoints: null
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize mirror display
  useEffect(() => {
    const initializeMirror = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        if (data.mirror_settings?.calibration) {
          setState(prev => ({ ...prev, mirrorCalibrated: true }));
        }
      } catch (err) {
        console.error("Error loading mirror settings:", err);
        setState(prev => ({ 
          ...prev, 
          error: "Could not load your mirror settings. Please try again." 
        }));
      }
    };

    initializeMirror();
  }, [user]);

  // Start camera
  const startCamera = useCallback(async () => {
    setState(prev => ({ ...prev, error: null }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: DEFAULT_MIRROR_DIMENSIONS.width,
          height: DEFAULT_MIRROR_DIMENSIONS.height,
          facingMode: "user",
        },
      });
      setState(prev => ({ ...prev, cameraStream: stream }));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        error: "Camera access failed. Please check your camera permissions and ensure no other app is using the camera." 
      }));
    }
  }, []);

  // Search clothing
  const searchClothing = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(
        `/api/clothing/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setState(prev => ({ 
        ...prev, 
        searchResults: data.items || [],
        searchQuery: query
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: "Could not find clothing items. Please try a different search." 
      }));
      console.error(err);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Handle clothing selection
  const handleClothingSelect = useCallback(async (item: ClothingItem) => {
    setState(prev => ({ ...prev, error: null, loading: true }));
    try {
      if (!state.mirrorCalibrated) {
        throw new Error("Please complete the mirror calibration first");
      }

      setState(prev => ({ ...prev, selectedItem: item }));

      const response = await fetch("/api/virtual-try-on/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          mirrorDimensions: DEFAULT_MIRROR_DIMENSIONS,
          userMeasurements: user?.measurements || undefined
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze clothing position");
      }

      const overlayData: OverlayData = await response.json();
      applyClothingOverlay(overlayData);
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error && err.message.includes("calibration")
          ? "Please complete the mirror calibration before trying on clothes"
          : "Could not position the clothing correctly. Please try standing straight and ensure good lighting."
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.mirrorCalibrated, user?.measurements]);

  // Apply clothing overlay
  const applyClothingOverlay = useCallback((overlayData: OverlayData) => {
    if (!canvasRef.current || !videoRef.current || !state.selectedItem) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = state.selectedItem.imageUrl;
    img.onload = () => {
      const { position, anchors } = overlayData;
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(position.rotation);
      ctx.scale(position.scale, position.scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
  }, [state.selectedItem]);

  // Cleanup
  useEffect(() => {
    startCamera();
    return () => {
      if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  return {
    state,
    setState,
    videoRef,
    canvasRef,
    startCamera,
    searchClothing,
    handleClothingSelect,
    applyClothingOverlay
  };
} 