"use client";

import { useState } from "react";
import Link from "next/link";
import { usePeople } from "@/hooks/use-people";
import { useAuth } from "@/providers/auth-provider";
import { useQuickLog } from "@/providers/quick-log-provider";
import { AddPersonModal } from "@/components/person/add-person-modal";
import { daysUntilNextOccurrence } from "@/lib/utils/dates";
import { FREE_TIER_PERSON_LIMIT } from "@/lib/utils/constants";
import type { Person } from "@/types";

export default function PeoplePage() {
  const { user } = useAuth();
  const { people, loading } = usePeople();
  const { openQuickLog } = useQuickLog();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const filtered = search
    ? people.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : people;

  const isPro = user?.subscription_status === "pro";
  const atLimit = !isPro && people.length >= FREE_TIER_PERSON_LIMIT;

  function handleAddPerson() {
    if (atLimit) {
      setShowPaywall(true);
    } else {
      setShowAddModal(true);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-8 w-32 bg-cream-dark rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-cream-dark rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-soft-black">People</h1>
          <p className="text-sm text-warm-gray-light mt-0.5">
            {people.length}{isPro ? "" : `/${FREE_TIER_PERSON_LIMIT}`} people
            {!isPro && (
              <span> · <Link href="/upgrade" className="text-coral hover:underline">Upgrade for unlimited</Link></span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddPerson}
          className="flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add person
        </button>
      </div>

      {/* Search */}
      {people.length > 3 && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-warm-white focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral text-sm"
            placeholder="Search people..."
          />
        </div>
      )}

      {/* People list */}
      <div className="space-y-2">
        {filtered.map((person) => (
          <PersonRow key={person.id} person={person} onLog={() => openQuickLog(person.id)} />
        ))}
      </div>

      {filtered.length === 0 && people.length > 0 && (
        <p className="text-center text-sm text-warm-gray-light py-8">No people match &quot;{search}&quot;</p>
      )}

      {people.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl">👥</span>
          <h2 className="mt-4 text-lg font-semibold text-soft-black">No people yet</h2>
          <p className="mt-1 text-sm text-warm-gray max-w-xs mx-auto">
            Add someone you care about and start logging what they mention.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-2.5 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
          >
            Add your first person
          </button>
        </div>
      )}

      {showAddModal && <AddPersonModal onClose={() => setShowAddModal(false)} />}

      {showPaywall && (
        <PaywallModal
          noteCount={people.reduce((sum, p) => sum + p.notes_count, 0)}
          peopleCount={people.length}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
}

function PersonRow({ person, onLog }: { person: Person; onLog: () => void }) {
  const daysUntil = person.birthday ? daysUntilNextOccurrence(person.birthday) : null;

  return (
    <div className="flex items-center gap-3 p-4 bg-warm-white rounded-xl border border-cream-dark hover:border-coral/30 transition-colors">
      <Link href={`/people/${person.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral font-semibold shrink-0">
          {person.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-soft-black truncate">{person.name}</p>
          <p className="text-xs text-warm-gray-light">
            {person.relationship} · {person.notes_count} {person.notes_count === 1 ? "note" : "notes"}
          </p>
        </div>
      </Link>
      {daysUntil !== null && daysUntil <= 30 && (
        <div className={`text-right mr-2 ${daysUntil <= 7 ? "text-coral" : "text-warm-gray"}`}>
          <p className="text-sm font-semibold">{daysUntil}d</p>
          <p className="text-[10px]">birthday</p>
        </div>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          onLog();
        }}
        className="shrink-0 p-2 text-warm-gray-light hover:text-coral hover:bg-coral/5 rounded-lg transition-colors"
        title="Log a mention"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}

function PaywallModal({
  noteCount,
  peopleCount,
  onClose,
}: {
  noteCount: number;
  peopleCount: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-soft-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-warm-white rounded-2xl shadow-xl p-8 text-center">
        <span className="text-4xl">🎁</span>
        <h2 className="mt-4 text-xl font-semibold text-soft-black">You&apos;ve filled your free plan</h2>
        <p className="mt-2 text-sm text-warm-gray">
          You&apos;ve tracked {noteCount} notes for {peopleCount} people. Upgrade to Pro for unlimited people,
          AI gift suggestions, and more.
        </p>
        <Link
          href="/upgrade"
          className="inline-block mt-6 px-8 py-3 bg-coral text-white rounded-lg font-medium text-sm hover:bg-coral-dark transition-colors"
        >
          Upgrade to Pro
        </Link>
        <button onClick={onClose} className="block w-full mt-3 text-sm text-warm-gray-light hover:text-warm-gray">
          Maybe later
        </button>
      </div>
    </div>
  );
}
