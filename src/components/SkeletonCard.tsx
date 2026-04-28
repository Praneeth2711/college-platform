"use client";

export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="skeleton h-5 w-3/4 mb-2" />
          <div className="skeleton h-3.5 w-1/2" />
        </div>
        <div className="skeleton h-6 w-20 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/[0.03] rounded-xl p-2.5">
            <div className="skeleton h-2.5 w-10 mx-auto mb-1.5" />
            <div className="skeleton h-4 w-12 mx-auto" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-9 flex-1 rounded-xl" />
        <div className="skeleton h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}
