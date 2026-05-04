"use client";

import { useState, useEffect, useCallback } from "react";

export function useSavedColleges() {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("savedColleges");
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {
      setSavedIds([]);
    }
  }, []);

  const persist = useCallback((ids: number[]) => {
    localStorage.setItem("savedColleges", JSON.stringify(ids));
    // Dispatch async so we don't trigger setState in another component during render
    setTimeout(() => {
      window.dispatchEvent(new Event("savedCollegesChanged"));
    }, 0);
  }, []);

  const save = useCallback((id: number) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      persist(next);
      return next;
    });
  }, [persist]);

  const unsave = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const toggle = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persist(next);
      return next;
    });
  }, [persist]);

  const isSaved = useCallback((id: number) => savedIds.includes(id), [savedIds]);

  return { savedIds, save, unsave, toggle, isSaved, count: savedIds.length };
}
