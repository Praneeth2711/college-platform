"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  type: string;
}

interface PredictResult {
  colleges: College[];
  exam: string;
  rank: number;
  message: string;
  matchedRule?: {
    rankRange: string;
    collegeTypes: string[];
    minRating: number;
  };
}

const exams = ["JEE Advanced", "JEE Main", "BITSAT", "VITEEE", "SRMJEE", "State CET"];

export default function PredictPage() {
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!exam || !rank) {
      setError("Please select exam and enter rank");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam, rank: parseInt(rank) }),
      });

      const data = await res.json();
      await new Promise((r) => setTimeout(r, 800)); // smooth UX
      setResult(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          College <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Predictor</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Enter your exam and rank to discover colleges you can get into
        </p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 sm:p-8 mb-8 max-w-xl mx-auto">
        <div className="space-y-4">
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="w-full glass rounded-xl px-4 py-3 text-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="" className="bg-white text-slate-500">Choose exam</option>
            {exams.map((e) => (
              <option key={e} value={e} className="bg-white text-slate-800">{e}</option>
            ))}
          </select>

          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="Enter your rank"
            className="w-full glass rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Find Your Best Colleges 🚀"}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      {result && (
        <div>
          <div className="glass rounded-2xl p-5 mb-6 text-center">
            <p className="text-slate-600 text-sm">{result.message}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.colleges.map((college, i) => (
              <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href={`/college/${college.id}`}
                  className="relative block glass rounded-2xl p-5 hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] px-2 py-1 rounded-full shadow-sm">
                    ⭐ Best Match
                  </span>
                  <h3 className="text-slate-900 font-semibold text-sm">{college.name}</h3>
                  <p className="text-slate-500 text-xs mb-3">{college.location}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-amber-600 text-xs font-medium">⭐ {college.rating}</div>
                    <div className="text-slate-700 text-xs font-medium">₹{(college.fees / 100000).toFixed(1)}L</div>
                    <div className="text-emerald-600 text-xs font-medium">{college.placementPercentage}%</div>
                  </div>
                  <p className="text-xs text-slate-500 italic mt-2">
                    Based on your rank {result.rank}, this college is a strong fit.
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}