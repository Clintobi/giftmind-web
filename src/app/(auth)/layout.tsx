export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🎁</span>
          <h1 className="text-2xl font-semibold text-coral mt-2">GiftMind</h1>
          <p className="text-sm text-warm-gray mt-1">
            Never forget what the people you love mention
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
