"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";

interface Course { id: number; courseName: string; duration: string; }
interface College {
  id: number; name: string; location: string; fees: number; rating: number;
  placementPercentage: number; type: string; establishedYear: number; courses: Course[];
}
interface BestValues { lowestFees: number; highestRating: number; highestPlacement: number; oldestEstablished: number; }

// Generate dynamic insight summary based on comparison data
function generateInsight(colleges: College[], best: BestValues): string {
  const topPlacement = colleges.find(c => c.placementPercentage === best.highestPlacement);
  const lowestFees = colleges.find(c => c.fees === best.lowestFees);
  const topRated = colleges.find(c => c.rating === best.highestRating);

  const parts: string[] = [];

  if (topPlacement) {
    parts.push(`${topPlacement.name} leads with the highest placement rate at ${topPlacement.placementPercentage}%`);
  }
  if (lowestFees && lowestFees.id !== topPlacement?.id) {
    parts.push(`while ${lowestFees.name} offers the best value at ₹${(lowestFees.fees / 100000).toFixed(1)}L/year`);
  }
  if (topRated && topRated.id !== topPlacement?.id && topRated.id !== lowestFees?.id) {
    parts.push(`and ${topRated.name} has the highest overall rating of ${topRated.rating}/5`);
  }

  if (parts.length === 0) return "All colleges are closely matched across key metrics.";
  return parts.join(", ") + ".";
}

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const [colleges, setColleges] = useState<College[]>([]);
  const [bestValues, setBestValues] = useState<BestValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/colleges?limit=50").then(r => r.json()).then(d => setAllColleges(d.colleges || []));
  }, []);

  useEffect(() => {
    if (idsParam) setSelectedIds(idsParam.split(",").map(Number).filter(Boolean));
  }, [idsParam]);

  const fetchComparison = useCallback(async (ids: number[]) => {
    if (ids.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      setColleges(data.colleges || []);
      setBestValues(data.bestValues || null);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (selectedIds.length >= 2) fetchComparison(selectedIds);
    else { setColleges([]); setBestValues(null); }
  }, [selectedIds, fetchComparison]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const filtered = allColleges.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedIds.includes(c.id));

  const isBest = (college: College, field: keyof BestValues) => {
    if (!bestValues) return false;
    const map: Record<keyof BestValues, boolean> = {
      lowestFees: college.fees === bestValues.lowestFees,
      highestRating: college.rating === bestValues.highestRating,
      highestPlacement: college.placementPercentage === bestValues.highestPlacement,
      oldestEstablished: college.establishedYear === bestValues.oldestEstablished,
    };
    return map[field];
  };

  // Reason labels for BEST badges
  const bestLabel = (field: keyof BestValues): string => {
    const labels: Record<keyof BestValues, string> = {
      highestRating: "⭐ BEST (Top Rated)",
      lowestFees: "⭐ BEST (Lowest Fees)",
      highestPlacement: "⭐ BEST (Highest Placement)",
      oldestEstablished: "⭐ BEST (Most Established)",
    };
    return labels[field];
  };

  // Dynamic insight
  const insight = useMemo(() => {
    if (!bestValues || colleges.length < 2) return null;
    return generateInsight(colleges, bestValues);
  }, [colleges, bestValues]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Compare <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Colleges</span>
        </h1>
        <p className="text-slate-500 text-sm">Select 2–3 colleges for a side-by-side comparison</p>
      </motion.div>

      {/* College Picker */}
      {selectedIds.length < 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 mb-8">
          <p className="text-slate-600 text-sm mb-3">Add colleges ({selectedIds.length}/3)</p>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search colleges..." className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none mb-3 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {filtered.slice(0, 10).map(c => (
              <button key={c.id} onClick={() => toggleSelect(c.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200">
                {c.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selected chips */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allColleges.filter(c => selectedIds.includes(c.id)).map(c => (
            <div key={c.id} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5">
              <span className="text-xs text-indigo-700 font-medium">{c.name}</span>
              <button onClick={() => toggleSelect(c.id)} className="text-indigo-400 hover:text-indigo-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="skeleton h-6 w-3/4 mb-4" />
              <div className="skeleton h-4 w-1/2 mb-8" />
              <div className="space-y-4">{[1,2,3,4].map(j => <div key={j} className="skeleton h-12 w-full rounded-xl" />)}</div>
            </div>
          ))}
        </div>
      )}

      {/* ────────────── INSIGHT SUMMARY (DECISION INTELLIGENCE) ────────────── */}
      {!loading && colleges.length >= 2 && insight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 mb-8 border-l-4 border-indigo-500"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4.5 h-4.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Decision Insight</p>
              <p className="text-slate-700 text-sm leading-relaxed">{insight}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ────────────── COMPARISON CARDS ────────────── */}
      {!loading && colleges.length >= 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.map((college, i) => (
            <motion.div key={college.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5 flex flex-col">
              {/* Header */}
              <div className="mb-5">
                <Link href={`/college/${college.id}`} className="text-slate-900 font-semibold text-base hover:text-indigo-600 transition-colors">{college.name}</Link>
                <p className="text-slate-500 text-sm mt-1">{college.location}</p>
                <span className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-medium ${college.type === "Government" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>{college.type}</span>
              </div>

              {/* Stats with Reason Labels */}
              <div className="space-y-3 flex-1">
                {([
                  { label: "Rating", value: `${college.rating}/5`, field: "highestRating" as keyof BestValues, color: "text-amber-600" },
                  { label: "Annual Fees", value: `₹${(college.fees/100000).toFixed(1)}L`, field: "lowestFees" as keyof BestValues, color: "text-slate-800" },
                  { label: "Placement", value: `${college.placementPercentage}%`, field: "highestPlacement" as keyof BestValues, color: "text-emerald-600" },
                  { label: "Established", value: String(college.establishedYear), field: "oldestEstablished" as keyof BestValues, color: "text-indigo-600" },
                ] as const).map(stat => {
                  const best = isBest(college, stat.field);
                  return (
                    <div key={stat.label} className={`relative rounded-xl p-3 transition-all ${best ? "bg-emerald-50 border border-emerald-200 shadow-sm shadow-emerald-100" : "bg-slate-50/80"}`}>
                      {best && (
                        <span className="absolute -top-2.5 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                          {bestLabel(stat.field)}
                        </span>
                      )}
                      <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">{stat.label}</p>
                      <p className={`${best ? "text-emerald-700" : stat.color} font-semibold text-sm`}>{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Courses */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-2">Courses</p>
                <div className="space-y-1">
                  {college.courses.slice(0, 3).map(course => (
                    <p key={course.id} className="text-slate-600 text-xs">• {course.courseName}</p>
                  ))}
                  {college.courses.length > 3 && <p className="text-slate-400 text-xs">+{college.courses.length - 3} more</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && selectedIds.length < 2 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h3 className="text-slate-700 text-lg font-medium mb-2">Compare colleges to decide faster</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">Select at least 2 colleges above to see side-by-side metrics with best-value highlighting</p>
          <Link href="/" className="inline-block mt-4 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors">
            Browse colleges →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12"><div className="skeleton h-10 w-64 mx-auto mb-8" /><div className="skeleton h-96 w-full rounded-2xl" /></div>}>
      <CompareContent />
    </Suspense>
  );
}
