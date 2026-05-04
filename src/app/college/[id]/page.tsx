"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";
import { useSavedColleges } from "@/hooks/useSavedColleges";

interface Course {
  id: number;
  courseName: string;
  duration: string;
}

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
  courses: Course[];
}

const tabs = ["Overview", "Courses", "Placements"];

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const { isSaved, toggle } = useSavedColleges();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setCollege(data);
      } catch { setError("College not found"); }
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="skeleton h-8 w-64 mb-4" />
      <div className="skeleton h-4 w-48 mb-8" />
      <div className="glass rounded-2xl p-8">
        <div className="skeleton h-6 w-full mb-4" />
        <div className="skeleton h-4 w-3/4 mb-3" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
  );

  if (error || !college) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      </div>
      <h2 className="text-slate-600 text-xl font-medium mb-2">College not found</h2>
      <Link href="/" className="text-indigo-500 text-sm hover:underline">← Back to colleges</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
      {/* Back link */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to colleges
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-transparent to-purple-50/40" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{college.name}</h1>
              <p className="text-slate-500 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {college.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${college.type === "Government" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
                {college.type}
              </span>
              <SaveButton isSaved={isSaved(college.id)} onToggle={() => toggle(college.id)} size="md" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Rating", value: `${college.rating}/5`, icon: "⭐" },
              { label: "Annual Fees", value: `₹${(college.fees/100000).toFixed(1)}L`, icon: "💰" },
              { label: "Placement", value: `${college.placementPercentage}%`, icon: "📈" },
              { label: "Established", value: String(college.establishedYear), icon: "🏛️" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50/80 rounded-xl p-3 text-center">
                <p className="text-lg mb-0.5">{stat.icon}</p>
                <p className="text-slate-800 font-semibold text-sm">{stat.value}</p>
                <p className="text-slate-400 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="glass rounded-2xl mb-6">
        <div className="flex border-b border-slate-100">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`relative flex-1 py-3.5 text-sm font-medium transition-colors ${activeTab === i ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
              {activeTab === i && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }} className="p-6">
            {activeTab === 0 && (
              <div>
                <h3 className="text-slate-900 font-semibold mb-3">About</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{college.description}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/80 rounded-xl p-4">
                    <p className="text-slate-400 text-xs mb-1">City</p>
                    <p className="text-slate-800 text-sm font-medium">{college.city}</p>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-4">
                    <p className="text-slate-400 text-xs mb-1">State</p>
                    <p className="text-slate-800 text-sm font-medium">{college.state}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div className="space-y-3">
                <h3 className="text-slate-900 font-semibold mb-3">Courses Offered</h3>
                {college.courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between bg-slate-50/80 rounded-xl p-4">
                    <div>
                      <p className="text-slate-800 text-sm font-medium">{course.courseName}</p>
                    </div>
                    <span className="text-slate-500 text-xs bg-slate-100 px-2.5 py-1 rounded-lg">{course.duration}</span>
                  </div>
                ))}
                {college.courses.length === 0 && <p className="text-slate-400 text-sm">No courses listed</p>}
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Placement Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-600 text-sm">Placement Rate</span>
                      <span className="text-emerald-600 text-sm font-semibold">{college.placementPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${college.placementPercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-50/80 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900 mb-1">{college.placementPercentage}%</p>
                      <p className="text-slate-400 text-xs">Students Placed</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-indigo-500 mb-1">₹{(college.fees / 100000).toFixed(1)}L</p>
                      <p className="text-slate-400 text-xs">Annual Investment</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
