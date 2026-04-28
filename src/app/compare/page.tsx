"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";

interface Course { id: number; courseName: string; duration: string; }
interface College {
  id: number; name: string; location: string; fees: number; rating: number;
  placementPercentage: number; type: string; establishedYear: number; courses: Course[];
}
interface BestValues { lowestFees: number; highestRating: number; highestPlacement: number; oldestEstablished: number; }

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const [colleges, setColleges] = useState<College[]>([]);
  const [bestValues, setBestValues] = useState<BestValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load all colleges for picker
  useEffect(() => {
    fetch("/api/colleges?limit=50").then(r => r.json()).then(d => setAllColleges(d.colleges || []));
  }, []);

  // Parse initial IDs from URL
  useEffect(() => {
    if (idsParam) {
      const ids = idsParam.split(",").map(Number).filter(Boolean);
      setSelectedIds(ids);
    }
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
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const filtered = allColleges.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedIds.includes(c.id)
  );

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Compare <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Colleges</span>
        </h1>
        <p className="text-white/40 text-sm">Select 2–3 colleges to see a side-by-side comparison</p>
      </motion.div>

      {/* College Picker */}
      {selectedIds.length < 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 mb-8">
          <p className="text-white/60 text-sm mb-3">Add colleges to compare ({selectedIds.length}/3)</p>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search colleges..." className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none mb-3 focus:border-violet-500/40 transition-colors" />
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {filtered.slice(0, 10).map(c => (
              <button key={c.id} onClick={() => toggleSelect(c.id)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-xs hover:bg-violet-500/20 hover:text-white transition-all border border-white/5">
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
            <div key={c.id} className="flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/25 rounded-lg px-3 py-1.5">
              <span className="text-xs text-white/90 font-medium">{c.name}</span>
              <button onClick={() => toggleSelect(c.id)} className="text-white/40 hover:text-white/80">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="glass rounded-2xl p-6 animate-pulse"><div className="skeleton h-6 w-3/4 mb-4" /><div className="skeleton h-4 w-1/2 mb-8" /><div className="space-y-4">{[1,2,3,4].map(j => <div key={j} className="skeleton h-12 w-full rounded-xl" />)}</div></div>)}
        </div>
      )}

      {/* Comparison Cards */}
      {!loading && colleges.length >= 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.map((college, i) => (
            <motion.div key={college.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5 flex flex-col">
              {/* Header */}
              <div className="mb-5">
                <Link href={`/college/${college.id}`} className="text-white font-semibold text-base hover:text-violet-300 transition-colors">{college.name}</Link>
                <p className="text-white/40 text-sm mt-1">{college.location}</p>
                <span className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-medium ${college.type === "Government" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>{college.type}</span>
              </div>

              {/* Stats */}
              <div className="space-y-3 flex-1">
                {[
                  { label: "Rating", value: `${college.rating}/5`, best: isBest(college, "highestRating"), color: "text-yellow-400" },
                  { label: "Annual Fees", value: `₹${(college.fees/100000).toFixed(1)}L`, best: isBest(college, "lowestFees"), color: "text-white" },
                  { label: "Placement", value: `${college.placementPercentage}%`, best: isBest(college, "highestPlacement"), color: "text-emerald-400" },
                  { label: "Established", value: String(college.establishedYear), best: isBest(college, "oldestEstablished"), color: "text-violet-400" },
                ].map(stat => (
                  <div key={stat.label} className={`relative rounded-xl p-3 ${stat.best ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/[0.03]"}`}>
                    {stat.best && <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">BEST</span>}
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">{stat.label}</p>
                    <p className={`${stat.color} font-semibold text-sm`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Courses */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Courses</p>
                <div className="space-y-1">
                  {college.courses.slice(0, 3).map(course => (
                    <p key={course.id} className="text-white/60 text-xs">• {course.courseName}</p>
                  ))}
                  {college.courses.length > 3 && <p className="text-white/30 text-xs">+{college.courses.length - 3} more</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && selectedIds.length < 2 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          </div>
          <h3 className="text-white/60 text-lg font-medium mb-2">Select at least 2 colleges</h3>
          <p className="text-white/30 text-sm">Use the picker above or add colleges from the <Link href="/" className="text-violet-400 hover:underline">listing page</Link></p>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12"><div className="skeleton h-10 w-64 mx-auto mb-8" /><div className="skeleton h-96 w-full rounded-2xl" /></div>}><CompareContent /></Suspense>;
}
