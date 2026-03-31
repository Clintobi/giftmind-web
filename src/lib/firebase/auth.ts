import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not configured. Add credentials to .env.local");
  return auth;
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(requireAuth(), email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(requireAuth(), email, password);
}

export async function signInWithGoogle() {
  return signInWithPopup(requireAuth(), googleProvider);
}

export async function signOut() {
  return firebaseSignOut(requireAuth());
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(requireAuth(), email);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  const auth = getFirebaseAuth();
  if (!auth) {
    // Firebase not configured — treat as signed out
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
