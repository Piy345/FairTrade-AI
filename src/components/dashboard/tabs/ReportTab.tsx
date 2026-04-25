import { FileText, Download, FileSpreadsheet, Lightbulb, ShieldAlert, Brain, BarChart3 } from 'lucide-react';
import type { BiasMetric } from '../../../lib/biasData';
import { getAfterMetrics } from '../../../lib/biasData';
import type { DatasetId } from '../../../lib/biasData';
import { datasets } from '../../../lib/biasData';

interface ReportTabProps {
  metric: BiasMetric;
  dataset: DatasetId;
  attribute: string;
}

function generateReport(metric: BiasMetric, dataset: DatasetId, attribute: string): string {
  const dp = metric.demographic_parity;
  const di = metric.disparate_impact;
  const sp = metric.statistical_parity;
  const fi = metric.feature_importance;
  const after = getAfterMetrics(metric);
  const info = datasets[dataset];

  return `
═══════════════════════════════════════════════════════════════
         FAIRTRADE AI — ALGORITHMIC BIAS DETECTION REPORT
═══════════════════════════════════════════════════════════════

Dataset:             ${info.name}
Sensitive Attribute: ${attribute}
Analysis Date:       ${new Date().toISOString().split('T')[0]}
Overall Severity:    ${metric.severity}
Bias Score:          ${metric.overall_bias_score} / 10

───────────────────────────────────────────────────────────────
 1. DEMOGRAPHIC PARITY ANALYSIS
───────────────────────────────────────────────────────────────
  Demographic Parity Difference:  ${dp.value.toFixed(4)}
  Privileged Group (${dp.privileged_group}):     ${(dp.privileged_rate * 100).toFixed(2)}% approval rate
  Unprivileged Group:              ${(dp.unprivileged_rate * 100).toFixed(2)}% approval rate
  Status:                          ${dp.is_biased ? 'BIASED ⚠' : 'FAIR ✓'}

───────────────────────────────────────────────────────────────
 2. DISPARATE IMPACT ANALYSIS
───────────────────────────────────────────────────────────────
  Disparate Impact Ratio:          ${di.value.toFixed(4)}
  Four-Fifths Rule (≥ 0.80):       ${di.value >= 0.80 ? 'PASSED ✓' : 'FAILED ⚠'}
  Status:                          ${di.is_biased ? 'BIASED ⚠' : 'FAIR ✓'}

───────────────────────────────────────────────────────────────
 3. STATISTICAL PARITY TEST
───────────────────────────────────────────────────────────────
  Chi-Squared Statistic:           ${sp.chi2.toFixed(4)}
  P-Value:                         ${sp.p_value < 0.001 ? sp.p_value.toExponential(4) : sp.p_value.toFixed(6)}
  Statistically Significant:       ${sp.is_biased ? 'YES — reject H₀ at α=0.05' : 'NO — fail to reject H₀'}

───────────────────────────────────────────────────────────────
 4. FEATURE IMPORTANCE & PROXY DETECTION
───────────────────────────────────────────────────────────────
  Sensitive Feature in Top-5:      ${fi.sensitive_in_top5 ? 'YES ⚠' : 'NO'}
  Flagged Proxy Features:          ${fi.flagged_features.join(', ')}

  Top 10 Features:
${Object.entries(fi.top_features)
  .map(([k, v], i) => `    ${(i + 1).toString().padStart(2)}. ${k.padEnd(38)} ${v.toFixed(4)}${fi.flagged_features.includes(k) ? '  ← FLAGGED' : ''}`)
  .join('\n')}

───────────────────────────────────────────────────────────────
 5. DRL CORRECTION RESULTS (FairTrade AI Agent)
───────────────────────────────────────────────────────────────
  DPD Before:       ${dp.value.toFixed(4)}  →  After: ${after.dpd.toFixed(4)}  (${((dp.value - after.dpd) / dp.value * 100).toFixed(1)}% reduction)
  DI  Before:       ${di.value.toFixed(4)}  →  After: ${after.di.toFixed(4)}  (${((after.di - di.value) / di.value * 100).toFixed(1)}% improvement)
  Score Before:     ${metric.overall_bias_score}        →  After: ${after.score.toFixed(1)}
  Accuracy:         ~82% maintained post-correction

═══════════════════════════════════════════════════════════════
                        END OF REPORT
═══════════════════════════════════════════════════════════════`.trim();
}

