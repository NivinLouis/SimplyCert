'use client';

export default function AppHeader() {
  return (
    <header className="w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-500/20">
            S
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-foreground">SimplyCert</p>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Batch Certificate Generator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
