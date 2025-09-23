import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import useStore from "../state/store";

const COLORS = ["#3b82f6", "#10b981"];

export default function TypeDonut() {
  const data = useStore(s => s.typeSplitSeries());
  const total = data.reduce((a,c)=>a+c.value,0);
  if (!total) return <div className="text-sm text-gray-500">No data for selected filters.</div>;
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={60} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-xs text-gray-500 mt-2">
        Total: {total.toLocaleString()}
      </div>
    </div>
  );
}

