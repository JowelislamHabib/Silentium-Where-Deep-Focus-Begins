import { RiSparklingLine } from "react-icons/ri";

export default function Loading() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden bg-stone-50 px-4"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/4 size-72 rounded-full bg-indigo-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-1/4 size-64 rounded-full bg-violet-200/25 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="relative flex size-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-indigo-100" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-600" />
          <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <RiSparklingLine className="size-6" aria-hidden />
          </span>
        </div>

        <div className="grid gap-2">
          <p className="font-heading text-2xl font-bold tracking-tight text-stone-900">
            QuietHub
          </p>
          <p className="text-sm font-medium text-stone-500">Loading…</p>
        </div>

        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-1.5 animate-pulse rounded-full bg-indigo-400 [animation-delay:0ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-indigo-400 [animation-delay:150ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-indigo-400 [animation-delay:300ms]" />
        </div>
      </div>
    </section>
  );
}
