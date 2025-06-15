"use client";
import React, { useState, useRef, useEffect } from "react";
import { useHandleStreamResponse } from "@/hooks/useHandleStreamResponse";
import useUser from "@/hooks/useUser";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const MainComponent: React.FC = () => {
  const { data: user } = useUser();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [mirrorCalibrated, setMirrorCalibrated] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>("");

  // Calibration steps
  const calibrationSteps = [
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

  // Initialize mirror and fetch history
  useEffect(() => {
    const initializeMirror = async () => {
      try {
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "Your browser doesn't support camera access. Please try a different browser."
          );
        }

        await startCamera();
      } catch (err) {
        console.error("Error initializing mirror:", err);
        setError(
          err.message || "Failed to initialize mirror. Please refresh the page."
        );
      }
    };

    // Start camera as soon as component mounts, don't wait for user
    initializeMirror();

    const fetchHistory = async () => {
      if (!user) return;
      try {
        const response = await fetch("/api/skin-analysis-history");
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setAnalysisHistory(data.history || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();

    // Cleanup function
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => {
          track.stop();
          console.log("Camera track stopped:", track.label);
        });
      }
    };
  }, []); // Remove user dependency since we want camera regardless of login status

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
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            resolve();
          };
        });
      } else {
        throw new Error("Video element not found");
      }

      // Auto start calibration
      setMirrorCalibrated(false);
      setCalibrationStep(0);
    } catch (err) {
      console.error("Camera access error:", err);
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

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: async (message) => {
      setAnalysis(message);
      setStreamingMessage("");
      setAnalyzing(false);

      // Save analysis results
      if (user) {
        try {
          const response = await fetch("/api/save-skin-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl: await captureImage(),
              analysisResults: message,
              recommendations: {
                skinType:
                  message.match(/Skin type:(.*?)(?=\d\.|$)/s)?.[1]?.trim() ||
                  "",
                concerns:
                  message
                    .match(/Visible concerns:(.*?)(?=\d\.|$)/s)?.[1]
                    ?.trim() || "",
                treatments:
                  message
                    .match(/Recommended treatments:(.*?)(?=\d\.|$)/s)?.[1]
                    ?.trim() || "",
                products:
                  message
                    .match(/Product recommendations:(.*?)(?=\d\.|$)/s)?.[1]
                    ?.trim() || "",
                lifestyle:
                  message
                    .match(/Lifestyle suggestions:(.*?)(?=$)/s)?.[1]
                    ?.trim() || "",
              },
            }),
          });

          if (!response.ok) throw new Error("Failed to save analysis");
        } catch (err) {
          console.error("Error saving analysis:", err);
          setError("Failed to save analysis results");
        }
      }
    },
  });

  const captureImage = async () => {
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
      ctx.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/jpeg");

      // Verify the image data is valid
      if (!imageData || imageData === "data:,") {
        throw new Error("Failed to capture image from camera");
      }

      return imageData;
    } catch (err) {
      console.error("Error in captureImage:", err);
      throw new Error(
        "Could not capture image from camera. Please check camera permissions and try again."
      );
    }
  };

  const analyzeSkin = async () => {
    setAnalyzing(true);
    setError(null);

    try {
      // First check if camera is available
      if (!cameraStream) {
        throw new Error(
          "Camera not available. Please refresh the page and allow camera access."
        );
      }

      const imageData = await captureImage();
      if (!imageData) {
        throw new Error(
          "Could not capture image. Please make sure your camera is working."
        );
      }

      console.log("Sending image for analysis...");
      const visionResponse = await fetch("/integrations/gpt-vision/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: "You are a professional dermatologist with expertise in analyzing facial skin conditions. Your task is to examine the image and provide a detailed analysis of visible skin characteristics and conditions. Focus on observable features only.",
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Please analyze the skin in this image and provide a detailed assessment of:

1. Observable Skin Type Indicators:
- Look for shine/oil in T-zone
- Check for visible dryness or flaking
- Note any combination patterns
- Assess pore visibility and size

2. Visible Skin Conditions:
- Presence of acne or blemishes
- Signs of aging like fine lines
- Hyperpigmentation or dark spots
- Visible redness or irritation
- Texture irregularities

3. Evidence-Based Treatment Suggestions:
- Based on visible conditions only
- Focus on proven skincare ingredients
- Consider multiple concern areas

4. Specific Product Categories:
- Cleanser type recommendations
- Treatment products needed
- Moisturizer characteristics
- Sun protection needs

5. Observable Impact Factors:
- Signs of dehydration
- Indications of sun damage
- Visible stress manifestations

Please be specific about what you can actually see in the image and format your response with clear headers.`,
                },
                {
                  type: "image_url",
                  image_url: { url: imageData },
                },
              ],
            },
          ],
        }),
      });

      if (!visionResponse.ok) {
        console.error(
          "Vision API response not ok:",
          visionResponse.status,
          visionResponse.statusText
        );
        throw new Error(
          `Analysis failed: ${visionResponse.status} ${visionResponse.statusText}`
        );
      }

      const visionData = await visionResponse.json();
      if (
        !visionData ||
        !visionData.choices ||
        !visionData.choices[0]?.message?.content
      ) {
        console.error("Invalid vision API response:", visionData);
        throw new Error("Received invalid response from analysis service");
      }

      const analysis = visionData.choices[0].message.content;
      setAnalysis(analysis);

      // Save analysis results
      if (user) {
        try {
          const response = await fetch("/api/save-skin-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl: imageData,
              analysisResults: analysis,
              recommendations: {
                skinType:
                  analysis
                    .match(
                      /Observable Skin Type Indicators:(.*?)(?=\n\n|\n[A-Z]|$)/s
                    )?.[1]
                    ?.trim() || "",
                concerns:
                  analysis
                    .match(
                      /Visible Skin Conditions:(.*?)(?=\n\n|\n[A-Z]|$)/s
                    )?.[1]
                    ?.trim() || "",
                treatments:
                  analysis
                    .match(
                      /Evidence-Based Treatment Suggestions:(.*?)(?=\n\n|\n[A-Z]|$)/s
                    )?.[1]
                    ?.trim() || "",
                products:
                  analysis
                    .match(
                      /Specific Product Categories:(.*?)(?=\n\n|\n[A-Z]|$)/s
                    )?.[1]
                    ?.trim() || "",
                lifestyle:
                  analysis
                    .match(
                      /Observable Impact Factors:(.*?)(?=\n\n|\n[A-Z]|$)/s
                    )?.[1]
                    ?.trim() || "",
              },
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save analysis");
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
          // Don't show this error to user since analysis was successful
        }
      }
    } catch (err) {
      console.error("Error in analyzeSkin:", err);
      setError(err.message || "Failed to analyze skin. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

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
        <div className="w-24"></div>
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
                  <div className="whitespace-pre-wrap">{analysis}</div>
                )}
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setStreamingMessage("");
                  }}
                  className="w-full bg-[#357AFF] text-white py-2 px-4 rounded hover:bg-[#2563EB] transition-colors"
                >
                  New Analysis
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function SkinAnalysisPage() {
  return (
    <ErrorBoundary>
      <MainComponent />
    </ErrorBoundary>
  );
}