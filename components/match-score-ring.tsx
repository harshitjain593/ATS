"use client"

import { cn } from "@/lib/utils"

interface MatchScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function MatchScoreRing({ score, size = 48, strokeWidth = 4 }: MatchScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColorClass = (s: number) => {
    if (s >= 80) return "text-green-500"
    if (s >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size}>
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-500 ease-out", getColorClass(score))}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className={cn("absolute text-sm font-bold", getColorClass(score))}>{score}%</span>
    </div>
  )
}
