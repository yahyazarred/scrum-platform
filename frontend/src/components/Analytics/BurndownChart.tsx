import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BurndownDataPoint } from '../../services/sprint.api';
import './Analytics.css';

interface Props {
  data: BurndownDataPoint[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedLabel = label ? new Date(label).toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }) : '';
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{formattedLabel}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="custom-tooltip-item" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 'bold' }}>{entry.value} pts</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


const renderCustomDot = (props: any, fullData: BurndownDataPoint[]) => {
  const { cx, cy, payload, index } = props;
  if (!cx || !cy || index === undefined) return null;
  
  const isFirst = index === 0;
  const isLast = index === fullData.length - 1;
  const prevData = index > 0 ? fullData[index - 1] : null;
  const isDrop = index > 0 && 
                 payload.actualRemaining !== null && 
                 prevData !== null && 
                 prevData.actualRemaining !== null && 
                 payload.actualRemaining < prevData.actualRemaining;

  if (isFirst || isLast || isDrop) {
    return <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#0f1620" stroke="#4db8e8" strokeWidth={2} />;
  }
  return null;
};

export const BurndownChart: React.FC<Props> = ({ data, title = "Sprint Burndown" }) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <p className="chart-subtitle">Remaining Story Points mapped against projected linear completion</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false} 
            tickLine={false} 
            dy={10}
            minTickGap={30}
            tickFormatter={(val) => {
              if (!val) return '';
              return new Date(val).toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' });
            }}
          />
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Line 
            type="linear" 
            dataKey="expectedRemaining" 
            name="Ideal Remaining" 
            stroke="#f97316" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="linear" 
            dataKey="actualRemaining" 
            name="Actual Remaining" 
            stroke="#4db8e8" 
            strokeWidth={3} 
            dot={(props) => renderCustomDot(props, data)}
            activeDot={{ r: 7, strokeWidth: 0 }} 
            connectNulls={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
