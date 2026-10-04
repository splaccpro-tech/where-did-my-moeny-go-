import React, { useState } from 'react';
import { CategoryId, CATEGORIES } from '../types';
import { formatINR } from '../utils/formatters';

interface DonutSlice {
  id: CategoryId;
  name: string;
  emoji: string;
  color: string;
  amount: number;
  percentage: number;
}

interface DonutChartProps {
  slices: DonutSlice[];
  totalSpent: number;
  activeCategory: CategoryId | null;
  onHoverCategory: (id: CategoryId | null) => void;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  slices,
  totalSpent,
  activeCategory,
  onHoverCategory,
}) => {
  const [internalHover, setInternalHover] = useState<CategoryId | null>(null);

  const hoveredId = activeCategory || internalHover;
  const hoveredSlice = slices.find(s => s.id === hoveredId);

  // SVG parameters
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2; // radius ~78
  const center = size / 2; // 90
  const circumference = 2 * Math.PI * radius;

  // Filter only slices with amount > 0
  const activeSlices = slices.filter(s => s.amount > 0);

  // Calculate offsets
  let accumulatedPercent = 0;
  const renderedSegments = activeSlices.map(slice => {
    const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += slice.percentage;

    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-[180px] h-[180px]">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f4f4f5"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {totalSpent > 0 &&
            renderedSegments.map(segment => {
              const isSelected = hoveredId === segment.id;
              return (
                <circle
                  key={segment.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={isSelected ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  className="cursor-pointer transition-all duration-150"
                  style={{
                    opacity: hoveredId && !isSelected ? 0.45 : 1,
                  }}
                  onMouseEnter={() => {
                    setInternalHover(segment.id);
                    onHoverCategory(segment.id);
                  }}
                  onMouseLeave={() => {
                    setInternalHover(null);
                    onHoverCategory(null);
                  }}
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          {hoveredSlice ? (
            <>
              <span className="text-sm">{hoveredSlice.emoji}</span>
              <span className="text-xs font-medium text-zinc-500 truncate max-w-[100px]">
                {hoveredSlice.name}
              </span>
              <span className="text-sm font-bold text-zinc-900 font-mono tabular-nums">
                {formatINR(hoveredSlice.amount)}
              </span>
              <span className="text-[10px] font-semibold text-zinc-400">
                {hoveredSlice.percentage.toFixed(1)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Total
              </span>
              <span className="text-base font-bold text-zinc-900 font-mono tabular-nums">
                {formatINR(totalSpent)}
              </span>
              <span className="text-[10px] text-zinc-400">
                {activeSlices.length} categories
              </span>
            </>
          )}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-zinc-400 text-center">
        Hover on a segment or list item to inspect
      </p>
    </div>
  );
};
