// src/state/store.js
import { create } from "zustand";

const API = "/.netlify/functions/vehicles"; // Netlify Functions base

const initialFilters = {
  make: "All",
  type: "All",
  yearMin: "",
  yearMax: "",
  search: "",
};

export default create((set, get) => ({
  status: "idle",
  error: null,
  rows: [],
  filters: initialFilters,
  pagination: { page: 1, pageSize: 50 },
  total: 0,
  metrics: {
    total: 0,
    bev: 0,
    phev: 0,
    uniqueMakes: 0,
    newestYear: null,
    oldestYear: null,
  },

  setFilter: (key, value) =>
    set((s) => ({
      filters: { ...s.filters, [key]: value },
      pagination: { ...s.pagination, page: 1 },
    })),
  setPage: (page) => set((s) => ({ pagination: { ...s.pagination, page } })),
  setPageSize: (pageSize) => set(() => ({ pagination: { page: 1, pageSize } })),

  // fetch current page
  loadPage: async () => {
    set({ status: "loading", error: null });
    const f = get().filters,
      p = get().pagination;
    const q = new URLSearchParams({
      page: String(p.page),
      pageSize: String(p.pageSize),
      make: f.make,
      type: f.type,
      yearMin: String(f.yearMin || ""),
      yearMax: String(f.yearMax || ""),
      search: f.search,
    });
    try {
      const r = await fetch(`${API}?${q.toString()}`);
      const { rows, total, page, pageSize } = await r.json();
      set({ rows, total, pagination: { page, pageSize }, status: "ready" });
    } catch (e) {
      set({ status: "error", error: e.message });
    }
  },

  // fetch aggregates for KPIs/charts
  loadMetrics: async () => {
    const f = get().filters;
    const q = new URLSearchParams({ ...f, mode: "metrics" });
    const r = await fetch(`${API}?${q.toString()}`);
    const { metrics } = await r.json();
    set({ metrics });
  },

  loadYearTrend: async () => {
    const f = get().filters;
    const q = new URLSearchParams({ ...f, mode: "yearTrend" });
    const r = await fetch(`${API}?${q.toString()}`);
    const { series } = await r.json();
    return series;
  },

  loadTopMakes: async (k = 10) => {
    const f = get().filters;
    const q = new URLSearchParams({ ...f, mode: "topMakes", k: String(k) });
    const r = await fetch(`${API}?${q.toString()}`);
    const { series } = await r.json();
    return series;
  },

  loadTypeSplit: async () => {
    const f = get().filters;
    const q = new URLSearchParams({ ...f, mode: "typeSplit" });
    const r = await fetch(`${API}?${q.toString()}`);
    const { series } = await r.json();
    return series;
  },
}));