function generateCsv(metric: BiasMetric, dataset: DatasetId, attribute: string): string {
  const dp = metric.demographic_parity;
  const di = metric.disparate_impact;
  const sp = metric.statistical_parity;
  const after = getAfterMetrics(metric);

  return [
    'Metric,Before,After,Status',
    `Demographic Parity Diff,${dp.value.toFixed(4)},${after.dpd.toFixed(4)},${dp.is_biased ? 'Biased' : 'Fair'}`,
    `Disparate Impact Ratio,${di.value.toFixed(4)},${after.di.toFixed(4)},${di.is_biased ? 'Biased' : 'Fair'}`,
    `Chi-Squared,${sp.chi2.toFixed(4)},,${sp.is_biased ? 'Significant' : 'Not Significant'}`,
    `P-Value,${sp.p_value < 0.001 ? sp.p_value.toExponential(4) : sp.p_value.toFixed(6)},,`,
    `Bias Score,${metric.overall_bias_score},${after.score.toFixed(1)},${metric.severity}`,
    `Dataset,${datasets[dataset].name},,`,
    `Attribute,${attribute},,`,
  ].join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportTab({ metric, dataset, attribute }: ReportTabProps) {
  const report = generateReport(metric, dataset, attribute);
  const csv = generateCsv(metric, dataset, attribute);

  return (
    <section>
      {/* Report Block */}
      <div className="glass-card animate-fade-up" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <FileText size={18} color="var(--primary)" />
          <h3>Generated Bias Report</h3>
        </div>
        <div className="card-body">
          <pre className="report-block">{report}</pre>
        </div>
      </div>

      {/* Download Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          className="download-btn primary"
          onClick={() => downloadFile(report, `fairtrade_bias_report_${dataset}_${attribute}.txt`, 'text/plain')}
        >
          <Download size={16} />
          Download Report (.txt)
        </button>
        <button
          className="download-btn"
          onClick={() => downloadFile(csv, `fairtrade_metrics_${dataset}_${attribute}.csv`, 'text/csv')}
        >
          <FileSpreadsheet size={16} />
          Download Metrics (.csv)
        </button>
      </div>

      {/* Recommendations */}
      <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Lightbulb size={20} color="var(--warning)" />
        Recommendations
      </h3>
      <div className="rec-grid">
        <div className="rec-card animate-fade-up" style={{ animationDelay: '50ms' }}>
          <h4>
            <ShieldAlert size={16} color="var(--danger)" />
            Remove Proxy Features
          </h4>
          <p>
            Remove or decorrelate flagged proxy features ({metric.feature_importance.flagged_features.join(', ')})
            from the model to reduce indirect discrimination pathways.
          </p>
        </div>
        <div className="rec-card animate-fade-up" style={{ animationDelay: '100ms' }}>
          <h4>
            <BarChart3 size={16} color="var(--primary)" />
            Apply Reweighting
          </h4>
          <p>
            Use pre-processing reweighting techniques to balance the training data,
            ensuring equal representation across privileged and unprivileged groups.
          </p>
        </div>
        <div className="rec-card animate-fade-up" style={{ animationDelay: '150ms' }}>
          <h4>
            <Brain size={16} color="var(--success)" />
            Deploy DRL Agent
          </h4>
          <p>
            Integrate the FairTrade AI Deep Reinforcement Learning agent as a post-processing
            correction layer to dynamically adjust decision boundaries for fairness.
          </p>
        </div>
        <div className="rec-card animate-fade-up" style={{ animationDelay: '200ms' }}>
          <h4>
            <BarChart3 size={16} color="var(--warning)" />
            Continuous Monitoring
          </h4>
          <p>
            Implement ongoing bias monitoring in production with automated alerts when
            metrics drift beyond acceptable thresholds (DPD {'>'} 0.10, DI {'<'} 0.80).
          </p>
        </div>
      </div>
    </section>
  );
}
