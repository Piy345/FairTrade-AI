import type React from 'react';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  status: 'success' | 'warning' | 'danger';
  badge: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function KpiCard({ label, value, status, badge, icon, delay = 0 }: KpiCardProps) {
  return (
    <div
      className={cn('kpi-card', status)}
      style={{ animationDelay: `${delay}ms`, animation: `fadeUp 0.5s ease-out ${delay}ms both` }}
    >
      <div className={cn('kpi-icon', status)}>{icon}</div>
      <div className="kpi-label">{label}</div>
      <div className={cn('kpi-value font-mono', status)}>{value}</div>
      <span className={cn('kpi-badge', status)}>{badge}</span>
    </div>
  );
}
