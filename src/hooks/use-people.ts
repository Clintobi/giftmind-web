"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { subscribeToPeople } from "@/lib/firebase/firestore";
import type { Person } from "@/types";

export function usePeople() {
  const { firebaseUser } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setPeople([]);
      setLoading(false);
      return;
    }
    const unsub = subscribeToPeople(firebaseUser.uid, (p) => {
      setPeople(p);
      setLoading(false);
    });
    return () => unsub();
  }, [firebaseUser]);

  return { people, loading };
}
