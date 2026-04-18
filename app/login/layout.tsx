export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      {/* Premium Background Effects (SSR) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 h-[40%] w-[40%] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 h-[30%] w-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}
