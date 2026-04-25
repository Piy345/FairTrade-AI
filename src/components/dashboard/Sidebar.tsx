import { Shield, Database, Sliders, ToggleLeft } from 'lucide-react';
import { datasets, getSeverityClass } from '../../lib/biasData';
import type { DatasetId } from '../../lib/biasData';

interface SidebarProps {
  dataset: DatasetId;
  attribute: string;
  dpThreshold: number;
  diThreshold: number;
  showCompare: boolean;
  onDatasetChange: (d: DatasetId) => void;
  onAttributeChange: (a: string) => void;
  onDpThresholdChange: (v: number) => void;
  onDiThresholdChange: (v: number) => void;
  onShowCompareChange: (v: boolean) => void;
}

export default function Sidebar({
  dataset,
  attribute,
  dpThreshold,
  diThreshold,
  showCompare,
  onDatasetChange,
  onAttributeChange,
  onDpThresholdChange,
  onDiThresholdChange,
  onShowCompareChange,
}: SidebarProps) {
  const info = datasets[dataset];
  const metric = info.metrics[attribute];
  const sevClass = getSeverityClass(metric.severity);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={22} color="white" />
        </div>
        <div>
          <h1>FairTrade AI</h1>
          <div className="subtitle">Bias Detection Engine</div>
        </div>
      </div>

      {/* Dataset Selector */}
      <div className="sidebar-section">
        <label htmlFor="dataset-select">
          <Database size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
          Dataset
        </label>
        <select
          id="dataset-select"
          className="sidebar-select"
          value={dataset}
          onChange={(e) => {
            const ds = e.target.value as DatasetId;
            onDatasetChange(ds);
            onAttributeChange(datasets[ds].attributes[0]);
          }}
        >
          <option value="adult">Adult Income (UCI)</option>
          <option value="german">German Credit (Kaggle)</option>
        </select>
      </div>

      {/* Attribute Selector */}
      <div className="sidebar-section">
        <label htmlFor="attr-select">
          <Sliders size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
          Sensitive Attribute
        </label>
        <select
          id="attr-select"
          className="sidebar-select"
          value={attribute}
          onChange={(e) => onAttributeChange(e.target.value)}
        >
          {info.attributes.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Demographic Parity Threshold */}
      <div className="sidebar-section">
        <div className="slider-container">
          <div className="slider-header">
            <label htmlFor="dp-slider">DP Threshold</label>
            <span className="slider-value font-mono">{dpThreshold.toFixed(2)}</span>
          </div>
          <input
            id="dp-slider"
            type="range"
            min="0.05"
            max="0.30"
            step="0.01"
            value={dpThreshold}
            onChange={(e) => onDpThresholdChange(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* Disparate Impact Threshold */}
      <div className="sidebar-section">
        <div className="slider-container">
          <div className="slider-header">
            <label htmlFor="di-slider">DI Threshold</label>
            <span className="slider-value font-mono">{diThreshold.toFixed(2)}</span>
          </div>
          <input
            id="di-slider"
            type="range"
            min="0.50"
            max="0.95"
            step="0.01"
            value={diThreshold}
            onChange={(e) => onDiThresholdChange(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* Before / After Toggle */}
      <div className="sidebar-section">
        <div className="toggle-container">
          <label>
            <ToggleLeft size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
            Before vs After
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showCompare}
              onChange={(e) => onShowCompareChange(e.target.checked)}
            />
            <span className="toggle-track" />
          </label>
        </div>
      </div>

      {/* Current Status */}
      <div className="status-card">
        <div style={{ fontSize: '0.72rem', color: 'var(--foreground-dim)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Current Status
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={`status-badge ${sevClass}`}>
            {sevClass === 'critical' ? '🔴' : sevClass === 'moderate' ? '🟡' : '🟢'}{' '}
            {metric.severity.replace(/🔴|🟢|🟡/g, '').trim()}
          </span>
          <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: sevClass === 'critical' ? 'var(--danger)' : sevClass === 'moderate' ? 'var(--warning)' : 'var(--success)' }}>
            {metric.overall_bias_score}/10
          </span>
        </div>
      </div>

      {/* Dataset info */}
      <div style={{ fontSize: '0.72rem', color: 'var(--foreground-dim)', lineHeight: 1.5, marginTop: 'auto', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
        <strong style={{ color: 'var(--foreground-muted)' }}>{info.name}</strong><br />
        {info.description}
      </div>
    </aside>
  );
}
