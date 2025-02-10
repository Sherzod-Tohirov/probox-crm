import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Chart() {
  const data = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
    { name: "Jul", sales: 3490, revenue: 4300 },
  ];

  return (
    <div style={{ width: "100%", minHeight: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#666" }}
            axisLine={{ stroke: "#eee" }}
          />
          <YAxis tick={{ fill: "#666" }} axisLine={{ stroke: "#eee" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#0088FE"
            strokeWidth={2}
            dot={{ fill: "#0088FE" }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#00C49F"
            strokeWidth={2}
            dot={{ fill: "#00C49F" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
