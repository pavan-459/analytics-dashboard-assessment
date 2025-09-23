import Header from "./components/Header";
import KPICard from "./components/KPICard";
import FilterBar from "./components/FilterBar";
import ModelYearTrend from "./charts/ModelYearTrend";
import TopMakesBar from "./charts/TopMakesBar";
import TypeDonut from "./charts/TypeDonut";
import DataTable from "./components/DataTable";
import useStore from "./state/store";
import { useEffect } from "react";

export default function App() {
  const { status, error, rows, loadData, metrics } = useStore();

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {status === "loading" && <div className="text-gray-500 animate-pulse">Loading data…</div>}
        {status === "error" && <div className="text-red-600">Error: {error}</div>}
        {status === "ready" && (
          <>
            <div className="text-xs text-gray-500">Loaded rows: {rows.length}</div>

            <FilterBar />

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KPICard label="Total Vehicles" value={metrics.total} />
              <KPICard label="BEV" value={metrics.bev} sub="Battery Electric" />
              <KPICard label="PHEV" value={metrics.phev} sub="Plug-in Hybrid" />
              <KPICard label="Unique Makes" value={metrics.uniqueMakes} />
              <KPICard label="Newest Model Year" value={metrics.newestYear ?? '—'} />
              <KPICard label="Oldest Model Year" value={metrics.oldestYear ?? '—'} />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border bg-white p-4 lg:col-span-2">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Registrations by Model Year</h3>
                <ModelYearTrend />
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700">EV Type Distribution</h3>
                <TypeDonut />
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border bg-white p-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Top 10 Makes</h3>
                <TopMakesBar />
              </div>
              <div className="lg:col-span-2 rounded-2xl border bg-white p-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Vehicle Records</h3>
                <DataTable />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

