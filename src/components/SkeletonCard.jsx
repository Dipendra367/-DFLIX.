import React from 'react';

const SkeletonCard = ({ isLarge = false }) => (
  <div
    className={`flex-shrink-0 animate-pulse rounded-lg bg-gray-800/60 ${
      isLarge ? 'w-[160px] md:w-[220px] h-[240px] md:h-[330px]' : 'w-[180px] md:w-[260px] h-[100px] md:h-[145px]'
    }`}
  />
);

export const SkeletonRow = ({ isLarge = false }) => (
  <div className="space-y-2">
    <div className="h-5 w-40 rounded bg-gray-800/60 animate-pulse" />
    <div className="flex gap-2.5 md:gap-4 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} isLarge={isLarge} />
      ))}
    </div>
  </div>
);

export default SkeletonCard;
