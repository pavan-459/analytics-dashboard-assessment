import { create } from "zustand";
import Papa from "papaparse";
import { computeMetrics, filterRows, uniqueValues, yearExtent, yearBuckets, makeCounts, typeCounts } from "../lib/evSelectors";
// Import CSV as raw string (no fetch needed)
import csvText from "../../data-to-visualize/Electric_Vehicle_Population_Data.csv?raw";

const initialFilters = {
  make: "All",
  type: "All", // 'BEV' | 'PHEV' | 'All'
  yearMin: null,
  yearMax: null,
  search: ""
};

const useStore = create((set, get) => ({
  status: "idle",
  error: null,
  rows: [],
  filters: initialFilters,
  options: { makes: ["All"], years: [] },
  metrics: {
    total: 0, bev: 0, phev: 0, uniqueMakes: 0, newestYear: null, oldestYear: null
  },

  loadData: () => {
    set({ status: "loading", error: null });
    try {
      const parsed = Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      const rows = parsed.data.map(r => ({
        ...r,
        Make: String(r["Make"] || "").trim(),
        EVType: String(r["Electric Vehicle Type"] || "").includes("Battery") ? "BEV"
               : String(r["Electric Vehicle Type"] || "").includes("Plug-in") ? "PHEV"
               : String(r["Electric Vehicle Type"] || "").trim(),
        ModelYear: Number(r["Model Year"])
      }));

      const [ymin, ymax] = yearExtent(rows);
      const makes = ["All", ...uniqueValues(rows, "Make").sort()];
      const filters = { ...initialFilters, yearMin: ymin, yearMax: ymax };

      set({
        status: "ready",
        rows,
        filters,
        options: { makes, years: Array.from({length: ymax - ymin + 1}, (_,i)=>ymin+i) },
        metrics: computeMetrics(rows)
      });
    } catch (e) {
      set({ status: "error", error: e?.message || "Failed to parse CSV" });
    }
  },

  setFilter: (key, value) => {
    const filters = { ...get().filters, [key]: value };
    set({ filters });
  },

  // Derived selectors as functions (components can call them)
  filteredRows: () => {
    return filterRows(get().rows, get().filters);
  },

  // Chart data
  modelYearSeries: () => {
    const fr = get().filteredRows();
    return yearBuckets(fr).map(([year, count]) => ({ year, count }));
  },

  topMakeSeries: (k=10) => {
    const fr = get().filteredRows();
    const mc = makeCounts(fr);
    return mc.slice(0, k).map(([make, count]) => ({ make, count }));
  },

  typeSplitSeries: () => {
    const fr = get().filteredRows();
    const tc = typeCounts(fr);
    return [
      { name: "BEV", value: tc.BEV || 0 },
      { name: "PHEV", value: tc.PHEV || 0 }
    ];
  }
}));

export default useStore;

