import useStore from "../state/store";

export default function FilterBar() {
  const { rows, filters, setFilter, options } = useStore();

  if (!rows?.length) return null;

  return (
    <div className="rounded-2xl border bg-white p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex gap-3 flex-1">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Make</label>
          <select
            className="rounded-lg border px-3 py-2 text-sm"
            value={filters.make}
            onChange={e => setFilter("make", e.target.value)}
          >
            {options.makes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">EV Type</label>
          <select
            className="rounded-lg border px-3 py-2 text-sm"
            value={filters.type}
            onChange={e => setFilter("type", e.target.value)}
          >
            <option value="All">All</option>
            <option value="BEV">BEV</option>
            <option value="PHEV">PHEV</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Year Min</label>
          <input
            type="number"
            className="rounded-lg border px-3 py-2 text-sm w-28"
            value={filters.yearMin ?? ""}
            onChange={e => setFilter("yearMin", Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Year Max</label>
          <input
            type="number"
            className="rounded-lg border px-3 py-2 text-sm w-28"
            value={filters.yearMax ?? ""}
            onChange={e => setFilter("yearMax", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex-1 md:flex-none">
        <label className="text-xs text-gray-500 mb-1 block">Search</label>
        <input
          type="text"
          placeholder="Search make, model, VIN or county…"
          className="rounded-lg border px-3 py-2 text-sm w-full md:w-80"
          value={filters.search}
          onChange={e => setFilter("search", e.target.value)}
        />
      </div>
    </div>
  );
}

