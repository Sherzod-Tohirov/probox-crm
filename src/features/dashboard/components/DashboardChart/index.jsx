import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export default function DashboardChart({ width }) {
  const data = [
    { name: 'Active Clients', value: 400 },
    { name: 'Pending Leads', value: 300 },
    { name: 'Completed Projects', value: 300 },
    { name: 'New Inquiries', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="14px"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      style={{ width: width ? width : '100%', height: 400, fontSize: '3rem' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            innerRadius={60}
            paddingAngle={5}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--primary-bg)',
              borderRadius: '8px',
              border: '1px solid var(--primary-border-color)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              color: 'var(--chart-text-color)',
            }}
            labelStyle={{ color: 'var(--chart-text-color)' }}
            itemStyle={{ color: 'var(--chart-text-color)' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ color: 'var(--chart-legend-color)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
