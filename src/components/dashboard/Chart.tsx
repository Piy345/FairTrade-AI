import type React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

interface ChartProps {
  title: string;
  data: Data[];
  layout?: Partial<Layout>;
  height?: number;
  icon?: React.ReactNode;
}

/** Dark-themed defaults baked in */
const darkDefaults: Partial<Layout> = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#CBD5E1', family: 'Inter, sans-serif', size: 12 },
  margin: { l: 50, r: 30, t: 10, b: 40 },
  xaxis: {
    gridcolor: 'rgba(148,163,184,0.1)',
    zerolinecolor: 'rgba(148,163,184,0.15)',
  },
  yaxis: {
    gridcolor: 'rgba(148,163,184,0.1)',
    zerolinecolor: 'rgba(148,163,184,0.15)',
  },
  legend: {
    font: { color: '#CBD5E1', size: 11 },
    bgcolor: 'transparent',
  },
  hoverlabel: {
    bgcolor: '#1e293b',
    bordercolor: '#475569',
    font: { color: '#f1f5f9', family: 'Inter, sans-serif' },
  },
};

export default function Chart({ title, data, layout = {}, height = 350, icon }: ChartProps) {
  const mergedLayout: Partial<Layout> = {
    ...darkDefaults,
    ...layout,
    height,
    font: { ...darkDefaults.font, ...layout.font },
    margin: { ...darkDefaults.margin, ...layout.margin },
    xaxis: { ...darkDefaults.xaxis, ...layout.xaxis },
    yaxis: { ...darkDefaults.yaxis, ...layout.yaxis },
    hoverlabel: { ...darkDefaults.hoverlabel, ...layout.hoverlabel },
  };

  return (
    <div className="chart-card animate-fade-up">
      <div className="chart-card-header">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="chart-card-body">
        <Plot
          data={data}
          layout={mergedLayout}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>
    </div>
  );
}
