"use client";
import React, { useState, useRef, useEffect } from "react";
import { useHandleStreamResponse } from "../../src/hooks/useHandleStreamResponse";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import useUser from "@/hooks/useUser";
import Link from 'next/link';

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
  onError: (error: Error) => void;
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
  const { data: user, loading: userLoading, error: userError } = useUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [mirrorCalibrated, setMirrorCalibrated] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamingMessage, setStreamingMessage] = useState('');
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
      setStreamingMessage(prev => prev + chunk);
    },
    onFinish: (message: string) => {
      setAnalysisResult(message);
      setStreamingMessage('');
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const startAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setAnalysisResult(null);
      setStreamingMessage('');

      const response = await fetch('/api/skin-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to start skin analysis');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to start analysis stream');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        handleStreamResponse(chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-4">You need to be signed in to use the skin analysis feature.</p>
          <Link
            href="/auth/signin"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorMessage 
          message={userError.message}
          variant="danger"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Skin Analysis</h1>
        
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={startAnalysis}
            variant="danger"
          />
        )}

        {!analysisResult && !isAnalyzing && !error && (
          <div className="text-center">
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Start Analysis
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="lg" />
            <span className="ml-4">Analyzing your skin...</span>
            {streamingMessage && (
              <div className="mt-4 text-gray-600">
                {streamingMessage}
              </div>
            )}
          </div>
        )}

        {analysisResult && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            <div className="prose max-w-none">
              {analysisResult}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default function SkinAnalysisPage() {
  return (
    <ErrorBoundary>
      <SkinAnalysisContent />
    </ErrorBoundary>
  );
} 