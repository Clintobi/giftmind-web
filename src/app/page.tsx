import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <span className="text-xl font-semibold text-coral">GiftMind</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-warm-gray hover:text-soft-black transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-32 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-soft-black leading-tight">
          Never forget what the people you love{" "}
          <span className="text-coral">mention</span>
        </h1>
        <p className="mt-6 text-lg text-warm-gray max-w-2xl mx-auto">
          Someone you love says they want something. You nod. Six months later, it&apos;s their birthday
          and you&apos;re panic-buying at 11pm. GiftMind fixes that.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-coral text-white rounded-xl text-base font-medium hover:bg-coral-dark transition-colors shadow-sm"
          >
            Start remembering — it&apos;s free
          </Link>
          <p className="text-xs text-warm-gray-light">Free for 10 people. No credit card needed.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-warm-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-soft-black text-center mb-12">
            Three steps to the perfect gift
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Log a mention"
              description="Someone says they love a coffee brand, want a specific book, or dream about a trip. Log it in 10 seconds."
              icon="📝"
            />
            <Step
              number="2"
              title="Get reminded"
              description="GiftMind reminds you 30, 7, and 1 day before their birthday or any occasion. You're never caught off guard."
              icon="🔔"
            />
            <Step
              number="3"
              title="Give the perfect gift"
              description="AI suggests the perfect gift based on everything you've noted. They'll wonder how you always know exactly what they want."
              icon="🎁"
            />
          </div>
        </div>
      </section>

      {/* The moment */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="p-8 md:p-12 bg-warm-white rounded-2xl border border-cream-dark">
          <p className="text-xl md:text-2xl text-soft-black leading-relaxed font-medium">
            &ldquo;Wait... I mentioned that back in August. How did you remember?&rdquo;
          </p>
          <p className="mt-6 text-sm text-warm-gray">
            That&apos;s the conversation that happens after every perfectly remembered gift.
            The giver is proud. The recipient is touched. And GiftMind is how it happened.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-warm-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-soft-black text-center mb-12">
            Private, personal, powerful
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Feature
              title="Single-player by design"
              description="No one else needs to use the app. No sharing, no social features. Just you, remembering."
              icon="🔒"
            />
            <Feature
              title="AI gift suggestions"
              description="Claude analyzes your notes and suggests specific, purchasable gifts with links. Powered by what people actually mentioned."
              icon="✨"
            />
            <Feature
              title="Birthday reminders"
              description="Get reminded 30, 7, and 1 day before. Never scramble for a gift again."
              icon="🎂"
            />
            <Feature
              title="Gift history"
              description="Track every gift you've given. See what worked, what was loved, and plan better next time."
              icon="📖"
            />
            <Feature
              title="Quick logging"
              description="Log a mention in under 10 seconds. Open the app, pick a person, type what they said, done."
              icon="⚡"
            />
            <Feature
              title="Gift Reveal Cards"
              description="When you give a gift, share a beautiful card showing how long you've been remembering. They'll be moved."
              icon="💌"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-soft-black text-center mb-4">
          Simple pricing
        </h2>
        <p className="text-sm text-warm-gray text-center mb-12">
          Start free. Upgrade when you need unlimited people and AI suggestions.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="p-6 bg-warm-white rounded-2xl border border-cream-dark">
            <h3 className="text-lg font-semibold text-soft-black">Free</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-soft-black">$0</span>
              <span className="text-sm text-warm-gray">/forever</span>
            </div>
            <ul className="mt-6 space-y-2">
              {["Up to 10 people", "Unlimited notes", "Birthday reminders", "Gift history (last 3)"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-warm-gray">
                  <svg className="w-4 h-4 text-warm-gray-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full mt-6 py-2.5 text-center border border-cream-dark rounded-lg text-sm font-medium text-warm-gray hover:bg-cream transition-colors"
            >
              Get started
            </Link>
          </div>

          <div className="relative p-6 bg-warm-white rounded-2xl border-2 border-coral">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-coral text-white rounded-full text-xs font-medium">
              Most popular
            </div>
            <h3 className="text-lg font-semibold text-soft-black">Pro</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-soft-black">$4.99</span>
              <span className="text-sm text-warm-gray">/month</span>
            </div>
            <p className="text-xs text-warm-gray-light mt-1">or $29.99/year (save 50%)</p>
            <ul className="mt-6 space-y-2">
              {[
                "Unlimited people",
                "AI gift suggestions",
                "All occasion types",
                "Full gift history",
                "Budget tracker",
                "Gift Reveal Cards",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-soft-black">
                  <svg className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full mt-6 py-2.5 text-center bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center bg-warm-white">
        <h2 className="text-2xl md:text-3xl font-bold text-soft-black">
          She asked how I remembered.
        </h2>
        <p className="mt-2 text-lg text-coral font-medium">I told her.</p>
        <Link
          href="/signup"
          className="inline-block mt-8 px-8 py-3.5 bg-coral text-white rounded-xl text-base font-medium hover:bg-coral-dark transition-colors shadow-sm"
        >
          Start remembering
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-warm-gray-light border-t border-cream-dark">
        <p>GiftMind · VNSIS Technologies Limited · {new Date().getFullYear()}</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <a href="#" className="hover:text-warm-gray">Privacy</a>
          <a href="#" className="hover:text-warm-gray">Terms</a>
          <a href="#" className="hover:text-warm-gray">Support</a>
        </div>
      </footer>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cream text-3xl mb-4">
        {icon}
      </div>
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-coral text-white text-xs font-bold mb-2">
        {number}
      </div>
      <h3 className="text-base font-semibold text-soft-black">{title}</h3>
      <p className="mt-2 text-sm text-warm-gray leading-relaxed">{description}</p>
    </div>
  );
}

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="flex gap-4 p-5 bg-cream rounded-xl">
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <h3 className="text-sm font-semibold text-soft-black">{title}</h3>
        <p className="mt-1 text-xs text-warm-gray leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
