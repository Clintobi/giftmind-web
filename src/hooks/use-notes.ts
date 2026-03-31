"use client";

import { useEffect, useState } from "react";
import { subscribeToNotes } from "@/lib/firebase/firestore";
import type { Note } from "@/types";

export function useNotes(personId: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) {
      setNotes([]);
      setLoading(false);
      return;
    }
    const unsub = subscribeToNotes(personId, (n) => {
      setNotes(n);
      setLoading(false);
    });
    return () => unsub();
  }, [personId]);

  return { notes, loading };
}
