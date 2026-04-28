"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          College <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Predictor</span>
        </h1>
        <p className="text-white/40 text-sm">
          Enter your exam and rank to discover colleges you can get into
        </p>
      </motion.div>

      {/* Form */}
      <motion.div className="glass rounded-2xl p-6 sm:p-8 mb-8 max-w-xl mx-auto">
        <div className="space-y-4">

          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="w-full glass rounded-xl px-4 py-3 text-white"
          >
            <option value="">Choose exam</option>
            {exams.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>

          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="Enter your rank"
            className="w-full glass rounded-xl px-4 py-3 text-white"
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handlePredict}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white"
          >
            {loading ? "Analyzing..." : "Find Your Best Colleges 🚀"}
          </button>
        </div>
      </motion.div>

      {/* RESULTS */}
      {result && (
        <div>

          {/* Summary */}
          <div className="glass rounded-2xl p-5 mb-6 text-center">
            <p className="text-white/50 text-sm">{result.message}</p>
          </div>

          {/* Colleges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {result.colleges.map((college, i) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >

                <Link
                  href={`/college/${college.id}`}
                  className="relative block glass rounded-2xl p-5 hover:scale-105 transition-all"
                >

                  {/* ⭐ Badge */}
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2 py-1 rounded-full">
                    ⭐ Best Match
                  </span>

                  {/* Title */}
                  <h3 className="text-white font-semibold text-sm">
                    {college.name}
                  </h3>

                  <p className="text-white/40 text-xs mb-2">
                    {college.location}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-yellow-400 text-xs">⭐ {college.rating}</div>
                    <div className="text-white text-xs">
                      ₹{(college.fees / 100000).toFixed(1)}L
                    </div>
                    <div className="text-emerald-400 text-xs">
                      {college.placementPercentage}%
                    </div>
                  </div>

                  {/* 🧠 Reason */}
                  <p className="text-xs text-white/50 italic mt-2">
                    Based on your rank {result.rank}, this college is a strong fit with good placement trends.
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