import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useThemeStore } from '@/store/themeStore';
import { ChartDataPoint } from '@/types/financials';

interface FinancialChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800 dark:text-gray-200">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.color }}>
            {pld.name}: {pld.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  const { theme } = useThemeStore();
  const tickColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  return (
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={tickColor} />
                <YAxis 
                    stroke={tickColor} 
                    tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact'
                    }).format(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: tickColor }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#3b82f6" />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
