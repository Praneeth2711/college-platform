"use client";

import { motion } from "motion/react";

interface FilterPanelProps {
  location: string;
  onLocationChange: (value: string) => void;
  minFees: string;
  onMinFeesChange: (value: string) => void;
  maxFees: string;
  onMaxFeesChange: (value: string) => void;
  onReset: () => void;
}

const locations = [
  "All Locations",
  "Maharashtra",
  "Tamil Nadu",
  "Delhi",
  "Karnataka",
  "Telangana",
  "West Bengal",
  "Rajasthan",
  "Uttar Pradesh",
  "Uttarakhand",
  "Assam",
  "Punjab",
  "Odisha",
];

export default function FilterPanel({
  location,
  onLocationChange,
  minFees,
  onMinFeesChange,
  maxFees,
  onMaxFeesChange,
  onReset,
}: FilterPanelProps) {
  const hasFilters = location || minFees || maxFees;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-center gap-3"
    >
      {/* Location Filter */}
      <select
        value={location}
        onChange={(e) =>
          onLocationChange(e.target.value === "All Locations" ? "" : e.target.value)
        }
        className="glass rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-transparent outline-none cursor-pointer hover:bg-white/90 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none min-w-[150px]"
        id="location-filter"
      >
        {locations.map((loc) => (
          <option key={loc} value={loc} className="bg-white text-slate-800">
            {loc}
          </option>
        ))}
      </select>

      {/* Fees Range */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minFees}
          onChange={(e) => onMinFeesChange(e.target.value)}
          placeholder="Min ₹"
          className="glass rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-transparent outline-none w-24 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          id="min-fees-filter"
        />
        <span className="text-slate-300 text-sm">—</span>
        <input
          type="number"
          value={maxFees}
          onChange={(e) => onMaxFeesChange(e.target.value)}
          placeholder="Max ₹"
          className="glass rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-transparent outline-none w-24 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          id="max-fees-filter"
        />
      </div>

      {/* Reset */}
      {hasFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onReset}
          className="px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-colors"
        >
          Reset filters
        </motion.button>
      )}
    </motion.div>
  );
}
