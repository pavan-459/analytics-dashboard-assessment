import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import useStore from "../state/store";

export default function ModelYearTrend() {
  const data = useStore(s => s.modelYearSeries());
  if (!data?.length) return <div className="text-sm text-gray-500">No data for selected filters.</div>;
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#g)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

