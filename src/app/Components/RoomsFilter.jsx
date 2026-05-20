"use client";

import {
  RiApps2Line,
  RiFilter3Line,
  RiPriceTag3Line,
  RiSearchLine,
} from "react-icons/ri";

const fieldLabel =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500";

const RoomsFilter = ({
  filters,
  amenityOptions,
  minRateGlobal,
  maxRateGlobal,
  onSearchChange,
  onAmenityChange,
  onMinRateChange,
  onMaxRateChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const activeCount = [
    filters.search.trim() ? 1 : 0,
    filters.amenities.length,
    filters.minRate ? 1 : 0,
    filters.maxRate ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(99,102,241,0.06)] ring-1 ring-stone-900/4">
        <div className="relative border-b border-stone-100 bg-linear-to-br from-indigo-50/90 via-white to-violet-50/40 px-5 py-5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-200/60 to-transparent"
          />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100/80">
                <RiFilter3Line className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight text-stone-900">
                  Filters
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                  Narrow spaces by search, amenities, and rate.
                </p>
              </div>
            </div>
            {activeCount > 0 && (
              <span className="shrink-0 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold tabular-nums text-white shadow-sm">
                {activeCount}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-8 p-5">
          <div className="space-y-2.5">
            <label htmlFor="rooms-filter-search" className={fieldLabel}>
              Search
            </label>
            <div className="group relative">
              <RiSearchLine
                className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-indigo-500"
                aria-hidden
              />
              <input
                id="rooms-filter-search"
                type="search"
                value={filters.search}
                onChange={onSearchChange}
                placeholder="Name, Amenities.."
                autoComplete="off"
                className="h-11 w-full rounded-full border border-stone-200 bg-stone-50/80 pl-11 pr-4 text-sm text-stone-900 shadow-inner shadow-white/50 placeholder:text-stone-400 transition-[border,box-shadow] focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {amenityOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RiApps2Line className="size-3.5 text-indigo-500" aria-hidden />
                <span className={fieldLabel}>Amenities</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((amenity) => {
                  const selected = filters.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => onAmenityChange(amenity)}
                      aria-pressed={selected}
                      className={`max-w-full truncate rounded-full border px-3 py-2 text-left text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                        selected
                          ? "border-indigo-200 bg-indigo-50 text-indigo-900 shadow-sm ring-1 ring-indigo-100/80"
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RiPriceTag3Line
                className="size-3.5 text-indigo-500"
                aria-hidden
              />
              <span className={fieldLabel}>Hourly budget ($)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="rooms-filter-min-rate"
                  className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-stone-400"
                >
                  Minimum
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 text-sm font-medium text-stone-400 -translate-y-1/2">
                    $
                  </span>
                  <input
                    id="rooms-filter-min-rate"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={filters.minRate}
                    onChange={onMinRateChange}
                    placeholder={minRateGlobal ? String(minRateGlobal) : "From"}
                    className="h-11 w-full rounded-full border border-stone-200 bg-stone-50/80 pl-8 pr-3 text-sm text-stone-900 tabular-nums transition-[border,box-shadow] focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="rooms-filter-max-rate"
                  className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-stone-400"
                >
                  Maximum
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 text-sm font-medium text-stone-400 -translate-y-1/2">
                    $
                  </span>
                  <input
                    id="rooms-filter-max-rate"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={filters.maxRate}
                    onChange={onMaxRateChange}
                    placeholder={maxRateGlobal ? String(maxRateGlobal) : "To"}
                    className="h-11 w-full rounded-full border border-stone-200 bg-stone-50/80 pl-8 pr-3 text-sm text-stone-900 tabular-nums transition-[border,box-shadow] focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>
            {(minRateGlobal > 0 || maxRateGlobal > 0) && (
              <p className="text-[11px] leading-relaxed text-stone-400">
                Catalog spans{" "}
                <span className="font-medium text-stone-600">
                  ${minRateGlobal}
                  {maxRateGlobal > minRateGlobal ? `–$${maxRateGlobal}` : ""} /
                  hr
                </span>
                .
              </p>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RoomsFilter;
