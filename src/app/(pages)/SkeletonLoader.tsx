import React from 'react';

interface ContentSkeletonProps {
  activeButton: any; // Using any to match your ButtonType
  theme?: string;
}

const ContentSkeleton = ({ activeButton, theme }: ContentSkeletonProps) => {
  const isBusMode = activeButton === 'Bus' || activeButton?.toString().includes('Bus');
  
  return (
    <div className={`w-full min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section Skeleton */}
      <div className={`bg-[#DEF5FB] ${theme === "dark" ? "bg-gray-900" : ""} w-full rounded-b-[2pc] pb-20`}>
        <div className="container mx-auto px-4 pt-8">
          {/* Navigation Tabs Skeleton */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-lg p-2 shadow-md">
              <div className="w-24 h-10 bg-gray-200 rounded-md mr-2 animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>

          {/* Search Form Skeleton */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex items-end">
                <div className="w-full h-12 bg-blue-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
            {isBusMode && (
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Section Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse mb-4 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comfort Section Skeleton */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-80"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-80 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Why Choose Section Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-72 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {isBusMode && (
        <>
          {/* Popular Places Skeleton */}
          <div className="bg-blue-50 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-80 mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partners Skeleton */}
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-72 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="w-24 h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* FAQ Skeleton */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-80 mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cheap Tickets Tips Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-center">
          <div className="h-8 bg-white bg-opacity-30 rounded animate-pulse w-72 mx-auto mb-4"></div>
          <div className="h-4 bg-white bg-opacity-30 rounded animate-pulse w-96 mx-auto mb-6"></div>
          <div className="h-12 bg-white bg-opacity-30 rounded-lg animate-pulse w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentSkeleton;