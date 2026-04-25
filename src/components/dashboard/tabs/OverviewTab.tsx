import { BarChart3, Scale, Activity, Target } from 'lucide-react';
import KpiCard from '../KpiCard';
import Chart from '../Chart';
import type { BiasMetric } from '../../../lib/biasData';

interface OverviewTabProps {
  metric: BiasMetric;
  dpThreshold: number;
  diThreshold: number;
}

export default function OverviewTab({ metric, dpThreshold, diThreshold }: OverviewTabProps) {
  const dp = metric.demographic_parity;
  const di = metric.disparate_impact;
  const sp = metric.statistical_parity;

  const dpBiased = dp.value > dpThreshold;
  const diBiased = di.value < diThreshold;

  return (
    <section>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          label="Demographic Parity Diff"
          value={dp.value.toFixed(4)}
          status={dpBiased ? 'danger' : 'success'}
          badge={dpBiased ? '⚠ Biased' : '✓ Fair'}
          icon={<Scale size={20} />}
          delay={0}
        />
        <KpiCard
          label="Disparate Impact Ratio"
          value={di.value.toFixed(4)}
          status={diBiased ? 'danger' : 'success'}
          badge={diBiased ? '⚠ Biased' : '✓ Fair'}
          icon={<BarChart3 size={20} />}
          delay={80}
        />
        <KpiCard
          label="Statistical Parity (p-val)"
          value={sp.p_value < 0.001 ? sp.p_value.toExponential(2) : sp.p_value.toFixed(4)}
          status={sp.is_biased ? 'danger' : 'success'}
          badge={sp.is_biased ? '⚠ Significant' : '✓ Fair'}
          icon={<Activity size={20} />}
          delay={160}
        />
        <KpiCard
          label="Overall Bias Score"
          value={`${metric.overall_bias_score}/10`}
          status={metric.overall_bias_score >= 7 ? 'danger' : metric.overall_bias_score >= 4 ? 'warning' : 'success'}
          badge={metric.severity.replace(/🔴|🟢|🟡/g, '').trim()}
          icon={<Target size={20} />}
          delay={240}
        />
      </div>

      <div className="grid-2">
        {/* Favorable Outcome Rate by Group */}
        <Chart
          title="Favorable Outcome Rate by Group"
          icon={<BarChart3 size={16} color="var(--primary)" />}
          data={[
            {
              type: 'bar',
              orientation: 'h' as const,
              y: ['Unprivileged', 'Privileged'],
              x: [dp.unprivileged_rate, dp.privileged_rate],
              marker: {
                color: ['oklch(0.65 0.22 265)', 'oklch(0.72 0.18 155)'],
                line: { width: 0 },
              },
              text: [
                `${(dp.unprivileged_rate * 100).toFixed(1)}%`,
                `${(dp.privileged_rate * 100).toFixed(1)}%`,
              ],
              textposition: 'auto' as const,
              textfont: { color: '#fff', family: 'JetBrains Mono', size: 13 },
              hoverinfo: 'x+y' as const,
            },
            {
              type: 'scatter',
              mode: 'lines' as const,
              x: [
                (dp.privileged_rate + dp.unprivileged_rate) / 2,
                (dp.privileged_rate + dp.unprivileged_rate) / 2,
              ],
              y: [-0.5, 1.5],
              line: { color: 'rgba(255,255,255,0.35)', width: 2, dash: 'dash' as const },
              showlegend: false,
              hoverinfo: 'skip' as const,
            },
          ]}
          layout={{
            xaxis: { title: { text: 'Approval Rate' } },
            yaxis: { automargin: true },
            margin: { l: 100, r: 30, t: 10, b: 50 },
            showlegend: false,
          }}
          height={260}
        />

        {/* Bias Score Gauge */}
        <Chart
          title="Overall Bias Score Gauge"
          icon={<Target size={16} color="var(--primary)" />}
          data={[
            {
              type: 'indicator',
              mode: 'gauge+number' as const,
              value: metric.overall_bias_score,
              gauge: {
                axis: { range: [0, 10], tickwidth: 1, tickcolor: '#475569' },
                bar: { color: metric.overall_bias_score >= 7 ? '#ef4444' : metric.overall_bias_score >= 4 ? '#f59e0b' : '#22c55e' },
                bgcolor: 'rgba(30,41,59,0.5)',
                borderwidth: 0,
                steps: [
                  { range: [0, 3], color: 'rgba(34,197,94,0.12)' },
                  { range: [3, 6], color: 'rgba(245,158,11,0.12)' },
                  { range: [6, 10], color: 'rgba(239,68,68,0.12)' },
                ],
                threshold: {
                  line: { color: '#fff', width: 3 },
                  thickness: 0.8,
                  value: metric.overall_bias_score,
                },
              },
              number: {
                font: { family: 'JetBrains Mono', size: 42, color: '#f1f5f9' },
                suffix: '/10',
              },
            },
          ]}
          layout={{
            margin: { l: 30, r: 30, t: 30, b: 10 },
          }}
          height={280}
        />
      </div>

      {/* Radar Chart */}
      <Chart
        title="Fairness Profile — Current vs Ideal"
        icon={<Activity size={16} color="var(--primary)" />}
        data={[
          {
            type: 'scatterpolar',
            r: [
              1 - dp.value,          // Dem. Parity (inverted — closer to 1 = fairer)
              di.value,              // Disparate Impact (closer to 1 = fairer)
              sp.is_biased ? 0.2 : 0.9,  // Stat. Parity
              metric.feature_importance.is_biased ? 0.3 : 0.9,  // Feature Bias
            ],
            theta: ['Dem. Parity', 'Disparate Impact', 'Stat. Parity', 'Feature Neutrality'],
            fill: 'toself' as const,
            fillcolor: 'oklch(0.65 0.22 265 / 0.15)',
            line: { color: 'oklch(0.65 0.22 265)' },
            name: 'Current',
            marker: { size: 6 },
          },
          {
            type: 'scatterpolar',
            r: [0.95, 0.95, 0.95, 0.95],
            theta: ['Dem. Parity', 'Disparate Impact', 'Stat. Parity', 'Feature Neutrality'],
            fill: 'toself' as const,
            fillcolor: 'oklch(0.72 0.18 155 / 0.08)',
            line: { color: 'oklch(0.72 0.18 155)', dash: 'dash' as const },
            name: 'Ideal',
            marker: { size: 6 },
          },
        ]}
        layout={{
          polar: {
            bgcolor: 'transparent',
            radialaxis: {
              visible: true,
              range: [0, 1],
              gridcolor: 'rgba(148,163,184,0.12)',
              linecolor: 'transparent',
              tickfont: { color: '#94A3B8', size: 10 },
            },
            angularaxis: {
              gridcolor: 'rgba(148,163,184,0.12)',
              linecolor: 'rgba(148,163,184,0.15)',
              tickfont: { color: '#CBD5E1', size: 11 },
            },
          },
          showlegend: true,
          legend: {
            x: 0.5,
            y: -0.15,
            xanchor: 'center' as const,
            orientation: 'h' as const,
            font: { color: '#CBD5E1', size: 12 },
          },
          margin: { l: 60, r: 60, t: 20, b: 60 },
        }}
        height={380}
      />
    </section>
  );
}
