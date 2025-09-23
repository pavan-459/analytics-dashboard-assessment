import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import useStore from "../state/store";

export default function TopMakesBar() {
  const data = useStore(s => s.topMakeSeries(10));
  if (!data?.length) return <div className="text-sm text-gray-500">No data for selected filters.</div>;
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 16, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="make" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" height={60}/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

