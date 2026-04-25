import { ArrowRight, TrendingDown, Shield, Zap, CheckCircle } from 'lucide-react';
import Chart from '../Chart';
import type { BiasMetric } from '../../../lib/biasData';
import { getAfterMetrics } from '../../../lib/biasData';

interface CompareTabProps {
  metric: BiasMetric;
}

export default function CompareTab({ metric }: CompareTabProps) {
  const after = getAfterMetrics(metric);
  const dp = metric.demographic_parity;

  const dpdImprovement = ((dp.value - after.dpd) / dp.value * 100);
  const diImprovement = ((after.di - metric.disparate_impact.value) / metric.disparate_impact.value * 100);
  const scoreReduction = metric.overall_bias_score - after.score;

  return (
    <section>
      {/* Hero Banner */}
      <div className="hero-banner animate-fade-up">
        <h2>
          <span style={{ color: 'var(--danger)' }}>Before · Biased</span>
          <ArrowRight size={24} style={{ display: 'inline', margin: '0 16px', verticalAlign: -4, color: 'var(--foreground-muted)' }} />
          <span style={{ color: 'var(--success)' }}>After · FairTrade AI</span>
        </h2>
        <p>Deep Reinforcement Learning (PPO) based fairness correction results</p>
      </div>

      {/* Impact Stats */}
      <div className="impact-grid">
        <div className="impact-card animate-fade-up" style={{ animationDelay: '50ms' }}>
          <div style={{ color: 'var(--success)', marginBottom: 8 }}>
            <TrendingDown size={24} />
          </div>
          <div className="impact-value font-mono" style={{ color: 'var(--success)' }}>
            {dpdImprovement.toFixed(1)}%
          </div>
          <div className="impact-label">DPD Reduction</div>
        </div>
        <div className="impact-card animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div style={{ color: 'var(--success)', marginBottom: 8 }}>
            <Zap size={24} />
          </div>
          <div className="impact-value font-mono" style={{ color: 'var(--success)' }}>
            {diImprovement.toFixed(1)}%
          </div>
          <div className="impact-label">DI Improvement</div>
        </div>
        <div className="impact-card animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div style={{ color: 'var(--success)', marginBottom: 8 }}>
            <Shield size={24} />
          </div>
          <div className="impact-value font-mono" style={{ color: 'var(--success)' }}>
            {scoreReduction.toFixed(1)}
          </div>
          <div className="impact-label">Bias Score Reduced</div>
        </div>
        <div className="impact-card animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div style={{ color: 'var(--warning)', marginBottom: 8 }}>
            <CheckCircle size={24} />
          </div>
          <div className="impact-value font-mono" style={{ color: 'var(--warning)' }}>
            ~82%
          </div>
          <div className="impact-label">Accuracy Maintained</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Grouped Bar: Before vs After */}
        <Chart
          title="Before vs After — Key Metrics"
          icon={<TrendingDown size={16} color="var(--success)" />}
          data={[
            {
              type: 'bar',
              name: 'Before (Biased)',
              x: ['DPD', 'Disparate Impact', 'Bias Score'],
              y: [dp.value, metric.disparate_impact.value, metric.overall_bias_score],
              marker: { color: 'oklch(0.65 0.24 25 / 0.8)' },
              text: [dp.value.toFixed(4), metric.disparate_impact.value.toFixed(4), metric.overall_bias_score.toFixed(1)],
              textposition: 'outside' as const,
              textfont: { family: 'JetBrains Mono', size: 11, color: '#ef4444' },
            },
            {
              type: 'bar',
              name: 'After (FairTrade AI)',
              x: ['DPD', 'Disparate Impact', 'Bias Score'],
              y: [after.dpd, after.di, after.score],
              marker: { color: 'oklch(0.72 0.18 155 / 0.8)' },
              text: [after.dpd.toFixed(4), after.di.toFixed(4), after.score.toFixed(1)],
              textposition: 'outside' as const,
              textfont: { family: 'JetBrains Mono', size: 11, color: '#22c55e' },
            },
          ]}
          layout={{
            barmode: 'group' as const,
            legend: {
              orientation: 'h' as const,
              x: 0.5,
              y: -0.2,
              xanchor: 'center' as const,
            },
            margin: { l: 50, r: 30, t: 10, b: 80 },
          }}
          height={350}
        />

        {/* Approval Rate Gap Closing */}
        <Chart
          title="Approval Rate Gap — Before vs After"
          icon={<Shield size={16} color="var(--success)" />}
          data={[
            {
              type: 'bar',
              name: 'Privileged',
              x: ['Before', 'After'],
              y: [dp.privileged_rate, after.privileged_rate],
              marker: { color: 'oklch(0.65 0.22 265 / 0.8)' },
              text: [
                `${(dp.privileged_rate * 100).toFixed(1)}%`,
                `${(after.privileged_rate * 100).toFixed(1)}%`,
              ],
              textposition: 'outside' as const,
              textfont: { family: 'JetBrains Mono', size: 11, color: '#CBD5E1' },
            },
            {
              type: 'bar',
              name: 'Unprivileged',
              x: ['Before', 'After'],
              y: [dp.unprivileged_rate, after.unprivileged_rate],
              marker: { color: 'oklch(0.78 0.17 75 / 0.8)' },
              text: [
                `${(dp.unprivileged_rate * 100).toFixed(1)}%`,
                `${(after.unprivileged_rate * 100).toFixed(1)}%`,
              ],
              textposition: 'outside' as const,
              textfont: { family: 'JetBrains Mono', size: 11, color: '#CBD5E1' },
            },
          ]}
          layout={{
            barmode: 'group' as const,
            yaxis: { title: { text: 'Approval Rate' }, range: [0, 0.65] },
            legend: {
              orientation: 'h' as const,
              x: 0.5,
              y: -0.2,
              xanchor: 'center' as const,
            },
            margin: { l: 60, r: 30, t: 10, b: 80 },
          }}
          height={350}
        />
      </div>

      {/* Summary callout */}
      <div className="callout success animate-fade-up">
        <h4>
          <CheckCircle size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />
          DRL Fair Decision Agent — Impact Summary
        </h4>
        <p style={{ marginTop: 8 }}>
          The FairTrade AI DRL agent (PPO architecture) successfully reduced the Demographic Parity Difference
          by <strong className="font-mono" style={{ color: 'var(--success)' }}>{dpdImprovement.toFixed(1)}%</strong>,
          improved the Disparate Impact ratio
          by <strong className="font-mono" style={{ color: 'var(--success)' }}>{diImprovement.toFixed(1)}%</strong>,
          and lowered the overall bias score
          from <strong className="font-mono" style={{ color: 'var(--danger)' }}>{metric.overall_bias_score}</strong> to <strong className="font-mono" style={{ color: 'var(--success)' }}>{after.score.toFixed(1)}</strong> —
          while maintaining approximately 82% classification accuracy.
        </p>
      </div>
    </section>
  );
}
