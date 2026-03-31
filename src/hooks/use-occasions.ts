"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { subscribeToOccasions, subscribeToPersonOccasions } from "@/lib/firebase/firestore";
import type { Occasion } from "@/types";

export function useOccasions() {
  const { firebaseUser } = useAuth();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setOccasions([]);
      setLoading(false);
      return;
    }
    const unsub = subscribeToOccasions(firebaseUser.uid, (o) => {
      setOccasions(o);
      setLoading(false);
    });
    return () => unsub();
  }, [firebaseUser]);

  return { occasions, loading };
}

export function usePersonOccasions(personId: string | null) {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) {
      setOccasions([]);
      setLoading(false);
      return;
    }
    const unsub = subscribeToPersonOccasions(personId, (o) => {
      setOccasions(o);
      setLoading(false);
    });
    return () => unsub();
  }, [personId]);

  return { occasions, loading };
}
