export function computeMetrics(rows) {
  const total = rows.length;
  const typeCounts = rows.reduce((acc, r) => {
    acc[r.EVType] = (acc[r.EVType] || 0) + 1;
    return acc;
  }, {});
  const makes = new Set(rows.map(r => r.Make).filter(Boolean));
  const years = rows.map(r => r.ModelYear).filter(Number.isFinite);
  const newestYear = years.length ? Math.max(...years) : null;
  const oldestYear = years.length ? Math.min(...years) : null;
  return {
    total,
    bev: typeCounts.BEV || 0,
    phev: typeCounts.PHEV || 0,
    uniqueMakes: makes.size,
    newestYear,
    oldestYear
  };
}

export function uniqueValues(rows, key) {
  return Array.from(new Set(rows.map(r => r[key]).filter(Boolean)));
}

export function yearExtent(rows) {
  const years = rows.map(r => r.ModelYear).filter(Number.isFinite);
  if (!years.length) return [null, null];
  return [Math.min(...years), Math.max(...years)];
}

export function filterRows(rows, filters) {
  const { make, type, yearMin, yearMax, search } = filters;
  const s = String(search || "").toLowerCase();
  return rows.filter(r => {
    if (make !== "All" && r.Make !== make) return false;
    if (type !== "All" && r.EVType !== type) return false;
    if (typeof yearMin === "number" && r.ModelYear < yearMin) return false;
    if (typeof yearMax === "number" && r.ModelYear > yearMax) return false;
    if (s) {
      const blob = `${r.Make} ${r["Model"] || ""} ${r["VIN (1-10)"] || ""} ${r["County"] || ""}`.toLowerCase();
      if (!blob.includes(s)) return false;
    }
    return true;
  });
}

export function yearBuckets(rows) {
  const map = new Map();
  for (const r of rows) {
    const y = r.ModelYear;
    if (!Number.isFinite(y)) continue;
    map.set(y, (map.get(y) || 0) + 1);
  }
  return Array.from(map.entries()).sort((a,b)=>a[0]-b[0]);
}

export function makeCounts(rows) {
  const map = new Map();
  for (const r of rows) {
    const m = r.Make;
    if (!m) continue;
    map.set(m, (map.get(m) || 0) + 1);
  }
  return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]);
}

export function typeCounts(rows) {
  return rows.reduce((acc, r) => {
    acc[r.EVType] = (acc[r.EVType] || 0) + 1;
    return acc;
  }, {});
}

