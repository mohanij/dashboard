import React, { memo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useFetchAnalytics } from '../../hooks/useFetchAnalytics';
import {
 ScatterChart, RadarChart, 
  AreaChart, ComposedChart, FunnelChart, Funnel,Sankey,
  Pie, Bar, Line, XAxis, YAxis, ZAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell, Area,
  Radar, PolarAngleAxis, PolarRadiusAxis, PolarGrid,
  Scatter, Treemap as RechartsTreemap, Sankey as RechartsSankey
} from 'recharts';
import './styles.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C'];

const PerformanceChart = memo(() => {
  useFetchAnalytics();
  const { analytics, loading, error } = useAppContext();
  const [chartType, setChartType] = useState('composed');
  const [timeRange, setTimeRange] = useState('7d');

  if (loading.analytics) return <div className="loading-chart">Loading analytics...</div>;
  if (error.analytics) return <div className="error-chart">Error: {error.analytics}</div>;
  if (!analytics?.rates) return <div className="no-data">No analytics data available</div>;

  // Prepare multiple datasets
  const cryptoData = Object.entries(analytics.rates)
    .filter(([key]) => ['btc', 'eth', 'ltc', 'bch', 'bnb', 'sol'].includes(key))
    .map(([key, value]) => ({
      name: key.toUpperCase(),
      value: value?.value || 0,
      volume: Math.random() * 1000 + 500, // Mock volume
      change: (Math.random() * 20 - 10).toFixed(2) // Mock 24h change
    }));

  const historicalData = [
    { date: 'Jan', btc: 40000, eth: 3000, ltc: 150, bnb: 350, sol: 120 },
    { date: 'Feb', btc: 42000, eth: 2800, ltc: 140, bnb: 380, sol: 150 },
    { date: 'Mar', btc: 38000, eth: 2500, ltc: 130, bnb: 320, sol: 110 },
    { date: 'Apr', btc: 45000, eth: 3200, ltc: 160, bnb: 400, sol: 180 },
  ];

  const marketCapData = cryptoData.map(crypto => ({
    ...crypto,
    marketCap: crypto.value * 1000 // Mock market cap
  }));

  const correlationData = cryptoData.flatMap((crypto, _, array) => 
    array.map(other => ({
      x: crypto.value,
      y: other.value,
      z: Math.abs(crypto.value - other.value),
      pair: `${crypto.name}-${other.name}`
    }))
    .filter(item => item.x !== item.y));

  const treeMapData = cryptoData.map(crypto => ({
    name: crypto.name,
    size: crypto.value * 100
  }));

  // 1. Composed Chart (Line + Bar)
  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height={450}>
      <ComposedChart data={cryptoData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="value" fill="#8884d8" name="Value" />
        <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#ff7300" name="Volume" />
      </ComposedChart>
    </ResponsiveContainer>
  );

  // 2. Radar Chart (Performance Comparison)
  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={450}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={cryptoData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Tooltip />
        <Legend />
        <Radar 
          name="Performance" 
          dataKey="value" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.6} 
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  // 3. Scatter Chart (Correlation Analysis)
  const renderScatterChart = () => (
    <ResponsiveContainer width="100%" height={450}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="Value 1" />
        <YAxis type="number" dataKey="y" name="Value 2" />
        <ZAxis type="number" dataKey="z" range={[60, 400]} name="Difference" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Crypto Pairs" data={correlationData} fill="#8884d8">
          {correlationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );

  // 4. Area Chart (Historical Trends)
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={450}>
      <AreaChart data={historicalData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {['btc', 'eth', 'ltc', 'bnb', 'sol'].map((crypto, index) => (
          <Area 
            key={crypto}
            type="monotone"
            dataKey={crypto}
            stackId="1"
            stroke={COLORS[index]}
            fill={COLORS[index]}
            name={crypto.toUpperCase()}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );

  // 5. Treemap (Market Cap Visualization)
  const renderTreemap = () => (
    <ResponsiveContainer width="100%" height={450}>
      <RechartsTreemap
        data={treeMapData}
        dataKey="size"
        aspectRatio={4/3}
        stroke="#fff"
        fill="#8884d8"
      >
        <Tooltip />
        {treeMapData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </RechartsTreemap>
    </ResponsiveContainer>
  );

  // 6. Funnel Chart (Value Distribution)
  const renderFunnelChart = () => (
    <ResponsiveContainer width="100%" height={450}>
      <FunnelChart>
        <Tooltip />
        <Funnel dataKey="value"
          data={cryptoData}
          nameKey="name"
        >
          {cryptoData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'composed': return renderComposedChart();
      case 'radar': return renderRadarChart();
      case 'scatter': return renderScatterChart();
      case 'area': return renderAreaChart();
      case 'treemap': return renderTreemap();
      case 'funnel': return renderFunnelChart();
      default: return renderComposedChart();
    }
  };

  return (
    <div className="advanced-chart-container">
       <div className="data-summary-panel">
        <h3>Market Summary</h3>
        <div className="crypto-grid">
          {cryptoData.map((crypto, index) => (
            <div key={index} className="crypto-card" style={{ borderLeft: `4px solid ${COLORS[index]}` }}>
              <div className="crypto-header">
                <span className="crypto-name">{crypto.name}</span>
                <span className={`crypto-change ${crypto.change >= 0 ? 'positive' : 'negative'}`}>
                  {crypto.change}%
                </span>
              </div>
              <div className="crypto-value">${crypto.value.toFixed(2)}</div>
              <div className="crypto-volume">Vol: ${crypto.volume.toFixed(0)}M</div>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-control-panel">
        <h2>Crypto Analytics Dashboard</h2>
        <div className="control-group">
          <div className="control-item">
            <label>Chart Type:</label>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              className="chart-select"
            >
              <option value="composed">Composed Chart</option>
              <option value="radar">Radar Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="area">Area Chart</option>
              <option value="treemap">Market Cap Treemap</option>
              <option value="funnel">Value Funnel</option>
            </select>
          </div>
          
          <div className="control-item">
            <label>Time Range:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="chart-display-area">
        {renderChart()}
      </div>

     
    </div>
  );
});

export default PerformanceChart;