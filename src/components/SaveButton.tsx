"use client";

import { motion } from "motion/react";

interface SaveButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export default function SaveButton({ isSaved, onToggle, size = "sm" }: SaveButtonProps) {
  const dim = size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`p-2 rounded-xl transition-colors ${
        isSaved
          ? "text-red-500 bg-red-50 hover:bg-red-100"
          : "text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-500"
      }`}
      aria-label={isSaved ? "Unsave college" : "Save college"}
    >
      <motion.svg
        className={dim}
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={isSaved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </motion.svg>
    </motion.button>
  );
}
