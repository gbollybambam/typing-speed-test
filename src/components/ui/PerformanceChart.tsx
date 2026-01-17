import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { type WpmPoint } from '../../hooks/useTypingEngine';

interface PerformanceChartProps {
  data: WpmPoint[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  if (!data || data.length === 0) return null;

  return (
    // UPDATED: Background uses theme variable
    <div className="w-full h-64 bg-[var(--bg-secondary)] rounded-xl border border-[var(--text-secondary)]/20 p-4">
      <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-4">Performance Over Time</h3>
      <div className="w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                {/* Note: SVG colors usually need hex, so we stick to a safe yellow, or you can use "currentColor" tricks */}
                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--text-secondary)" opacity={0.1} vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-secondary)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--text-secondary)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: '#EAB308' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="wpm" 
              stroke="#EAB308" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWpm)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;