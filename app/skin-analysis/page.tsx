"use client";
import React, { useState, useRef, useEffect } from "react";
import { useHandleStreamResponse } from "../../utilities/runtime-helpers";
import useUser from "@/hooks/useUser";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface CalibrationStep {
  instruction: string;
  icon: string;
}

interface AnalysisResult {
  skinType: string;
  concerns: string;
  treatments: string;
  products: string;
  lifestyle: string;
  timestamp?: Date;
  image?: string;
}

interface StreamResponse {
  onChunk: (chunk: string) => void;
  onFinish: (message: string) => void;
}

interface FavoriteItem {
  id: string;
  name: string;
  type: 'treatment' | 'product';
  category: string;
  description?: string;
}

interface SkinProgress {
  id: string;
  date: Date;
  concerns: string[];
  improvements: string[];
  notes: string;
  image?: string;
}

interface ComparisonResult {
  changes: {
    type: 'improvement' | 'worsening' | 'new' | 'resolved';
    description: string;
  }[];
  recommendations: string[];
}

function SkinAnalysisContent() {
  const { data: user } = useUser();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [mirrorCalibrated, setMirrorCalibrated] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<AnalysisResult | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [newFavorite, setNewFavorite] = useState('');
  const [favoriteType, setFavoriteType] = useState<'treatment' | 'product'>('treatment');
  const [favoriteCategory, setFavoriteCategory] = useState('general');
  const [skinProgress, setSkinProgress] = useState<SkinProgress[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [newProgress, setNewProgress] = useState({
    concerns: [] as string[],
    improvements: [] as string[],
    notes: ''
  });
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: (chunk: string) => {
      setStreamingMessage((prev) => prev + chunk);
    },
    onFinish: (message: string) => {
      try {
        const result = JSON.parse(message) as AnalysisResult;
        result.timestamp = new Date();
        result.image = canvasRef.current?.toDataURL('image/jpeg') || undefined;
        setAnalysis(result);
        setAnalysisHistory((prev) => [...prev, result]);
      } catch (err: unknown) {
        console.error("Error parsing analysis result:", err);
        setError("Failed to process analysis results. Please try again.");
      }
      setStreamingMessage("");
      setAnalyzing(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to analyze skin. Please try again.");
      setAnalyzing(false);
    },
  } as StreamResponse);

  // Calibration steps
  const calibrationSteps: CalibrationStep[] = [
    {
      instruction: "Please stand 2-3 feet away from the mirror",
      icon: "fa-arrows-alt-h",
    },
    {
      instruction: "Position your face in the center",
      icon: "fa-smile",
    },
    {
      instruction: "Stay still while we calibrate",
      icon: "fa-check-circle",
    },
  ];

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      console.log("Camera access granted:", stream.getVideoTracks()[0].label);
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Video element source set");

        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              console.log("Video metadata loaded");
              resolve(true);
            };
          }
        });
      } else {
        throw new Error("Video element not found");
      }

      // Auto start calibration
      setMirrorCalibrated(false);
      setCalibrationStep(0);
    } catch (err) {
      console.error("Camera access error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          throw new Error(
            "Camera access denied. Please allow camera access and refresh the page."
          );
        } else if (err.name === "NotFoundError") {
          throw new Error(
            "No camera found. Please make sure your camera is connected and not in use by another application."
          );
        } else {
          throw new Error(
            "Unable to access camera: " + (err.message || "Unknown error")
          );
        }
      }
    }
  };

  const handleCalibration = async () => {
    if (calibrationStep < calibrationSteps.length - 1) {
      setCalibrationStep((prev) => prev + 1);
    } else {
      setLoading(true);
      try {
        // Simulate calibration process
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMirrorCalibrated(true);
        setCalibrationStep(0);
      } catch (err) {
        setError("Calibration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const analyzeSkin = async () => {
    setAnalyzing(true);
    setError(null);
    setStreamingMessage("");

    try {
      // First check if camera is available
      if (!cameraStream) {
        throw new Error(
          "Camera not available. Please refresh the page and allow camera access."
        );
      }

      // Capture image and send for analysis
      const imageData = await captureImage();
      if (!imageData) {
        throw new Error(
          "Could not capture image. Please make sure your camera is working."
        );
      }

      // Send image for analysis
      const response = await fetch("/api/skin-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze skin. Please try again.");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to start analysis stream.");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        handleStreamResponse(chunk);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setAnalyzing(false);
    }
  };

  const captureImage = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref is null");
      return null;
    }

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Make sure video is playing and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error("Video dimensions are 0, video might not be ready");
        throw new Error(
          "Camera not ready. Please wait a moment and try again."
        );
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL("image/jpeg");
    } catch (err) {
      console.error("Error in captureImage:", err);
      throw new Error(
        "Could not capture image from camera. Please check camera permissions and try again."
      );
    }
  };

  const addFavorite = () => {
    if (newFavorite.trim()) {
      const favorite: FavoriteItem = {
        id: Date.now().toString(),
        name: newFavorite.trim(),
        type: favoriteType,
        category: favoriteCategory,
      };
      setFavorites(prev => [...prev, favorite]);
      setNewFavorite('');
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (favorites.some(fav => fav.id === item.id)) {
      removeFavorite(item.id);
    } else {
      setFavorites(prev => [...prev, item]);
    }
  };

  const addProgress = () => {
    if (newProgress.concerns.length > 0 || newProgress.improvements.length > 0 || newProgress.notes.trim()) {
      const progress: SkinProgress = {
        id: Date.now().toString(),
        date: new Date(),
        ...newProgress,
        image: canvasRef.current?.toDataURL('image/jpeg')
      };
      setSkinProgress(prev => [...prev, progress]);
      setNewProgress({
        concerns: [],
        improvements: [],
        notes: ''
      });
    }
  };

  const compareAnalyses = (current: AnalysisResult, previous: AnalysisResult) => {
    if (!current || !previous) return;
    
    const changes: ComparisonResult['changes'] = [];
    const recommendations: string[] = [];

    // Compare skin type
    if (current.skinType !== previous.skinType) {
      changes.push({
        type: 'new',
        description: `Skin type changed from ${previous.skinType} to ${current.skinType}`
      });
    }

    // Compare concerns
    const currentConcerns = current.concerns.split(',').map(c => c.trim());
    const previousConcerns = previous.concerns.split(',').map(c => c.trim());
    
    // Find new concerns
    currentConcerns.forEach(concern => {
      if (!previousConcerns.includes(concern)) {
        changes.push({
          type: 'new',
          description: `New concern: ${concern}`
        });
      }
    });

    // Find resolved concerns
    previousConcerns.forEach(concern => {
      if (!currentConcerns.includes(concern)) {
        changes.push({
          type: 'resolved',
          description: `Resolved concern: ${concern}`
        });
      }
    });

    // Compare treatments and products
    const currentTreatments = current.treatments.split(',').map(t => t.trim());
    const previousTreatments = previous.treatments.split(',').map(t => t.trim());
    
    // Find new treatments
    currentTreatments.forEach(treatment => {
      if (!previousTreatments.includes(treatment)) {
        changes.push({
          type: 'improvement',
          description: `New treatment: ${treatment}`
        });
      }
    });

    // Generate recommendations based on changes
    if (changes.some(c => c.type === 'new')) {
      recommendations.push('Consider consulting with a dermatologist about new concerns');
    }
    if (changes.some(c => c.type === 'resolved')) {
      recommendations.push('Continue current treatment routine as it\'s showing positive results');
    }
    if (changes.some(c => c.type === 'worsening')) {
      recommendations.push('Review current products and treatments for potential irritants');
    }

    setComparisonResult({ changes, recommendations });
  };

  // Initialize camera on mount
  useEffect(() => {
    startCamera().catch((err) => {
      if (err instanceof Error) {
        setError(err.message);
      }
    });

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-[#333]">
        <a
          href="/"
          className="flex items-center text-white hover:text-[#357AFF] transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          <span>Back to Home</span>
        </a>
        <h1 className="text-xl font-semibold text-white">Skin Analysis</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowProgress(!showProgress)}
            className="text-white hover:text-[#357AFF] transition-colors"
          >
            <i className="fas fa-chart-line text-xl"></i>
          </button>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="text-white hover:text-[#357AFF] transition-colors"
          >
            <i className="fas fa-heart text-xl"></i>
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-white hover:text-[#357AFF] transition-colors"
          >
            <i className="fas fa-history text-xl"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Camera View */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Error Display */}
        {error && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <ErrorMessage
              message={error}
              onRetry={() => {
                setError(null);
                if (!cameraStream) {
                  startCamera();
                } else if (analyzing) {
                  analyzeSkin();
                }
              }}
              variant="danger"
              className="max-w-md"
            />
          </div>
        )}

        {/* Calibration Overlay */}
        {!mirrorCalibrated && !error && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center p-8 rounded-xl bg-[#1a1a1a] border border-[#333] shadow-xl max-w-md">
              <i
                className={`fas ${calibrationSteps[calibrationStep].icon} text-5xl mb-6 text-[#357AFF]`}
              ></i>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Mirror Calibration
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                {calibrationSteps[calibrationStep].instruction}
              </p>
              <button
                onClick={handleCalibration}
                className="px-8 py-3 bg-[#357AFF] rounded-lg hover:bg-[#2563EB] transition-colors text-white font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    Calibrating...
                  </div>
                ) : calibrationStep === calibrationSteps.length - 1 ? (
                  "Complete Calibration"
                ) : (
                  "Next Step"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Analysis Controls */}
        {mirrorCalibrated && !analyzing && !analysis && !error && (
          <div className="absolute top-4 right-4 bg-[#1a1a1a] p-6 rounded-xl border border-[#333] shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Skin Analysis
            </h2>
            <button
              onClick={analyzeSkin}
              className="w-full bg-[#357AFF] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={analyzing}
            >
              Start Analysis
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {(analyzing || analysis) && !error && (
          <div className="absolute left-4 top-4 bg-[#1a1a1a] p-6 rounded-xl border border-[#333] shadow-lg max-w-md">
            <h3 className="font-semibold mb-4 text-white text-xl">
              {analyzing ? "Analyzing your skin..." : "Analysis Results"}
            </h3>
            {analyzing ? (
              <div className="flex items-center text-white">
                <LoadingSpinner size="md" color="primary" className="mr-3" />
                <p>{streamingMessage || "Processing..."}</p>
              </div>
            ) : (
              <div className="space-y-4 text-white">
                {analysis && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-[#357AFF]">Skin Type</h4>
                      <p>{analysis.skinType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#357AFF]">Concerns</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.concerns.split(',').map((concern, index) => (
                          <span key={index} className="px-2 py-1 bg-[#FF3B30] text-white text-xs rounded-full">
                            {concern.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#357AFF]">Treatments</h4>
                      <div className="space-y-2 mt-1">
                        {analysis.treatments.split(',').map((treatment, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#2a2a2a] p-2 rounded">
                            <span>{treatment.trim()}</span>
                            <button
                              onClick={() => toggleFavorite({
                                id: `treatment-${index}`,
                                name: treatment.trim(),
                                type: 'treatment',
                                category: 'general'
                              })}
                              className="text-gray-400 hover:text-[#357AFF] transition-colors"
                            >
                              <i className={`fas fa-heart ${favorites.some(fav => fav.name === treatment.trim()) ? 'text-[#357AFF]' : ''}`}></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#357AFF]">Products</h4>
                      <div className="space-y-2 mt-1">
                        {analysis.products.split(',').map((product, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#2a2a2a] p-2 rounded">
                            <span>{product.trim()}</span>
                            <button
                              onClick={() => toggleFavorite({
                                id: `product-${index}`,
                                name: product.trim(),
                                type: 'product',
                                category: 'general'
                              })}
                              className="text-gray-400 hover:text-[#357AFF] transition-colors"
                            >
                              <i className={`fas fa-heart ${favorites.some(fav => fav.name === product.trim()) ? 'text-[#357AFF]' : ''}`}></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#357AFF]">Lifestyle</h4>
                      <p>{analysis.lifestyle}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAnalysis(null);
                      setStreamingMessage("");
                    }}
                    className="flex-1 bg-[#357AFF] text-white py-2 px-4 rounded hover:bg-[#2563EB] transition-colors"
                  >
                    New Analysis
                  </button>
                  <button
                    onClick={() => {
                      setShowComparison(true);
                      setSelectedComparison(analysis);
                      if (analysis && analysisHistory.length > 0) {
                        compareAnalyses(analysis, analysisHistory[analysisHistory.length - 1]);
                      }
                    }}
                    className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    Compare
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Panel */}
        {showProgress && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-xl border border-[#333] shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Skin Progress</h2>
                  <button
                    onClick={() => setShowProgress(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#2a2a2a] p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-4">Add Progress Update</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Current Concerns</label>
                        <div className="flex flex-wrap gap-2">
                          {analysis?.concerns.split(',').map((concern, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                const concernText = concern.trim();
                                setNewProgress(prev => ({
                                  ...prev,
                                  concerns: prev.concerns.includes(concernText)
                                    ? prev.concerns.filter(c => c !== concernText)
                                    : [...prev.concerns, concernText]
                                }));
                              }}
                              className={`px-3 py-1 rounded-full text-sm ${
                                newProgress.concerns.includes(concern.trim())
                                  ? 'bg-[#FF3B30] text-white'
                                  : 'bg-[#333] text-gray-400'
                              }`}
                            >
                              {concern.trim()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Improvements</label>
                        <div className="flex flex-wrap gap-2">
                          {analysis?.treatments.split(',').map((treatment, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                const treatmentText = treatment.trim();
                                setNewProgress(prev => ({
                                  ...prev,
                                  improvements: prev.improvements.includes(treatmentText)
                                    ? prev.improvements.filter(i => i !== treatmentText)
                                    : [...prev.improvements, treatmentText]
                                }));
                              }}
                              className={`px-3 py-1 rounded-full text-sm ${
                                newProgress.improvements.includes(treatment.trim())
                                  ? 'bg-[#34C759] text-white'
                                  : 'bg-[#333] text-gray-400'
                              }`}
                            >
                              {treatment.trim()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={newProgress.notes}
                        onChange={(e) => setNewProgress(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add notes about your progress..."
                        className="w-full bg-[#333] text-white p-2 rounded"
                        rows={3}
                      />
                      <button
                        onClick={addProgress}
                        className="w-full bg-[#357AFF] text-white py-2 rounded hover:bg-[#2563EB] transition-colors"
                      >
                        Add Progress Update
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {skinProgress.map((progress) => (
                      <div key={progress.id} className="bg-[#2a2a2a] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-[#357AFF]">
                            Progress Update
                          </h3>
                          <span className="text-gray-400 text-sm">
                            {progress.date.toLocaleDateString()}
                          </span>
                        </div>
                        {progress.image && (
                          <img
                            src={progress.image}
                            alt="Progress"
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="space-y-3">
                          {progress.concerns.length > 0 && (
                            <div>
                              <h4 className="text-gray-400 text-sm">Concerns</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {progress.concerns.map((concern, i) => (
                                  <span key={i} className="px-2 py-1 bg-[#FF3B30] text-white text-xs rounded-full">
                                    {concern}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {progress.improvements.length > 0 && (
                            <div>
                              <h4 className="text-gray-400 text-sm">Improvements</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {progress.improvements.map((improvement, i) => (
                                  <span key={i} className="px-2 py-1 bg-[#34C759] text-white text-xs rounded-full">
                                    {improvement}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {progress.notes && (
                            <div>
                              <h4 className="text-gray-400 text-sm">Notes</h4>
                              <p className="text-white">{progress.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-xl border border-[#333] shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Analysis History</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                {analysisHistory.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No previous analyses found.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {analysisHistory.map((result, index) => (
                      <div
                        key={index}
                        className="bg-[#2a2a2a] rounded-lg p-4 border border-[#333]"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-[#357AFF]">
                            Analysis {analysisHistory.length - index}
                          </h3>
                          <span className="text-gray-400 text-sm">
                            {result.timestamp?.toLocaleDateString()}
                          </span>
                        </div>
                        {result.image && (
                          <img
                            src={result.image}
                            alt="Analysis"
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-gray-400 text-sm">Skin Type</h4>
                            <p className="text-white">{result.skinType}</p>
                          </div>
                          <div>
                            <h4 className="text-gray-400 text-sm">Concerns</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.concerns.split(',').map((concern, i) => (
                                <span key={i} className="px-2 py-1 bg-[#FF3B30] text-white text-xs rounded-full">
                                  {concern.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-gray-400 text-sm">Treatments</h4>
                            <p className="text-white">{result.treatments}</p>
                          </div>
                          <button
                            onClick={() => {
                              setShowComparison(true);
                              setSelectedComparison(result);
                            }}
                            className="w-full bg-[#357AFF] text-white py-2 px-4 rounded hover:bg-[#2563EB] transition-colors"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Favorites Panel */}
        {showFavorites && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-xl border border-[#333] shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Favorites</h2>
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFavorite}
                      onChange={(e) => setNewFavorite(e.target.value)}
                      placeholder="Add new favorite..."
                      className="flex-1 bg-[#333] text-white p-2 rounded"
                    />
                    <select
                      value={favoriteType}
                      onChange={(e) => setFavoriteType(e.target.value as 'treatment' | 'product')}
                      className="bg-[#333] text-white p-2 rounded"
                    >
                      <option value="treatment">Treatment</option>
                      <option value="product">Product</option>
                    </select>
                    <select
                      value={favoriteCategory}
                      onChange={(e) => setFavoriteCategory(e.target.value)}
                      className="bg-[#333] text-white p-2 rounded"
                    >
                      <option value="general">General</option>
                      <option value="cleanser">Cleanser</option>
                      <option value="moisturizer">Moisturizer</option>
                      <option value="serum">Serum</option>
                      <option value="mask">Mask</option>
                      <option value="treatment">Treatment</option>
                    </select>
                    <button
                      onClick={addFavorite}
                      className="bg-[#357AFF] text-white px-4 rounded hover:bg-[#2563EB] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {favorites.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No favorites yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {favorites.map((favorite) => (
                        <div
                          key={favorite.id}
                          className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded"
                        >
                          <div>
                            <span className="text-white">{favorite.name}</span>
                            <span className="text-gray-400 text-sm ml-2">
                              ({favorite.type} - {favorite.category})
                            </span>
                          </div>
                          <button
                            onClick={() => removeFavorite(favorite.id)}
                            className="text-gray-400 hover:text-[#FF3B30] transition-colors"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Panel */}
        {showComparison && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-xl border border-[#333] shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Analysis Comparison</h2>
                  <button
                    onClick={() => {
                      setShowComparison(false);
                      setSelectedComparison(null);
                      setComparisonResult(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                {comparisonResult ? (
                  <div className="space-y-6">
                    <div className="bg-[#2a2a2a] p-4 rounded-lg">
                      <h3 className="text-white font-semibold mb-3">Changes</h3>
                      <div className="space-y-2">
                        {comparisonResult.changes.map((change, index) => (
                          <div
                            key={index}
                            className={`flex items-center p-2 rounded ${
                              change.type === 'improvement' ? 'bg-[#34C759]' :
                              change.type === 'worsening' ? 'bg-[#FF3B30]' :
                              change.type === 'new' ? 'bg-[#FF9500]' :
                              'bg-[#357AFF]'
                            } bg-opacity-20`}
                          >
                            <i className={`fas ${
                              change.type === 'improvement' ? 'fa-arrow-up' :
                              change.type === 'worsening' ? 'fa-arrow-down' :
                              change.type === 'new' ? 'fa-plus' :
                              'fa-check'
                            } mr-2`}></i>
                            <span className="text-white">{change.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {comparisonResult.recommendations.length > 0 && (
                      <div className="bg-[#2a2a2a] p-4 rounded-lg">
                        <h3 className="text-white font-semibold mb-3">Recommendations</h3>
                        <div className="space-y-2">
                          {comparisonResult.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-center p-2 rounded bg-[#357AFF] bg-opacity-20">
                              <i className="fas fa-lightbulb mr-2 text-[#357AFF]"></i>
                              <span className="text-white">{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No comparison data available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SkinAnalysisPage() {
  return (
    <ErrorBoundary>
      <SkinAnalysisContent />
    </ErrorBoundary>
  );
} 