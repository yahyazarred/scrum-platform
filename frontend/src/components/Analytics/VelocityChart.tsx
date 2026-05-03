import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SprintData } from '../../services/sprint.api';
import './Analytics.css';

interface Props {
  sprints: SprintData[];
}

export const VelocityChart: React.FC<Props> = ({ sprints }) => {
  const data = sprints.map((s, idx) => ({
    name: `Sprint ${s.sprintNumber || idx + 1}`,
    completedPoints: s.metrics?.completedPoints || 0,
    totalPoints: s.metrics?.totalPoints || 0,
    endDate: new Date(s.endDate).toLocaleDateString()
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length >= 2) {
      return (
        <div className="custom-tooltip">
          <div className="custom-tooltip-label">
            {label}
            <span style={{ fontWeight: 'normal', color: '#94a3b8', marginLeft: '6px', fontSize: '0.8rem' }}>
              ({payload[0].payload.endDate})
            </span>
          </div>
          <div className="custom-tooltip-item" style={{ color: payload[0].color }}>
            <span>{payload[0].name}:</span>
            <span style={{ fontWeight: 'bold' }}>{payload[0].value}</span>
          </div>
          <div className="custom-tooltip-item" style={{ color: payload[1].color }}>
            <span>{payload[1].name}:</span>
            <span style={{ fontWeight: 'bold' }}>{payload[1].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Team Velocity</h3>
        <p className="chart-subtitle">Historical measure of accomplished work (Story Points) across sequential sprints</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="totalPoints" name="Total Planned Depth" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="completedPoints" name="Points Completed" fill="#4db8e8" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
