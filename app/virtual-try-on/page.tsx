"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from 'next-auth/react'

import { useUpload } from "@/utilities/runtime-helpers";

interface MirrorDimensions {
  width: number;
  height: number;
}

const MainComponent: React.FC = () => {
  const { data: user } = useUser();
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<string>("mirror");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mirrorCalibrated, setMirrorCalibrated] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [bodyTrackingPoints, setBodyTrackingPoints] = useState<any>(null);
  const [mirrorDimensions] = useState<MirrorDimensions>({ width: 392.7, height: 698.1 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [upload, { loading: uploadLoading }] = useUpload();
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null)

  // Initialize mirror display
  useEffect(() => {
    const initializeMirror = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        if (data.mirror_settings?.calibration) {
          setMirrorCalibrated(true);
        }
      } catch (err: any) {
        console.error("Error loading mirror settings:", err);
        setError("Could not load your mirror settings. Please try again.");
      }
    };

    initializeMirror();
  }, [user]);

  // Calibration steps guidance
  const calibrationSteps = [
    {
      instruction: "Please stand 2-3 feet away from the mirror",
      icon: "fa-arrows-alt-h",
      validation: () => true, // Basic distance check
    },
    {
      instruction: "Stand straight with your arms slightly away from your body",
      icon: "fa-male",
      validation: () => true, // Pose check
    },
    {
      instruction: "Stay still while we calibrate",
      icon: "fa-check-circle",
      validation: () => true, // Final calibration
    },
  ];

  // Handle clothing search
  const searchClothing = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/integrations/image-search/imagesearch?q=${encodeURIComponent(
          query + " clothing"
        )}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (err: any) {
      setError("Could not find clothing items. Please try a different search.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start mirror camera with error handling
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: mirrorDimensions.width,
          height: mirrorDimensions.height,
          facingMode: "user",
        },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error(err);
      setError(
        "Camera access failed. Please check your camera permissions and ensure no other app is using the camera."
      );
    }
  };

  // Calibration process
  const handleCalibration = async () => {
    if (calibrationStep < calibrationSteps.length - 1) {
      if (calibrationSteps[calibrationStep].validation()) {
        setCalibrationStep((prev) => prev + 1);
      }
    } else {
      try {
        // Final calibration step
        setLoading(true);
        // Simulate calibration process
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setMirrorCalibrated(true);
        setCalibrationStep(0);
      } catch (err: any) {
        setError("Calibration failed. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle clothing selection with improved error handling
  const handleClothingSelect = async (item: any) => {
    setError(null);
    setLoading(true);
    try {
      if (!mirrorCalibrated) {
        throw new Error("Please complete the mirror calibration first");
      }

      setSelectedItem(item);

      // Use Gemini to analyze clothing placement
      const response = await fetch("/integrations/google-gemini-1-5/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Analyze this clothing image and provide mirror overlay positioning data for a mirror with dimensions ${mirrorDimensions.width}x${mirrorDimensions.height}mm.`,
            },
          ],
          json_schema: {
            name: "mirror_overlay",
            schema: {
              type: "object",
              properties: {
                position: {
                  type: "object",
                  properties: {
                    x: { type: "number" },
                    y: { type: "number" },
                    scale: { type: "number" },
                    rotation: { type: "number" },
                  },
                  required: ["x", "y", "scale", "rotation"],
                },
                anchors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      point: { type: "string" },
                      offset: {
                        type: "object",
                        properties: {
                          x: { type: "number" },
                          y: { type: "number" },
                        },
                        required: ["x", "y"],
                      },
                    },
                    required: ["point", "offset"],
                  },
                },
              },
              required: ["position", "anchors"],
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze clothing position");
      }

      const analysisData = await response.json();
      const overlayData = JSON.parse(analysisData.choices[0].message.content);

      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        applyClothingOverlay(ctx, item, overlayData);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("calibration")) {
        setError(
          "Please complete the mirror calibration before trying on clothes"
        );
      } else {
        setError(
          "Could not position the clothing correctly. Please try standing straight and ensure good lighting."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup
  useEffect(() => {
    startCamera();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p>You need to be signed in to use the virtual try-on feature.</p>
        </div>
      </div>
    )
  }

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
        <h1 className="text-xl font-semibold text-white">Virtual Try-On</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {/* Main Content */}
      <div
        className="flex-1 relative"
        style={{
          width: `${mirrorDimensions.width}px`,
          height: `${mirrorDimensions.height}px`,
          margin: "0 auto",
        }}
      >
        {/* Camera View */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
            style={{ transform: "scaleX(-1)" }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Calibration Overlay */}
          {!mirrorCalibrated && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
              <div className="text-center p-8 rounded-xl bg-[#1a1a1a] border border-[#333] shadow-xl">
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
                  className="px-8 py-3 bg-[#357AFF] rounded-lg hover:bg-[#2563EB] transition-colors text-white font-medium text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </span>
                  ) : calibrationStep === calibrationSteps.length - 1 ? (
                    "Complete Calibration"
                  ) : (
                    "Next Step"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Search Interface */}
          <div className="absolute top-4 right-4 bg-[#1a1a1a] p-6 rounded-xl border border-[#333] shadow-lg w-80">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for clothing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && searchClothing(searchQuery)
                  }
                  className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 border border-[#444] focus:border-[#357AFF] focus:outline-none"
                />
                <button
                  onClick={() => searchClothing(searchQuery)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#357AFF] hover:text-[#2563EB] transition-colors"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            {/* Search Results */}
            {loading ? (
              <div className="text-center py-6">
                <i className="fas fa-spinner fa-spin text-3xl text-[#357AFF]"></i>
                <p className="mt-2 text-gray-400">Searching...</p>
              </div>
            ) : (
              searchResults.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleClothingSelect(item)}
                      className="flex items-center p-3 hover:bg-[#2a2a2a] rounded-lg cursor-pointer mb-2 transition-all transform hover:scale-102"
                    >
                      <img
                        src={item.thumbnailImageUrl}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-3">
                        <div className="text-white text-sm">{item.title}</div>
                        <div className="text-gray-400 text-xs mt-1">
                          Click to try on
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 bg-opacity-90 p-4 rounded-lg text-white flex items-center gap-3 shadow-lg">
              <i className="fas fa-exclamation-circle text-xl"></i>
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default MainComponent;