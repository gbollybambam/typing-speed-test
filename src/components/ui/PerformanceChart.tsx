import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { type WpmPoint } from '../../hooks/useTypingEngine';

interface PerformanceChartProps {
  data: WpmPoint[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-64 bg-neutral-900/50 rounded-xl border border-neutral-800 p-4">
      <h3 className="text-neutral-400 text-sm font-medium mb-4">Performance Over Time</h3>
      <div className="w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#525252" 
              tick={{ fill: '#525252', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#525252" 
              tick={{ fill: '#525252', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#171717', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#EAB308' }}
              labelStyle={{ color: '#737373', marginBottom: '4px' }}
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