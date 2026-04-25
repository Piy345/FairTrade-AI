import { Search, AlertTriangle, Grid3X3, BarChart3 } from 'lucide-react';
import Chart from '../Chart';
import type { BiasMetric } from '../../../lib/biasData';

interface DeepAnalysisTabProps {
  metric: BiasMetric;
  attribute: string;
}

export default function DeepAnalysisTab({ metric, attribute }: DeepAnalysisTabProps) {
  const fi = metric.feature_importance;
  const sp = metric.statistical_parity;
  const dp = metric.demographic_parity;

  const featureNames = Object.keys(fi.top_features);
  const featureValues = Object.values(fi.top_features);
  const featureColors = featureNames.map((f) =>
    fi.flagged_features.includes(f) ? '#ef4444' : 'oklch(0.65 0.22 265)'
  );

  return (
    <section>
      {/* Flagged Features Callout */}
      <div className="callout danger animate-fade-up" style={{ marginBottom: 24 }}>
        <h4>
          <AlertTriangle size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />
          Flagged Sensitive / Proxy Features
        </h4>
        <ul style={{ marginTop: 8 }}>
          {fi.flagged_features.map((f) => (
            <li key={f}>
              <strong className="font-mono" style={{ color: 'var(--danger)' }}>{f}</strong>{' '}
              — appears in top-10 discriminatory features (importance: {fi.top_features[f]?.toFixed(4) ?? 'N/A'})
            </li>
          ))}
        </ul>
        {fi.sensitive_in_top5 && (
          <p style={{ marginTop: 8, fontWeight: 600, color: 'var(--danger)' }}>
            ⚠ Sensitive attribute detected in top-5 features — high discrimination risk
          </p>
        )}
      </div>

      <div className="grid-2">
        {/* Top 10 Discriminatory Features */}
        <Chart
          title="Top 10 Discriminatory Features"
          icon={<Search size={16} color="var(--primary)" />}
          data={[
            {
              type: 'bar',
              orientation: 'h' as const,
              y: [...featureNames].reverse(),
              x: [...featureValues].reverse(),
              marker: {
                color: [...featureColors].reverse(),
                line: { width: 0 },
              },
              text: [...featureValues].reverse().map((v) => v.toFixed(4)),
              textposition: 'outside' as const,
              textfont: { color: '#CBD5E1', family: 'JetBrains Mono', size: 10 },
              hoverinfo: 'x+y' as const,
            },
          ]}
          layout={{
            xaxis: { title: { text: 'Feature Importance (|coeff|)' } },
            yaxis: { automargin: true, tickfont: { size: 10 } },
            margin: { l: 200, r: 60, t: 10, b: 50 },
            showlegend: false,
            annotations: fi.flagged_features.map((f) => ({
              x: (fi.top_features[f] ?? 0) + 0.05,
              y: f,
              text: '🔴 FLAGGED',
              showarrow: false,
              font: { size: 9, color: '#ef4444', family: 'Inter' },
            })),
          }}
          height={400}
        />

        {/* Approval Rate Heatmap */}
        <Chart
          title={`Approval Rate Heatmap — ${attribute}`}
          icon={<Grid3X3 size={16} color="var(--primary)" />}
          data={[
            {
              type: 'heatmap',
              z: [[dp.privileged_rate], [dp.unprivileged_rate]],
              y: [`Privileged (${dp.privileged_group})`, 'Unprivileged'],
              x: ['Approval Rate'],
              colorscale: [
                [0, 'oklch(0.65 0.24 25 / 0.6)'],
                [0.5, 'oklch(0.78 0.17 75 / 0.6)'],
                [1, 'oklch(0.72 0.18 155 / 0.6)'],
              ],
              showscale: true,
              colorbar: {
                tickfont: { color: '#94A3B8', size: 10 },
                title: { text: 'Rate', font: { color: '#94A3B8', size: 11 } },
                len: 0.8,
              },
              text: [
                [`${(dp.privileged_rate * 100).toFixed(1)}%`],
                [`${(dp.unprivileged_rate * 100).toFixed(1)}%`],
              ],
              texttemplate: '%{text}',
              textfont: { color: '#fff', family: 'JetBrains Mono', size: 16 },
              hoverinfo: 'z' as const,
            },
          ]}
          layout={{
            yaxis: { automargin: true },
            xaxis: { side: 'top' as const },
            margin: { l: 140, r: 80, t: 40, b: 20 },
          }}
          height={250}
        />
      </div>

      {/* Statistical Parity Test Card */}
      <div className="glass-card animate-fade-up" style={{ marginTop: 24 }}>
        <div className="card-header">
          <BarChart3 size={18} color="var(--primary)" />
          <h3>Statistical Parity Test (Chi-Squared)</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div>
              <div className="kpi-label">Chi² Statistic</div>
              <div className="kpi-value font-mono" style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
                {sp.chi2.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="kpi-label">P-Value</div>
              <div className="kpi-value font-mono" style={{ fontSize: '1.4rem', color: sp.is_biased ? 'var(--danger)' : 'var(--success)' }}>
                {sp.p_value < 0.001 ? sp.p_value.toExponential(2) : sp.p_value.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="kpi-label">Verdict</div>
              <div style={{ marginTop: 4 }}>
                <span className={`status-badge ${sp.is_biased ? 'critical' : 'low'}`}>
                  {sp.is_biased ? '🔴 Statistically Significant Bias' : '🟢 No Significant Bias'}
                </span>
              </div>
            </div>
          </div>
          <p style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--foreground-dim)', lineHeight: 1.7 }}>
            {sp.is_biased
              ? `The chi-squared test (χ² = ${sp.chi2.toFixed(2)}, p ≈ ${sp.p_value < 0.001 ? sp.p_value.toExponential(2) : sp.p_value.toFixed(4)}) shows a statistically significant difference in outcome distributions across groups. The null hypothesis of equal treatment is rejected at α = 0.05.`
              : `The chi-squared test (χ² = ${sp.chi2.toFixed(2)}, p = ${sp.p_value.toFixed(4)}) does not show statistically significant differences between groups at α = 0.05. Treatment appears balanced.`}
          </p>
        </div>
      </div>
    </section>
  );
}
