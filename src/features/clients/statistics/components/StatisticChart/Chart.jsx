import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import formatterCurrency from '@utils/formatterCurrency'; // Import your currency formatter

export default function Chart({ data, keys = {}, isCompact = false }) {
  // Add formatter function
  const formatValue = (value) => {
    if (!value && value !== 0) return '';
    return `${formatterCurrency(value, 'USD')}`;
  };

  // Add this data validation
  const validData = useMemo(
    () =>
      data?.map((item) => ({
        ...item,
        [keys.firstLine]: Number(item[keys.firstLine]) || null,
        [keys.secondLine]: Number(item[keys.secondLine]) || null,
      })) || [],
    [data, keys.firstLine, keys.secondLine]
  );

  const dataPointWidth = isCompact ? 40 : 20;
  const computedWidth = isCompact
    ? Math.max(1200, validData.length * dataPointWidth)
    : null;
  return (
    <div
      style={{
        width: isCompact ? `${computedWidth}px` : '100%',
        minWidth: isCompact ? `${computedWidth}px` : '100%',
        minHeight: isCompact ? '280px' : '400px',
        fontSize: '3rem',
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight={isCompact ? 280 : 400}
      >
        <LineChart
          data={validData} // Use validated data
          margin={{
            top: 20,
            right: 15,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid-color)"
          />
          <XAxis
            dataKey={keys.name || 'name'}
            tick={{ fill: 'var(--chart-axis-label-color)' }}
            axisLine={{ stroke: 'var(--chart-grid-color)' }}
            tickLine={{ stroke: 'var(--chart-grid-color)' }}
            interval={0} // show all ticks
          />
          <YAxis
            tick={{ fill: 'var(--chart-axis-label-color)' }}
            axisLine={{ stroke: 'var(--chart-grid-color)' }}
            tickLine={{ stroke: 'var(--chart-grid-color)' }}
            domain={['auto', 'auto']} // or [0, 'dataMax + 1000']
            tickFormatter={formatValue} // Add formatter to Y axis
          />
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
            formatter={formatValue} // Add formatter to tooltip
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ color: 'var(--chart-legend-color)' }}
            formatter={(value) => `${value}`} // Optional: customize legend labels
          />
          <Line
            type="linear"
            dataKey={keys['firstLine'] || 'sales'}
            stroke="#8979FF"
            strokeWidth={2}
            dot={{ fill: '#fff' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="linear"
            dataKey={keys['secondLine'] || 'revenue'}
            stroke="#FF928A"
            strokeWidth={2}
            dot={{ fill: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
