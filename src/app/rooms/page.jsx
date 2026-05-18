import {
  RiFilter3Line,
  RiFocus3Line,
  RiSearchLine,
  RiSparklingLine,
} from "react-icons/ri";
import RoomCard from "../Components/RoomCard";

const RoomsPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`, {});
  const rooms = await res.json();
  const roomList = Array.isArray(rooms) ? rooms : [];

  const amenityOptions = [
    ...new Set(roomList.flatMap((room) => room.amenities ?? [])),
  ].slice(0, 6);

  const rates = roomList.map((room) => Number(room.hourlyRate) || 0);
  const minRate = rates.length ? Math.min(...rates) : 0;
  const maxRate = rates.length ? Math.max(...rates) : 0;

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-gradient-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/3 size-56 rounded-full bg-violet-200/30 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
                <RiSparklingLine className="size-3.5" />
                Focus spaces
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                Find your next deep-work session
              </h1>
              <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
                Quiet pods, solo alcoves, and group suites — book by the hour
                and stay in the zone.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:shrink-0">
              <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-stone-900">
                  {roomList.length}
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Spaces live
                </p>
              </div>
              {roomList.length > 0 && (
                <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-indigo-600">
                    ${minRate}
                    {maxRate > minRate && (
                      <span className="text-lg text-stone-400">
                        –${maxRate}
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Per hour
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5">
              <div className="flex items-center gap-2 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/60 to-white px-5 py-4">
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-stone-200/80">
                  <RiFilter3Line className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-stone-900">
                    Refine search
                  </h2>
                  <p className="text-xs text-stone-500">Filters coming soon</p>
                </div>
              </div>

              <div className="space-y-6 p-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Search
                  </label>
                  <div className="flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                    <RiSearchLine className="size-4 shrink-0 text-stone-400" />
                    <input
                      type="text"
                      disabled
                      placeholder="Quiet pod, suite…"
                      className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    />
                  </div>
                </div>

                {amenityOptions.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                      Amenities
                    </span>
                    <div className="space-y-2">
                      {amenityOptions.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex cursor-not-allowed items-center gap-3 rounded-full px-3 py-2 text-sm text-stone-600 opacity-70"
                        >
                          <input
                            type="checkbox"
                            disabled
                            className="size-4 rounded-full border-stone-300 text-indigo-600"
                          />
                          <span>{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Hourly rate
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="text-xs text-stone-500">Min</span>
                      <input
                        type="number"
                        disabled
                        placeholder={minRate ? String(minRate) : "0"}
                        className="h-11 w-full rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs text-stone-500">Max</span>
                      <input
                        type="number"
                        disabled
                        placeholder={maxRate ? String(maxRate) : "Any"}
                        className="h-11 w-full rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div>
            {roomList.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-stone-600">
                    Showing{" "}
                    <span className="font-semibold text-stone-900">
                      {roomList.length}
                    </span>{" "}
                    {roomList.length === 1 ? "space" : "spaces"}
                  </p>
                  <span className="hidden items-center gap-1.5 text-xs font-medium text-stone-400 sm:inline-flex">
                    <RiFocus3Line className="size-3.5" />
                    Sorted by availability
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {roomList.map((room) => (
                    <RoomCard key={room._id} room={room} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center ring-1 ring-stone-900/5">
                <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <RiFocus3Line className="size-7" />
                </span>
                <h2 className="text-lg font-semibold text-stone-900">
                  No spaces yet
                </h2>
                <p className="mt-2 max-w-sm text-sm text-stone-500">
                  Check back soon — new focus rooms are added regularly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsPage;
