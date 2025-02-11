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
    { name: "Mar", sales: 2000, revenue: 4400 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
    { name: "Jul", sales: 3490, revenue: 4300 },
    { name: "Aug", sales: 3550, revenue: 4500 },
    { name: "Sep", sales: 4500, revenue: 6500 },
  ];

  return (
    <div style={{ width: "100%", minHeight: "400px", fontSize: "3rem" }}>
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
            type="linear"
            dataKey="sales"
            stroke="#8979FF"
            strokeWidth={2}
            dot={{ fill: "#fff" }}
            activeDot={{ r: 6 }}
            style={{
              filter:
                "drop-shadow(0px 3px 3px rgba(137, 121, 255, 0.40)) drop-shadow(0px 6px 9px rgba(137, 121, 255, 0.40))",
            }}
          />
          <Line
            type="linear"
            dataKey="revenue"
            stroke="#FF928A"
            strokeWidth={2}
            dot={{ fill: "#fff" }}
            activeDot={{ r: 6 }}
            style={{
              filter:
                "drop-shadow(0px 3px 3px rgba(255, 146, 138, 0.40)) drop-shadow(0px 6px 9px rgba(255, 146, 138, 0.40)) drop-shadow(0px 9px 18px rgba(255, 146, 138, 0.40))",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
