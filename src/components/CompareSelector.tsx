"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface CompareSelectorProps {
  selectedIds: number[];
  colleges: { id: number; name: string }[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function CompareSelector({ selectedIds, colleges, onRemove, onClear }: CompareSelectorProps) {
  const selected = colleges.filter((c) => selectedIds.includes(c.id));
  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-2xl px-5 py-3.5 shadow-xl shadow-slate-200/60 flex items-center gap-4 max-w-lg w-[calc(100%-2rem)] border border-slate-200/50"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
            {selected.map((c) => (
              <motion.div key={c.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1.5 shrink-0">
                <span className="text-xs text-indigo-700 font-medium whitespace-nowrap max-w-[100px] truncate">{c.name}</span>
                <button onClick={() => onRemove(c.id)} className="text-indigo-400 hover:text-indigo-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClear} className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Clear</button>
            {selectedIds.length >= 2 && (
              <Link href={`/compare?ids=${selectedIds.join(",")}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.97] transition-all">
                Compare ({selectedIds.length})
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
