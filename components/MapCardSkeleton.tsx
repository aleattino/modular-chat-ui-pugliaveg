import React from 'react';

const MapCardSkeleton: React.FC = () => (
  <div className="not-prose my-3">
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="flex flex-col lg:flex-row">

        <div className="flex-1 p-3 lg:p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
              <div className="h-3.5 w-1/3 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
            </div>
            <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-600 animate-pulse flex-shrink-0" />
          </div>

          <div className="flex gap-2">
            <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
            <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
          </div>
        </div>

        <div className="lg:w-[280px] h-[120px] lg:h-[160px] flex-shrink-0 bg-gray-200 dark:bg-gray-600 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

      </div>
    </div>
  </div>
);

export default MapCardSkeleton;
