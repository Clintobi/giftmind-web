"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useQuickLog } from "@/providers/quick-log-provider";
import { useNotes } from "@/hooks/use-notes";
import { usePersonOccasions } from "@/hooks/use-occasions";
import { getPerson, deletePerson, markNoteAsGiven, createGiftCard, createOccasion } from "@/lib/firebase/firestore";
import { daysUntilNextOccurrence, formatDate, formatMonthDay, daysSince } from "@/lib/utils/dates";
import { SuggestionsPanel } from "@/components/ai/suggestions-panel";
import { ShareMoment } from "@/components/gift-reveal/share-moment";
import type { Person, Note, NoteCategory, OccasionType } from "@/types";
import { OCCASION_TYPES } from "@/types";

export default function PersonPage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = use(params);
  const { firebaseUser, user } = useAuth();
  const router = useRouter();
  const { openQuickLog } = useQuickLog();

  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const { notes } = useNotes(personId);
  const { occasions } = usePersonOccasions(personId);
  const [shareCard, setShareCard] = useState<{ cardId: string; note: Note; person: Person } | null>(null);
  const [showOccasionForm, setShowOccasionForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getPerson(personId).then((p) => {
      setPerson(p);
      setLoading(false);
    });
  }, [personId]);

  const handleMarkAsGiven = useCallback(
    async (note: Note) => {
      if (!firebaseUser || !person) return;
      const days = daysSince(note.created_at);
      const cardId = await createGiftCard({
        user_id: firebaseUser.uid,
        person_id: person.id,
        note_id: note.id,
        person_name: person.name,
        note_text: note.text,
        note_category: note.category,
        days_remembered: days,
      });
      await markNoteAsGiven(note.id, cardId);
      setShareCard({ cardId, note, person });
    },
    [firebaseUser, person]
  );

  async function handleDelete() {
    if (!firebaseUser || !person) return;
    await deletePerson(person.id, firebaseUser.uid);
    router.push("/people");
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-40 bg-cream-dark rounded" />
        <div className="h-24 bg-cream-dark rounded-xl" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-warm-gray">Person not found.</p>
      </div>
    );
  }

  const activeNotes = notes.filter((n) => n.status === "active");
  const givenNotes = notes.filter((n) => n.status === "given");
  const isPro = user?.subscription_status === "pro";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {shareCard && (
        <ShareMoment
          cardId={shareCard.cardId}
          personName={shareCard.person.name}
          noteText={shareCard.note.text}
          daysRemembered={daysSince(shareCard.note.created_at)}
          onClose={() => setShareCard(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center text-coral text-2xl font-semibold shrink-0">
          {person.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-soft-black">{person.name}</h1>
          <p className="text-sm text-warm-gray-light">{person.relationship}</p>
          {person.birthday && (
            <p className="text-sm text-warm-gray mt-1">
              🎂 {formatMonthDay(person.birthday)} — <span className="text-coral font-medium">{daysUntilNextOccurrence(person.birthday)} days away</span>
            </p>
          )}
        </div>
        <button
          onClick={() => openQuickLog(person.id)}
          className="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors shrink-0"
        >
          + Log
        </button>
      </div>

      {/* Occasions */}
      {occasions.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-warm-gray">Occasions</h2>
          <div className="flex flex-wrap gap-2">
            {occasions.map((occ) => (
              <div
                key={occ.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-warm-white rounded-full border border-cream-dark text-xs"
              >
                <span className="font-medium text-soft-black">{occ.custom_name || occ.type}</span>
                <span className="text-warm-gray-light">{formatMonthDay(occ.date)}</span>
                <span className={`font-semibold ${daysUntilNextOccurrence(occ.date) <= 7 ? "text-coral" : "text-warm-gray"}`}>
                  {daysUntilNextOccurrence(occ.date)}d
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <button
        onClick={() => setShowOccasionForm(!showOccasionForm)}
        className="text-sm text-coral hover:underline"
      >
        + Add occasion
      </button>

      {showOccasionForm && (
        <OccasionForm
          personId={person.id}
          userId={firebaseUser!.uid}
          onDone={() => setShowOccasionForm(false)}
        />
      )}

      {/* Active notes */}
      <section>
        <h2 className="text-sm font-semibold text-warm-gray mb-3">
          Notes ({activeNotes.length})
        </h2>
        {activeNotes.length === 0 ? (
          <div className="text-center py-8 bg-warm-white rounded-xl border border-cream-dark">
            <p className="text-sm text-warm-gray-light">No notes yet. Log what {person.name} mentions!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeNotes.map((note) => (
              <NoteItem key={note.id} note={note} onMarkAsGiven={handleMarkAsGiven} />
            ))}
          </div>
        )}
      </section>

      {/* AI Suggestions */}
      {isPro && activeNotes.length >= 2 && (
        <SuggestionsPanel personId={person.id} personName={person.name} />
      )}
      {!isPro && activeNotes.length >= 2 && (
        <div className="p-6 bg-warm-white rounded-xl border border-cream-dark text-center">
          <span className="text-2xl">✨</span>
          <h3 className="mt-2 text-sm font-semibold text-soft-black">AI Gift Suggestions</h3>
          <p className="text-xs text-warm-gray mt-1">
            Upgrade to Pro to get personalized gift ideas based on {person.name}&apos;s notes.
          </p>
          <a href="/upgrade" className="inline-block mt-3 px-4 py-2 bg-coral text-white rounded-lg text-xs font-medium hover:bg-coral-dark">
            Upgrade to Pro
          </a>
        </div>
      )}

      {/* Gift history */}
      {givenNotes.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-warm-gray mb-3">
            Gift history ({givenNotes.length})
          </h2>
          <div className="space-y-2">
            {givenNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center gap-3 px-4 py-3 bg-warm-white rounded-xl border border-cream-dark opacity-75"
              >
                <span className="text-lg">🎁</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-soft-black">{note.text}</p>
                  <p className="text-xs text-warm-gray-light mt-0.5">
                    Given {note.given_at ? formatDate(note.given_at) : ""}
                  </p>
                </div>
                <CategoryBadge category={note.category} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Danger zone */}
      <div className="pt-6 border-t border-cream-dark">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-warm-gray-light hover:text-red-500 transition-colors"
          >
            Delete {person.name}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-500">Are you sure? This deletes all notes too.</span>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 text-xs text-warm-gray hover:text-soft-black"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteItem({ note, onMarkAsGiven }: { note: Note; onMarkAsGiven: (note: Note) => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-warm-white rounded-xl border border-cream-dark">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-soft-black">{note.text}</p>
        <p className="text-xs text-warm-gray-light mt-1">{formatDate(note.created_at)}</p>
      </div>
      <CategoryBadge category={note.category} />
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="shrink-0 px-2.5 py-1 text-xs text-warm-gray border border-cream-dark rounded-lg hover:border-coral hover:text-coral transition-colors"
        >
          Given
        </button>
      ) : (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMarkAsGiven(note)}
            className="px-2.5 py-1 text-xs bg-coral text-white rounded-lg hover:bg-coral-dark"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-2 py-1 text-xs text-warm-gray-light hover:text-warm-gray"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryBadge({ category }: { category: NoteCategory }) {
  const colors: Record<NoteCategory, string> = {
    General: "bg-cream-dark text-warm-gray",
    Product: "bg-sky/10 text-sky-dark",
    Experience: "bg-coral/10 text-coral",
    Book: "bg-amber-50 text-amber-700",
    Food: "bg-green-50 text-green-700",
    Place: "bg-purple-50 text-purple-700",
    Other: "bg-cream-dark text-warm-gray",
  };

  return (
    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[category]}`}>
      {category}
    </span>
  );
}

function OccasionForm({
  personId,
  userId,
  onDone,
}: {
  personId: string;
  userId: string;
  onDone: () => void;
}) {
  const [type, setType] = useState<OccasionType>("Birthday");
  const [customName, setCustomName] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!date) return;
    setSaving(true);
    await createOccasion({
      person_id: personId,
      user_id: userId,
      type,
      custom_name: type === "Custom" ? customName : undefined,
      date: new Date(date + "T00:00:00"),
    });
    onDone();
  }

  return (
    <div className="p-4 bg-warm-white rounded-xl border border-cream-dark space-y-3">
      <div className="flex flex-wrap gap-2">
        {OCCASION_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              type === t
                ? "bg-coral text-white"
                : "bg-cream border border-cream-dark text-warm-gray hover:border-coral/30"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {type === "Custom" && (
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
          placeholder="Occasion name"
        />
      )}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!date || saving}
          className="px-4 py-2 bg-coral text-white rounded-lg text-xs font-medium hover:bg-coral-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add occasion"}
        </button>
        <button onClick={onDone} className="px-4 py-2 text-xs text-warm-gray hover:text-soft-black">
          Cancel
        </button>
      </div>
    </div>
  );
}
