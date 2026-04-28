"use client";

import { motion } from "motion/react";
import { getRecommendationReason, getMatchLabel, findMatchingRule } from "@/lib/predictor";

interface CollegeCardProps {
  college: {
    id: number;
    name: string;
    location: string;
    fees: number;
    rating: number;
    placementPercentage: number;
    type: string;
    establishedYear: number;
  };
  index: number;
  userRank?: number;
  exam?: string;
  isSelected?: boolean;
  onCompareToggle?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

export default function CollegeCard({
  college,
  index,
  userRank = 0,
  exam = "JEE Main",
  isSelected,
  onCompareToggle,
  onViewDetails,
}: CollegeCardProps) {

  const rule = findMatchingRule(exam, userRank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative glass rounded-2xl p-5 cursor-pointer transition-all duration-300 group ${isSelected
          ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
          : "glass-hover hover:shadow-xl hover:shadow-violet-500/10"
        }`}
      onClick={() => onViewDetails?.(college.id)}
    >

      {/* ⭐ Match Badge */}
      {rule && userRank > 0 && (
        <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2 py-1 rounded-full shadow">
          {getMatchLabel(userRank, rule)}
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate group-hover:text-violet-300 transition-colors">
            {college.name}
          </h3>
          <p className="text-white/50 text-sm mt-0.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{college.location}</span>
          </p>
        </div>

        <span
          className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium ${college.type === "Government"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
            }`}
        >
          {college.type}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/[0.03] rounded-xl p-2.5 text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Rating</p>
          <p className="text-white font-semibold text-sm flex items-center justify-center gap-1">
            ⭐ {college.rating}
          </p>
        </div>

        <div className="bg-white/[0.03] rounded-xl p-2.5 text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Fees/yr</p>
          <p className="text-white font-semibold text-sm">
            ₹{(college.fees / 100000).toFixed(1)}L
          </p>
        </div>

        <div className="bg-white/[0.03] rounded-xl p-2.5 text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Placed</p>
          <p className="text-emerald-400 font-semibold text-sm">
            {college.placementPercentage}%
          </p>
        </div>
      </div>

      {/* 🧠 Recommendation Reason (MAIN UPGRADE) */}
      {rule && userRank > 0 && (
        <p className="mt-2 text-sm text-white/60 italic leading-relaxed">
          {getRecommendationReason(exam, userRank, college, rule)}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(college.id);
          }}
          className="flex-1 py-2 px-3 rounded-xl bg-violet-500/15 text-violet-300 text-xs font-medium hover:bg-violet-500/25 active:scale-[0.97] transition-all border border-violet-500/20"
        >
          View Details
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle?.(college.id);
          }}
          className={`py-2 px-3 rounded-xl text-xs font-medium active:scale-[0.97] transition-all border ${isSelected
              ? "bg-violet-500/25 text-violet-300 border-violet-500/30"
              : "bg-white/5 text-white/50 border-white/10 hover:text-white/80 hover:bg-white/10"
            }`}
        >
          {isSelected ? "✓ Added" : "+ Compare"}
        </button>
      </div>
    </motion.div>
  );
}