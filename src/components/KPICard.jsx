export default function KPICard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-semibold">{value}</div>
      {sub ? <div className="text-xs text-gray-400">{sub}</div> : null}
    </div>
  );
}

