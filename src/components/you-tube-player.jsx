"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ videoId, onError }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!videoId) {
      setHasError(true);
      onError?.("No video ID provided");
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [videoId, onError]);

  if (hasError) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg p-4">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-700 dark:text-gray-300 font-inter">
            Failed to load video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin"></div>
          </div>
        ) : null}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?controls=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold font-inter text-gray-900 dark:text-gray-100 mb-4">
          Working Example
        </h2>
        <MainComponent videoId="dQw4w9WgXcQ" />
      </div>

      <div>
        <h2 className="text-xl font-bold font-inter text-gray-900 dark:text-gray-100 mb-4">
          Error State
        </h2>
        <MainComponent videoId="" />
      </div>
    </div>
  );
});
}