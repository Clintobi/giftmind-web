"use client";

import { useState, useEffect, useRef } from "react";
import { useQuickLog } from "@/providers/quick-log-provider";
import { useAuth } from "@/providers/auth-provider";
import { usePeople } from "@/hooks/use-people";
import { createNote } from "@/lib/firebase/firestore";
import { NOTE_CATEGORIES, type NoteCategory } from "@/types";
import { NOTE_MAX_LENGTH } from "@/lib/utils/constants";

export function QuickLogModal() {
  const { isOpen, preselectedPersonId, closeQuickLog } = useQuickLog();
  const { firebaseUser } = useAuth();
  const { people } = usePeople();

  const [personId, setPersonId] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<NoteCategory>("General");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && preselectedPersonId) {
      setPersonId(preselectedPersonId);
    }
  }, [isOpen, preselectedPersonId]);

  useEffect(() => {
    if (isOpen && personId && textRef.current) {
      setTimeout(() => textRef.current?.focus(), 100);
    }
  }, [isOpen, personId]);

  if (!isOpen) return null;

  const filteredPeople = search
    ? people.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : people;

  const selectedPerson = people.find((p) => p.id === personId);

  async function handleSave() {
    if (!firebaseUser || !personId || !text.trim()) return;
    setSaving(true);
    try {
      await createNote({
        person_id: personId,
        user_id: firebaseUser.uid,
        text: text.trim(),
        category,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setText("");
        setCategory("General");
        setPersonId("");
        setSearch("");
        closeQuickLog();
      }, 800);
    } catch {
      setSaving(false);
    }
  }

  function handleClose() {
    setText("");
    setCategory("General");
    setPersonId("");
    setSearch("");
    closeQuickLog();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-soft-black/40" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-warm-white rounded-t-2xl md:rounded-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-warm-white/95">
            <div className="text-center">
              <span className="text-4xl">✨</span>
              <p className="mt-2 text-sm font-medium text-coral">Note saved!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark">
          <h2 className="text-base font-semibold text-soft-black">Log a mention</h2>
          <button
            onClick={handleClose}
            className="p-1 text-warm-gray-light hover:text-warm-gray transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Person picker */}
          {!selectedPerson ? (
            <div>
              <label className="block text-sm font-medium text-warm-gray mb-1.5">Who mentioned it?</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral text-sm"
                placeholder="Search people..."
                autoFocus
              />
              <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                {filteredPeople.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => {
                      setPersonId(person.id);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-cream transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center text-coral text-sm font-medium">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-soft-black">{person.name}</p>
                      <p className="text-xs text-warm-gray-light">{person.relationship}</p>
                    </div>
                  </button>
                ))}
                {filteredPeople.length === 0 && (
                  <p className="text-sm text-warm-gray-light py-2 text-center">No people found</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-warm-gray mb-1.5">Person</label>
              <button
                onClick={() => setPersonId("")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cream border border-cream-dark w-full text-left"
              >
                <div className="w-7 h-7 rounded-full bg-coral/10 flex items-center justify-center text-coral text-xs font-medium">
                  {selectedPerson.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-soft-black flex-1">{selectedPerson.name}</span>
                <span className="text-xs text-warm-gray-light">Change</span>
              </button>
            </div>
          )}

          {/* Note text */}
          {selectedPerson && (
            <>
              <div>
                <label className="block text-sm font-medium text-warm-gray mb-1.5">
                  What did they mention?
                </label>
                <textarea
                  ref={textRef}
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, NOTE_MAX_LENGTH))}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral text-sm resize-none"
                  placeholder='e.g. "She said she loves that new Aesop hand cream..."'
                />
                <p className="text-xs text-warm-gray-light mt-1 text-right">
                  {text.length}/{NOTE_MAX_LENGTH}
                </p>
              </div>

              {/* Category chips */}
              <div>
                <label className="block text-sm font-medium text-warm-gray mb-1.5">Category</label>
                <div className="flex flex-wrap gap-2">
                  {NOTE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        category === cat
                          ? "bg-coral text-white"
                          : "bg-cream border border-cream-dark text-warm-gray hover:border-coral/30"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Save button */}
        {selectedPerson && (
          <div className="px-5 py-4 border-t border-cream-dark bg-warm-white">
            <button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              className="w-full py-2.5 bg-coral text-white rounded-lg font-medium text-sm hover:bg-coral-dark transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              {saving ? "Saving..." : "Save note"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
