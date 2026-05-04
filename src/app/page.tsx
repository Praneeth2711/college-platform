"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import CollegeCard from "@/components/CollegeCard";
import SkeletonCard from "@/components/SkeletonCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import CompareSelector from "@/components/CompareSelector";

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

interface ApiResponse {
  colleges: College[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export default function HomePage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (location) params.set("location", location);
      if (minFees) params.set("minFees", minFees);
      if (maxFees) params.set("maxFees", maxFees);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/colleges?${params}`);
      const data: ApiResponse = await res.json();
      setColleges(data.colleges);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    } finally {
      setLoading(false);
    }
  }, [search, location, minFees, maxFees, page]);

  useEffect(() => {
    const timer = setTimeout(fetchColleges, 300);
    return () => clearTimeout(timer);
  }, [fetchColleges]);

  const toggleCompare = (id: number) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 sm:py-16">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
          Find Your <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500 bg-clip-text text-transparent">Dream College</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          Discover, compare, and decide — all in one place. Explore {total > 0 ? total : "25"}+ top colleges across India.
        </motion.p>
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
      </motion.div>

      {/* Filters */}
      <div className="mb-8">
        <FilterPanel
          location={location}
          onLocationChange={(v) => { setLocation(v); setPage(1); }}
          minFees={minFees}
          onMinFeesChange={(v) => { setMinFees(v); setPage(1); }}
          maxFees={maxFees}
          onMaxFeesChange={(v) => { setMaxFees(v); setPage(1); }}
          onReset={() => { setLocation(""); setMinFees(""); setMaxFees(""); setPage(1); }}
        />
      </div>

      {/* Results Count */}
      {!loading && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-400 text-sm mb-6">
          Showing {colleges.length} of {total} colleges
        </motion.p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : colleges.map((college, i) => (
              <CollegeCard
                key={college.id}
                college={college}
                index={i}
                isSelected={compareIds.includes(college.id)}
                onCompareToggle={toggleCompare}
                onViewDetails={(id) => router.push(`/college/${id}`)}
              />
            ))}
      </div>

      {/* Empty State */}
      {!loading && colleges.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-slate-700 text-lg font-medium mb-2">No colleges found</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">Try adjusting your search or filters to discover colleges that match your preferences</p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl glass text-sm text-slate-600 hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? "bg-indigo-500 text-white shadow-sm" : "glass text-slate-500 hover:text-slate-700"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl glass text-sm text-slate-600 hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      )}

      {/* Compare Bar */}
      <CompareSelector
        selectedIds={compareIds}
        colleges={colleges}
        onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        onClear={() => setCompareIds([])}
      />
    </div>
  );
}
