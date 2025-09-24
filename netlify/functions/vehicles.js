// Netlify function URL: /.netlify/functions/vehicles
import fs from "fs";
import path from "path";
import Papa from "papaparse";

let CACHE = null;

function loadCSV() {
  if (CACHE) return CACHE;
  const csvPath = path.join(
    process.cwd(),
    "data-to-visualize",
    "Electric_Vehicle_Population_Data.csv"
  );
  const text = fs.readFileSync(csvPath, "utf-8");
  const parsed = Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  const rows = parsed.data.map((r) => {
    const Make = String(r["Make"] || "").trim();
    const EVType = String(r["Electric Vehicle Type"] || "").includes("Battery")
      ? "BEV"
      : String(r["Electric Vehicle Type"] || "").includes("Plug-in")
      ? "PHEV"
      : String(r["Electric Vehicle Type"] || "").trim();
    const ModelYear = Number(r["Model Year"]);
    const searchBlob = `${Make} ${r["Model"] || ""} ${r["VIN (1-10)"] || ""} ${
      r["County"] || ""
    }`.toLowerCase();
    return { ...r, Make, EVType, ModelYear, searchBlob };
  });
  CACHE = rows;
  return rows;
}

function filterRows(rows, q) {
  let {
    make = "All",
    type = "All",
    yearMin = "",
    yearMax = "",
    search = "",
  } = q;
  const s = String(search || "").toLowerCase();
  const ymin = yearMin ? Number(yearMin) : -Infinity;
  const ymax = yearMax ? Number(yearMax) : Infinity;

  return rows.filter((r) => {
    if (make !== "All" && r.Make !== make) return false;
    if (type !== "All" && r.EVType !== type) return false;
    if (
      Number.isFinite(r.ModelYear) &&
      (r.ModelYear < ymin || r.ModelYear > ymax)
    )
      return false;
    if (s && !(r.searchBlob || "").includes(s)) return false;
    return true;
  });
}

function aggMetrics(rows) {
  const total = rows.length;
  const tc = rows.reduce(
    (a, r) => ((a[r.EVType] = (a[r.EVType] || 0) + 1), a),
    {}
  );
  const makes = new Set(rows.map((r) => r.Make).filter(Boolean));
  const years = rows.map((r) => r.ModelYear).filter(Number.isFinite);
  return {
    total,
    bev: tc.BEV || 0,
    phev: tc.PHEV || 0,
    uniqueMakes: makes.size,
    newestYear: years.length ? Math.max(...years) : null,
    oldestYear: years.length ? Math.min(...years) : null,
  };
}

function aggYearTrend(rows) {
  const map = new Map();
  for (const r of rows) {
    if (!Number.isFinite(r.ModelYear)) continue;
    map.set(r.ModelYear, (map.get(r.ModelYear) || 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year, count }));
}

function aggTopMakes(rows, k = 10) {
  const map = new Map();
  for (const r of rows) {
    const m = r.Make;
    if (!m) continue;
    map.set(m, (map.get(m) || 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([make, count]) => ({ make, count }));
}

function aggTypeSplit(rows) {
  const tc = rows.reduce(
    (a, r) => ((a[r.EVType] = (a[r.EVType] || 0) + 1), a),
    {}
  );
  return [
    { name: "BEV", value: tc.BEV || 0 },
    { name: "PHEV", value: tc.PHEV || 0 },
  ];
}

export async function handler(event) {
  try {
    const rows = loadCSV();
    const params = event.queryStringParameters || {};
    const mode = params.mode || "page"; // page | metrics | yearTrend | topMakes | typeSplit

    if (mode === "metrics") {
      const filtered = filterRows(rows, params);
      return resp({ metrics: aggMetrics(filtered) });
    }

    if (mode === "yearTrend") {
      const filtered = filterRows(rows, params);
      return resp({ series: aggYearTrend(filtered) });
    }

    if (mode === "topMakes") {
      const filtered = filterRows(rows, params);
      const k = Number(params.k || 10);
      return resp({ series: aggTopMakes(filtered, k) });
    }

    if (mode === "typeSplit") {
      const filtered = filterRows(rows, params);
      return resp({ series: aggTypeSplit(filtered) });
    }

    // default: paginated rows
    const filtered = filterRows(rows, params);
    const page = Math.max(1, Number(params.page || 1));
    const pageSize = Math.max(1, Number(params.pageSize || 50));
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);

    return resp({
      rows: slice,
      page,
      pageSize,
      total: filtered.length,
    });
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}

function resp(obj) {
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
    body: JSON.stringify(obj),
  };
}
