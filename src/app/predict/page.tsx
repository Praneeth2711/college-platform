"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface College {
  id: number; name: string; location: string; fees: number; rating: number;
  placementPercentage: number; type: string;
}
interface PredictResult {
  colleges: College[]; exam: string; rank: number; message: string;
  matchedRule?: { rankRange: string; collegeTypes: string[]; minRating: number };
}

const exams = ["JEE Advanced", "JEE Main", "BITSAT", "VITEEE", "SRMJEE", "State CET"];

export default function PredictPage() {
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!exam || !rank) { setError("Please select exam and enter rank"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam, rank: parseInt(rank) }),
      });
      const data = await res.json();
      // Simulate brief delay for "thinking" animation
      await new Promise(r => setTimeout(r, 800));
      setResult(data);
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          College <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Predictor</span>
        </h1>
        <p className="text-white/40 text-sm">Enter your exam and rank to discover colleges you can get into</p>
      </motion.div>

      {/* Input Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 sm:p-8 mb-8 max-w-xl mx-auto">
        <div className="space-y-4">
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Select Exam</label>
            <select value={exam} onChange={e => setExam(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-transparent outline-none cursor-pointer hover:bg-white/[0.08] focus:border-violet-500/40 transition-all appearance-none">
              <option value="" className="bg-gray-900">Choose an exam...</option>
              {exams.map(e => <option key={e} value={e} className="bg-gray-900">{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Your Rank</label>
            <input type="number" value={rank} onChange={e => setRank(e.target.value)} placeholder="Enter your rank"
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/40 focus:bg-white/[0.08] transition-all" min="1" />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <motion.button whileTap={{ scale: 0.97 }} onClick={handlePredict} disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 transition-all">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Analyzing your profile...
              </span>
            ) : "Predict Colleges →"}
          </motion.button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Summary */}
            <div className="glass rounded-2xl p-5 mb-6 text-center">
              <p className="text-white/50 text-sm">{result.message}</p>
              {result.matchedRule && (
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-lg bg-violet-500/15 text-violet-300 text-xs border border-violet-500/20">{result.exam}</span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-white/60 text-xs">Rank Range: {result.matchedRule.rankRange}</span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-white/60 text-xs">Min Rating: {result.matchedRule.minRating}★</span>
                </div>
              )}
            </div>

            {/* College Results */}
            {result.colleges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.colleges.map((college, i) => (
                  <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <Link href={`/college/${college.id}`}
                      className="block glass rounded-2xl p-5 glass-hover transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold text-sm group-hover:text-violet-300 transition-colors">{college.name}</h3>
                          <p className="text-white/40 text-xs mt-0.5">{college.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${college.type === "Government" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>{college.type}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                          <p className="text-yellow-400 font-semibold text-xs">⭐ {college.rating}</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                          <p className="text-white font-semibold text-xs">₹{(college.fees/100000).toFixed(1)}L</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                          <p className="text-emerald-400 font-semibold text-xs">{college.placementPercentage}%</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>
                </div>
                <p className="text-white/40 text-sm">No colleges match this criteria. Try a different rank.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
