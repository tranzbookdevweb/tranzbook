import React, { useState, useEffect } from 'react';

interface TranzbookBusLoaderProps {
  onComplete: () => void; // Callback to signal completion
}

const TranzbookBusLoader = ({ onComplete }: TranzbookBusLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Finding best routes...');

  const loadingMessages = [
    'Finding best routes...',
    'Checking availability...',
    'Securing your seats...',
    'Almost ready...',
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          onComplete(); // Notify parent when progress reaches 100%
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center z-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-20 h-20 bg-cyan-500 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-24 h-24 bg-blue-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="text-center space-y-8 max-w-md mx-auto px-6">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
              Tranz<span className="text-blue-500">book</span>
            </h1>
            <p className="text-gray-600 text-sm">Move with Ease</p>
          </div>

          {/* Animated Bus */}
          <div className="relative h-32 flex items-center justify-center">
            {/* Road */}
            <div className="absolute bottom-8 left-0 right-0 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 animate-pulse"></div>
              {/* Road lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-0.6 transform -translate-y-1/2">
                <div className="h-full bg-white animate-ping"></div>
              </div>
            </div>

            {/* Bus */}
            <div className="relative animate-bounce">
              <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                {/* Bus Body */}
                <rect
                  x="10"
                  y="15"
                  width="90"
                  height="35"
                  rx="8"
                  fill="#48A6FF"
                  className="animate-pulse"
                />
                {/* Bus Front */}
                <rect
                  x="100"
                  y="20"
                  width="15"
                  height="25"
                  rx="8"
                  fill="#3B82F6"
                />
                {/* Windows */}
                <rect x="15" y="20" width="12" height="8" rx="0.9" fill="#E5F3FF" opacity="0.9" />
                <rect x="30" y="20" width="12" height="8" rx="2" fill="#E5F3FF" opacity="0.9" />
                <rect x="45" y="20" width="12" height="8" rx="2" fill="#E5F3FF" opacity="0.9" />
                <rect x="60" y="20" width="12" height="8" rx="2" fill="#E5F3FF" opacity="0.9" />
                <rect x="75" y="20" width="12" height="8" rx="2" fill="#E5F3FF" opacity="0.9" />
                {/* Door */}
                <rect x="90" y="25" width="8" height="20" rx="2" fill="#2563EB" />
                {/* Wheels */}
                <circle cx="25" cy="52" r="6" fill="#374151" />
                <circle cx="25" cy="52" r="3" fill="#6B7280" />
                <circle cx="85" cy="52" r="6" fill="#374151" />
                <circle cx="85" cy="52" r="3" fill="#6B7280" />
                {/* Headlight */}
                <circle cx="108" cy="30" r="3" fill="#FEF3C7" className="animate-pulse" />
                {/* Bus details */}
                <rect x="12" y="35" width="85" height="12" rx="2" fill="#3B82F6" opacity="0.8" />
                <text x="55" y="43" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
                  TRANZBOOK
                </text>
              </svg>

              {/* Motion lines */}
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 space-y-1">
                <div className="w-6 h-0.5 bg-blue-300 animate-pulse delay-100"></div>
                <div className="w-4 h-0.5 bg-blue-400 animate-pulse delay-200"></div>
                <div className="w-8 h-0.5 bg-blue-200 animate-pulse delay-300"></div>
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-100"></div>
              <div className="absolute top-12 right-12 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-4 left-16 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-8 right-8 w-1 h-1 bg-cyan-300 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4">
            <p className="text-gray-700 font-medium text-lg animate-pulse">
              {loadingText}
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-100 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-gray-500">{progress}% Complete</p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </>
  );
};

export default TranzbookBusLoader;