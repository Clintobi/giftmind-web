"use client";

import { usePeople } from "@/hooks/use-people";
import { useOccasions } from "@/hooks/use-occasions";
import { useAuth } from "@/providers/auth-provider";
import { useQuickLog } from "@/providers/quick-log-provider";
import { daysUntilNextOccurrence, formatMonthDay } from "@/lib/utils/dates";
import Link from "next/link";
import type { Person, Occasion } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { people, loading: peopleLoading } = usePeople();
  const { occasions, loading: occasionsLoading } = useOccasions();
  const { openQuickLog } = useQuickLog();

  if (peopleLoading || occasionsLoading) {
    return <DashboardSkeleton />;
  }

  // Build upcoming occasions with person data
  const upcoming = occasions
    .map((occ) => ({
      ...occ,
      person: people.find((p) => p.id === occ.person_id),
      daysUntil: daysUntilNextOccurrence(occ.date),
    }))
    .filter((o) => o.person)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 6);

  // Also include people with birthdays
  const birthdayPeople = people
    .filter((p) => p.birthday)
    .map((p) => ({
      person: p,
      daysUntil: daysUntilNextOccurrence(p.birthday!),
      type: "Birthday" as const,
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-soft-black">
          {getGreeting()}, {user?.display_name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-warm-gray mt-1">
          You&apos;re tracking {people.length} {people.length === 1 ? "person" : "people"}.
          {user?.subscription_status !== "pro" && (
            <span className="text-warm-gray-light"> ({people.length}/10 free)</span>
          )}
        </p>
      </div>

      {/* Quick-log CTA */}
      <button
        onClick={() => openQuickLog()}
        className="w-full flex items-center gap-4 p-5 bg-warm-white rounded-xl border border-cream-dark hover:border-coral/30 transition-colors group"
      >
        <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center group-hover:bg-coral/20 transition-colors">
          <svg className="w-6 h-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-soft-black">Log a mention</p>
          <p className="text-xs text-warm-gray-light">Someone said something they love? Capture it now.</p>
        </div>
      </button>

      {/* Privacy badge */}
      <div className="flex items-center gap-2 text-xs text-warm-gray-light">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Your notes are private. Only you can see them.
      </div>

      {/* Upcoming birthdays */}
      {birthdayPeople.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-soft-black mb-3">Upcoming birthdays</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {birthdayPeople.map(({ person, daysUntil }) => (
              <BirthdayCard key={person.id} person={person} daysUntil={daysUntil} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming occasions */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-soft-black mb-3">Upcoming occasions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.map((occ) => (
              <OccasionCard key={occ.id} occasion={occ} person={occ.person!} daysUntil={occ.daysUntil} />
            ))}
          </div>
        </section>
      )}

      {/* People overview */}
      {people.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-soft-black">Your people</h2>
            <Link href="/people" className="text-sm text-coral hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {people.slice(0, 8).map((person) => (
              <Link
                key={person.id}
                href={`/people/${person.id}`}
                className="flex flex-col items-center p-4 bg-warm-white rounded-xl border border-cream-dark hover:border-coral/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-coral font-semibold text-lg">
                  {person.name.charAt(0)}
                </div>
                <p className="mt-2 text-sm font-medium text-soft-black truncate w-full text-center">
                  {person.name}
                </p>
                <p className="text-xs text-warm-gray-light">
                  {person.notes_count} {person.notes_count === 1 ? "note" : "notes"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {people.length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl">🎁</span>
          <h2 className="mt-4 text-lg font-semibold text-soft-black">Start by adding someone you care about</h2>
          <p className="mt-1 text-sm text-warm-gray max-w-sm mx-auto">
            Add a person, then log what they mention they love. You&apos;ll never give a bad gift again.
          </p>
          <Link
            href="/people"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
          >
            Add your first person
          </Link>
        </div>
      )}
    </div>
  );
}

function BirthdayCard({ person, daysUntil }: { person: Person; daysUntil: number }) {
  return (
    <Link
      href={`/people/${person.id}`}
      className="flex items-center gap-3 p-4 bg-warm-white rounded-xl border border-cream-dark hover:border-coral/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral font-semibold">
        {person.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-soft-black truncate">{person.name}</p>
        <p className="text-xs text-warm-gray-light">
          {person.birthday && formatMonthDay(person.birthday)}
        </p>
      </div>
      <div className={`text-right ${daysUntil <= 7 ? "text-coral" : "text-warm-gray"}`}>
        <p className="text-lg font-semibold">{daysUntil}</p>
        <p className="text-[10px]">days</p>
      </div>
    </Link>
  );
}

function OccasionCard({
  occasion,
  person,
  daysUntil,
}: {
  occasion: Occasion;
  person: Person;
  daysUntil: number;
}) {
  return (
    <Link
      href={`/people/${person.id}`}
      className="flex items-center gap-3 p-4 bg-warm-white rounded-xl border border-cream-dark hover:border-coral/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-sky/10 flex items-center justify-center text-sky-dark font-semibold">
        {person.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-soft-black truncate">{person.name}</p>
        <p className="text-xs text-warm-gray-light">{occasion.custom_name || occasion.type}</p>
      </div>
      <div className={`text-right ${daysUntil <= 7 ? "text-coral" : "text-warm-gray"}`}>
        <p className="text-lg font-semibold">{daysUntil}</p>
        <p className="text-[10px]">days</p>
      </div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-cream-dark rounded" />
      <div className="h-20 bg-cream-dark rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-cream-dark rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
