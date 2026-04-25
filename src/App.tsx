import { useState } from 'react';
import { LayoutDashboard, Search, GitCompare, FileText } from 'lucide-react';
import Sidebar from './components/dashboard/Sidebar';
import OverviewTab from './components/dashboard/tabs/OverviewTab';
import DeepAnalysisTab from './components/dashboard/tabs/DeepAnalysisTab';
import CompareTab from './components/dashboard/tabs/CompareTab';
import ReportTab from './components/dashboard/tabs/ReportTab';
import { datasets, getMetric } from './lib/biasData';
import type { DatasetId } from './lib/biasData';
import { cn } from './lib/utils';

type TabId = 'overview' | 'deep' | 'compare' | 'report';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'deep', label: 'Deep Analysis', icon: <Search size={16} /> },
  { id: 'compare', label: 'Compare', icon: <GitCompare size={16} /> },
  { id: 'report', label: 'Report', icon: <FileText size={16} /> },
];

export default function App() {
  const [dataset, setDataset] = useState<DatasetId>('adult');
  const [attribute, setAttribute] = useState<string>(datasets.adult.attributes[0]);
  const [dpThreshold, setDpThreshold] = useState(0.10);
  const [diThreshold, setDiThreshold] = useState(0.80);
  const [showCompare, setShowCompare] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const metric = getMetric(dataset, attribute);

  // When compare toggle is on, switch to compare tab
  const handleCompareToggle = (v: boolean) => {
    setShowCompare(v);
    if (v) setActiveTab('compare');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        dataset={dataset}
        attribute={attribute}
        dpThreshold={dpThreshold}
        diThreshold={diThreshold}
        showCompare={showCompare}
        onDatasetChange={setDataset}
        onAttributeChange={setAttribute}
        onDpThresholdChange={setDpThreshold}
        onDiThresholdChange={setDiThreshold}
        onShowCompareChange={handleCompareToggle}
      />

      <main className="main-content">
        {/* Header */}
        <header className="main-header animate-fade-up">
          <h2>Algorithmic Bias Detection Dashboard</h2>
          <p>
            Analyzing <strong>{datasets[dataset].name}</strong> — Attribute: <strong>{attribute}</strong>
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="tabs-nav animate-fade-up" style={{ animationDelay: '100ms' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={cn('tab-btn', activeTab === tab.id && 'active')}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="animate-fade-in" key={`${activeTab}-${dataset}-${attribute}`}>
          {activeTab === 'overview' && (
            <OverviewTab metric={metric} dpThreshold={dpThreshold} diThreshold={diThreshold} />
          )}
          {activeTab === 'deep' && (
            <DeepAnalysisTab metric={metric} attribute={attribute} />
          )}
          {activeTab === 'compare' && (
            <CompareTab metric={metric} />
          )}
          {activeTab === 'report' && (
            <ReportTab metric={metric} dataset={dataset} attribute={attribute} />
          )}
        </div>
      </main>
    </div>
  );
}
