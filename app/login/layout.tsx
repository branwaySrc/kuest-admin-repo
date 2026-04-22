export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Premium Background Effects (SSR) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-1/4 left-1/3 h-[40%] w-[40%] animate-pulse rounded-full blur-[150px]" />
        <div className="absolute right-1/3 bottom-1/4 h-[30%] w-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>
      <div className="z-10 w-full max-w-2xl">{children}</div>
    </main>
  )
}
