"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User as FirebaseUser } from "firebase/auth";
import { onAuthChange } from "@/lib/firebase/auth";
import { createUserDoc, subscribeToUser } from "@/lib/firebase/firestore";
import type { User } from "@/types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Ensure user doc exists
      await createUserDoc(fbUser.uid, fbUser.email || "", fbUser.displayName || "");
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  // Subscribe to user document for real-time updates
  useEffect(() => {
    if (!firebaseUser) return;
    const unsub = subscribeToUser(firebaseUser.uid, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
