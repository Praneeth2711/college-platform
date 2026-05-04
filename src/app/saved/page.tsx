"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import CollegeCard from "@/components/CollegeCard";
import SkeletonCard from "@/components/SkeletonCard";

interface College {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  type: string;
  establishedYear: number;
  description: string;
}

export default function SavedPage() {
  const router = useRouter();
  const { savedIds } = useSavedColleges();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (savedIds.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?limit=50`);
      const data = await res.json();
      const all: College[] = data.colleges || [];
      setColleges(all.filter((c) => savedIds.includes(c.id)));
    } catch (err) {
      console.error("Failed to fetch saved colleges:", err);
    } finally {
      setLoading(false);
    }
  }, [savedIds]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Saved <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Colleges</span>
        </h1>
        <p className="text-slate-500 text-sm">
          {colleges.length > 0 ? `${colleges.length} college${colleges.length > 1 ? "s" : ""} saved` : "Your bookmarked colleges appear here"}
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : colleges.map((college, i) => (
              <CollegeCard
                key={college.id}
                college={college}
                index={i}
                onViewDetails={(id) => router.push(`/college/${id}`)}
              />
            ))}
      </div>

      {/* Empty State */}
      {!loading && colleges.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-slate-700 text-lg font-medium mb-2">No saved colleges yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-4">
            Start exploring and save your favorites ❤️ to compare later and make better decisions
          </p>
          <a href="/" className="inline-block px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors">
            Explore colleges →
          </a>
        </motion.div>
      )}
    </div>
  );
}
