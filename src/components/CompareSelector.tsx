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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/40 flex items-center gap-4 max-w-lg w-[calc(100%-2rem)]"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
            {selected.map((c) => (
              <motion.div key={c.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="flex items-center gap-1.5 bg-violet-500/20 border border-violet-500/30 rounded-lg px-2.5 py-1.5 shrink-0">
                <span className="text-xs text-white/90 font-medium whitespace-nowrap max-w-[100px] truncate">{c.name}</span>
                <button onClick={() => onRemove(c.id)} className="text-white/40 hover:text-white/80">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClear} className="text-white/40 hover:text-white/70 text-xs">Clear</button>
            {selectedIds.length >= 2 && (
              <Link href={`/compare?ids=${selectedIds.join(",")}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.97] transition-all">
                Compare ({selectedIds.length})
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
