"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { createPerson } from "@/lib/firebase/firestore";
import { RELATIONSHIP_TYPES, type Person } from "@/types";

export function AddPersonModal({ onClose }: { onClose: () => void }) {
  const { firebaseUser } = useAuth();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Person["relationship"]>("Friend");
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!firebaseUser || !name.trim()) return;
    setSaving(true);
    try {
      await createPerson(firebaseUser.uid, {
        name: name.trim(),
        relationship,
        birthday: birthday ? new Date(birthday + "T00:00:00") : undefined,
      });
      onClose();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-soft-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-warm-white rounded-t-2xl md:rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark">
          <h2 className="text-base font-semibold text-soft-black">Add a person</h2>
          <button onClick={onClose} className="p-1 text-warm-gray-light hover:text-warm-gray" aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-gray mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral text-sm"
              placeholder="Their name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-gray mb-1">Relationship</label>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_TYPES.map((rel) => (
                <button
                  key={rel}
                  onClick={() => setRelationship(rel)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    relationship === rel
                      ? "bg-coral text-white"
                      : "bg-cream border border-cream-dark text-warm-gray hover:border-coral/30"
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-gray mb-1">
              Birthday <span className="text-warm-gray-light">(optional)</span>
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral text-sm"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-cream-dark">
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full py-2.5 bg-coral text-white rounded-lg font-medium text-sm hover:bg-coral-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add person"}
          </button>
        </div>
      </div>
    </div>
  );
}
