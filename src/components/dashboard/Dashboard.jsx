import React, { useState, useEffect } from 'react';
import { MOCK_BANKS } from './mockData';
import { FileText, BookOpen, RefreshCw, ChevronRight, SlidersHorizontal } from 'lucide-react';

/* ── 1. Gauge Chart (Concentric arc gradient) ──────────────────────────────── */
function GaugeChart({ score, status }) {
  const R = 72, cx = 100, cy = 88;
  const circumference = Math.PI * R;
  const filled = score * circumference;
  const path = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;
  
  // Dynamic color selection based on calculated status
  const color = status === 'FRAGILE' ? '#FF6B6B' : status === 'VULNERABLE' ? '#F59E0B' : '#6E68E7';

  return (
    <div className="w-full flex justify-center items-center">
      <svg viewBox="0 0 200 110" className="w-[180px] h-[95px] overflow-visible">
        <defs>
          <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6E68E7" />
            <stop offset="70%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
        </defs>
        
        {/* Background track */}
        <path d={path} fill="none" stroke="#F1F5F9" strokeWidth="16" strokeLinecap="round" />
        
        {/* Active dynamic gradient track */}
        <path d={path} fill="none" stroke="url(#gg)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`} className="transition-all duration-700 ease-out" />
        
        {/* Rotating Pointer needle */}
        <g transform={`rotate(${score * 180 - 90}, ${cx}, ${cy})`} className="transition-transform duration-700 ease-out">
          <line x1={cx} y1={cy} x2={cx - 68} y2={cy} stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="6" fill="#334155" />
        </g>
        
        {/* Central Text HUD */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="30" fontWeight="900" fill={color} fontFamily="Inter, sans-serif" className="tracking-tighter">
          {Math.round(score * 100)}%
        </text>
        
        {/* Floating pill badge */}
        <g transform={`translate(${cx - 24}, ${cy})`}>
          <rect width="48" height="14" rx="4" fill={color} />
          <text x="24" y="9" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="white" fontFamily="Inter, sans-serif" letterSpacing="0.5">
            {status}
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ── 2. Line Chart (Historical solid & forecast dashed) ────────────────────── */
function LineChart({ trend }) {
  const W = 280, H = 140, pad = { l: 20, r: 20, t: 20, b: 25 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  
  const xs = trend.map((_, i) => pad.l + (i / (trend.length - 1)) * iW);
  const ys = trend.map(p => pad.t + iH - p.score * iH);
  
  // Historical solid segment
  const histPts = trend.filter(p => !p.forecast);
  const solidPath = histPts.map((p, i) => {
    const idx = trend.indexOf(p);
    return `${i === 0 ? 'M' : 'L'} ${xs[idx]} ${ys[idx]}`;
  }).join(' ');
  
  // Forecast dashed segment
  const lastHistIdx = trend.findLastIndex(p => !p.forecast);
  const firstForeIdx = trend.findIndex(p => p.forecast);
  const dashPath = firstForeIdx >= 0
    ? `M ${xs[lastHistIdx]} ${ys[lastHistIdx]} L ${xs[firstForeIdx]} ${ys[firstForeIdx]}`
    : '';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
      {/* Horizontal grids */}
      {[0.25, 0.5, 0.75].map(v => (
        <line key={v} x1={pad.l} y1={pad.t + iH - v * iH} x2={W - pad.r} y2={pad.t + iH - v * iH}
          stroke="#F1F5F9" strokeWidth="1" strokeDasharray="2,2" />
      ))}
      
      {/* Paths */}
      <path d={solidPath} fill="none" stroke="#6E68E7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {dashPath && <path d={dashPath} fill="none" stroke="#6E68E7" strokeWidth="3" strokeDasharray="5,4" strokeLinecap="round" />}
      
      {/* Coordinate nodes */}
      {trend.map((p, i) => (
        <g key={i} className="group">
          <circle cx={xs[i]} cy={ys[i]} r="4.5" fill={p.forecast ? '#FF6B6B' : '#6E68E7'} stroke="white" strokeWidth="2" className="transition-all duration-300 hover:scale-150 cursor-pointer" />
          <text x={xs[i]} y={ys[i] - 9} textAnchor="middle" fontSize="8" fontWeight="800" fill={p.forecast ? '#FF6B6B' : '#6E68E7'} fontFamily="Inter, sans-serif" className="opacity-0 group-hover:opacity-100 transition-opacity">
            {Math.round(p.score * 100)}%
          </text>
        </g>
      ))}
      
      {/* X-axis labels */}
      {trend.map((p, i) => (
        <text key={i} x={xs[i]} y={H - 5} textAnchor="middle" fontSize="8.5" fontWeight="800"
          fill={p.forecast ? '#6E68E7' : '#94A3B8'} fontFamily="Inter, sans-serif">
          {p.forecast ? `${p.year} (P)` : p.year}
        </text>
      ))}
    </svg>
  );
}

/* ── 3. Diamond Radar Chart (Target vs Interactive Current) ────────────────── */
function RadarChart({ radar, sliders }) {
  const cx = 110, cy = 100, R = 68;
  const angles = { ltd: -Math.PI / 2, npl: 0, roa: Math.PI / 2, esg: Math.PI };
  
  // Calculate dynamic current coordinates reflecting slider values in real-time
  const getDynamicValue = (key) => {
    if (key === 'ltd') return Math.max(0.2, Math.min(1.0, sliders.ltd));
    if (key === 'npl') return Math.max(0.2, Math.min(1.0, 1.0 - sliders.npl * 3.5)); // inverted risk direction
    if (key === 'roa') return Math.max(0.2, Math.min(1.0, sliders.roa * 18));
    if (key === 'esg') return Math.max(0.2, Math.min(1.0, sliders.esg));
    return 0.5;
  };

  const pt = (key, val) => {
    const a = angles[key];
    return `${cx + R * val * Math.cos(a)},${cy + R * val * Math.sin(a)}`;
  };
  
  const grid = [0.25, 0.5, 0.75, 1].map(v => {
    return Object.keys(angles).map(k => pt(k, v)).join(' ');
  });
  
  const tgtPts = Object.keys(angles).map(k => pt(k, radar.target[k])).join(' ');
  const curPts = Object.keys(angles).map(k => pt(k, getDynamicValue(k))).join(' ');
  
  const labels = [
    { key: 'ltd', x: cx, y: cy - R - 12, label: 'LTD' },
    { key: 'npl', x: cx + R + 15, y: cy + 3, label: 'NPL' },
    { key: 'roa', x: cx, y: cy + R + 14, label: 'ROA' },
    { key: 'esg', x: cx - R - 17, y: cy + 3, label: 'ESG' },
  ];

  return (
    <svg viewBox="0 0 220 200" className="w-full h-full overflow-visible">
      {/* Concentric grids */}
      {grid.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#F1F5F9" strokeWidth="1" />
      ))}
      
      {/* Axis spokes */}
      {Object.keys(angles).map(k => {
        const [x, y] = pt(k, 1).split(',');
        return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke="#F1F5F9" strokeWidth="1" />;
      })}
      
      {/* Target layer */}
      <polygon points={tgtPts} fill="rgba(110, 104, 231, 0.2)" stroke="#6E68E7" strokeWidth="1.5" />
      
      {/* Current live layer */}
      <polygon points={curPts} fill="rgba(251, 113, 133, 0.35)" stroke="#FF6B6B" strokeWidth="2.5" className="transition-all duration-300 ease-out" />
      
      {/* Labels */}
      {labels.map(l => (
        <text key={l.key} x={l.x} y={l.y} textAnchor="middle" alignmentBaseline="middle"
          fontSize="9.5" fontWeight="900" fill="#64748B" fontFamily="Inter, sans-serif">{l.label}</text>
      ))}
    </svg>
  );
}

/* ── 4. Slider Row ─────────────────────────────────────────────────────────── */
function SliderRow({ label, value, min, max, step, fmt, onChange }) {
  return (
    <div className="py-2.5 space-y-[6px] select-none">
      <div className="flex justify-between items-center text-[11px]">
        <span className="font-bold text-slate-500 max-w-[70%] truncate" title={label}>{label}</span>
        <span className="font-black text-[#6E68E7] shrink-0">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-[4px] rounded-full appearance-none cursor-pointer accent-[#6E68E7] bg-slate-100 hover:bg-slate-200 transition-colors" />
    </div>
  );
}

/* ── 5. Main Dashboard View Component ──────────────────────────────────────── */
export default function Dashboard({ onBackToOnboarding }) {
  const [bankId, setBankId] = useState('BANK1');
  const [sliders, setSliders] = useState(MOCK_BANKS.BANK1.sliders);
  const [data, setData] = useState(MOCK_BANKS.BANK1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSliders(MOCK_BANKS[bankId].sliders);
    setData(MOCK_BANKS[bankId]);
  }, [bankId]);

  const sl = (key, val) => setSliders(p => ({ ...p, [key]: val }));

  // Stress-testing simulation calculation
  const applyScenario = () => {
    setRunning(true);
    setTimeout(() => {
      const base = MOCK_BANKS[bankId];
      const def = base.sliders;
      let delta = 0;
      delta += (sliders.ltd - def.ltd) * 0.7;
      delta += (sliders.npl - def.npl) * 1.5;
      delta -= (sliders.liquidAssets - def.liquidAssets) * 0.6;
      delta -= (sliders.car - def.car) * 0.8;
      delta -= (sliders.roa - def.roa) * 2.5;
      
      const newScore = Math.max(0.08, Math.min(0.95, base.prediction_summary.fragility_score + delta));
      const status = newScore > 0.65 ? 'FRAGILE' : newScore > 0.38 ? 'VULNERABLE' : 'STABLE';
      
      setData(prev => ({
        ...prev,
        sliders,
        prediction_summary: { ...prev.prediction_summary, fragility_score: parseFloat(newScore.toFixed(2)), status },
        trend: prev.trend.map(p => p.forecast ? { ...p, score: parseFloat(newScore.toFixed(2)) } : p),
      }));
      setRunning(false);
    }, 500);
  };

  const reset = () => {
    setSliders(MOCK_BANKS[bankId].sliders);
    setData(MOCK_BANKS[bankId]);
  };

  const { prediction_summary: ps, top_driver, trend, radar, impact_drivers, grid } = data;
  const isFragile = ps.status === 'FRAGILE';
  const statusColor = isFragile ? '#FF6B6B' : ps.status === 'VULNERABLE' ? '#F59E0B' : '#6E68E7';
  const pct = v => `${(v * 100).toFixed(1)}%`;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-white font-sans text-slate-800 select-none">

      {/* ── HEADER ── */}
      <header className="h-[74px] shrink-0 flex items-center justify-between border-b border-slate-100 px-8 w-full bg-white select-none">
        {/* Left identity branding */}
        <div className="flex items-center gap-3 w-80 shrink-0">
          <button onClick={onBackToOnboarding}
            className="w-9 h-9 rounded-full bg-[#6E68E7]/10 hover:bg-[#6E68E7]/20 flex items-center justify-center text-[#6E68E7] transition-all cursor-pointer shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex flex-col justify-center leading-none">
            <span className="font-extrabold text-[10px] text-slate-800 tracking-widest uppercase block">Random</span>
            <span className="font-black text-[13px] text-[#6E68E7] tracking-widest uppercase mt-0.5 block">Forest</span>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-slate-900 tracking-[0.02em] leading-none truncate">
            Liquidity Fragility AI Monitor
          </h1>
          <p className="text-[10px] text-slate-400 font-bold mt-1.5 leading-none truncate">
            Strategic Portfolio Risk Assessment & Fragility Forecasting
          </p>
        </div>

        {/* Right Bank pills with custom premium padding */}
        <div className="flex items-center gap-4 shrink-0">
          {Object.values(MOCK_BANKS).map(b => (
            <button key={b.id} onClick={() => setBankId(b.id)}
              className={`px-7 py-2.5 rounded-full text-xs font-black border transition-all duration-300 ${
                bankId === b.id
                  ? 'bg-[#6E68E7] text-white border-[#6E68E7] shadow-lg shadow-[#6E68E7]/20'
                  : 'bg-white text-[#6E68E7] border-slate-200 hover:border-[#6E68E7]'
              }`}>
              {b.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── LAYOUT VIEWPORT ── */}
      <div className="flex-1 flex overflow-hidden w-full">

        {/* ⬅️ EXPANDED SIDEBAR (w-80 / 320px) */}
        <aside className="w-80 shrink-0 border-r border-slate-100 bg-white flex flex-col h-full overflow-hidden select-none">
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
              Simulate Results
            </h2>

            {/* Vertically Spacious Slider Rows */}
            <div className="divide-y divide-slate-50/50 pr-1">
              <SliderRow label="Ret. on Assets (ROA)" value={sliders.roa} min={0} max={0.05} step={0.001} fmt={v => `${(v*100).toFixed(1)}%`} onChange={v => sl('roa', v)} />
              <SliderRow label="Loan-to-Deposit (LTD)" value={sliders.ltd} min={0.3} max={1.5} step={0.01} fmt={pct} onChange={v => sl('ltd', v)} />
              <SliderRow label="Liquid assets ratio" value={sliders.liquidAssets} min={0.1} max={0.9} step={0.01} fmt={pct} onChange={v => sl('liquidAssets', v)} />
              <SliderRow label="Non-Perf. Loans (NPL)" value={sliders.npl} min={0} max={0.2} step={0.001} fmt={v => `${(v*100).toFixed(1)}%`} onChange={v => sl('npl', v)} />
              <SliderRow label="Bank size" value={sliders.bankSize} min={0.1} max={1.0} step={0.01} fmt={pct} onChange={v => sl('bankSize', v)} />
              <SliderRow label="CAR" value={sliders.car} min={0.1} max={1.0} step={0.01} fmt={pct} onChange={v => sl('car', v)} />
              <SliderRow label="EGX30" value={sliders.egx30} min={0.1} max={1.0} step={0.01} fmt={pct} onChange={v => sl('egx30', v)} />
              <SliderRow label="Inflation Rate" value={sliders.inflation} min={0.1} max={1.0} step={0.01} fmt={pct} onChange={v => sl('inflation', v)} />
              <SliderRow label="ESG Score" value={sliders.esg} min={0.1} max={1.0} step={0.01}
                fmt={v => v > 0.85 ? 'AA+' : v > 0.7 ? 'AA' : v > 0.55 ? 'A+' : 'A'} onChange={v => sl('esg', v)} />
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 space-y-3 border-t border-slate-100 bg-white shrink-0">
            <button onClick={applyScenario} disabled={running}
              className="w-full py-3 bg-[#6E68E7] hover:bg-[#5C56D6] disabled:opacity-70 text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#6E68E7]/25 flex items-center justify-center gap-2 cursor-pointer">
              {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              Apply Scenario
            </button>
            <button onClick={reset}
              className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors border-0 bg-transparent cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> Reset to Default
            </button>

            {/* Export options card */}
            <div className="pt-3 border-t border-slate-50 space-y-2">
              <button className="w-full py-2.5 bg-[#6E68E7]/8 hover:bg-[#6E68E7]/15 border border-[#6E68E7]/20 text-[#6E68E7] text-[10px] font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                <FileText className="w-4 h-4" /> Export Report
              </button>
              <button className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-[9.5px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors border-0 bg-transparent cursor-pointer">
                <BookOpen className="w-4 h-4" /> Knowledge Base
              </button>
            </div>
          </div>
        </aside>

        {/* ➡️ RIGHT MAIN RESULTS PANEL (Clean & Spacious floating rounded workspace) */}
        <div className="flex-1 bg-white p-4 h-full overflow-hidden flex flex-col">
          <main className="flex-1 bg-[#F7F8FA] rounded-[32px] overflow-y-auto p-8 flex flex-col gap-6 select-none h-full shadow-inner">

          {/* ── ROW 1: KPI OVERVIEW (Fixed Height: h-48) ── */}
          <div className="grid grid-cols-3 gap-6 h-48 shrink-0">

            {/* KPI 1: TOP IMPACT DRIVER */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Top Impact Driver
              </span>
              <div className="min-w-0">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-2 truncate max-w-full">
                  {top_driver.name}
                </h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-2 leading-relaxed truncate max-w-full" title={top_driver.description}>
                  {top_driver.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                <span className="text-[9.5px] font-black text-slate-300 uppercase tracking-wider">Sector Cap</span>
                <span className="text-2xl font-black leading-none shrink-0" style={{ color: statusColor }}>
                  {top_driver.sector_gap}
                </span>
              </div>
            </div>

            {/* KPI 2: FRAGILITY SCORE */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-between h-full hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full text-left">
                Fragility Score
              </span>
              <div className="w-full mt-1.5">
                <GaugeChart score={ps.fragility_score} status={ps.status} />
              </div>
              <span className="text-[9.5px] text-slate-400 font-bold mt-1 block">
                Confidence Interval: {ps.confidence_interval}
              </span>
            </div>

            {/* KPI 3: SMART RECOMMENDATION */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Smart Recommendation
              </span>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h3 className="text-lg font-black text-slate-800 leading-tight tracking-tight uppercase">
                  Stability Action
                </h3>
                <p className="text-[10.5px] text-slate-500 font-semibold mt-1.5 leading-relaxed line-clamp-3 max-w-full" title={ps.recommendation}>
                  {ps.recommendation}
                </p>
              </div>
              <button className="flex items-center gap-1.5 text-[#6E68E7] text-[10px] font-black uppercase tracking-wider hover:gap-2.5 transition-all border-0 bg-transparent py-0.5 cursor-pointer self-start leading-none shrink-0">
                View Action Plan <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* ── ROW 2: GRAPHICS DEEP-DIVE (Increased to h-[325px] to prevent clipping) ── */}
          <div className="grid grid-cols-3 gap-6 h-[325px] shrink-0">

            {/* Chart 1: Line Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-snug max-w-[70%] truncate">
                  Liquidity Fragility Trend
                </span>
                
                {/* Micro legend */}
                <div className="flex gap-2.5 text-[8.5px] font-black text-slate-400 shrink-0">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 border-t-2 border-[#6E68E7]"></span> Actual
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 border-t-2 border-dashed border-[#6E68E7]"></span> Forecast
                  </span>
                </div>
              </div>
              
              <div className="h-44 w-full flex items-center justify-center overflow-hidden">
                <LineChart trend={trend} />
              </div>
            </div>

            {/* Chart 2: Diamond Radar Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Current State vs Target
              </span>
              
              <div className="h-44 w-full flex items-center justify-center overflow-hidden my-0.5">
                <RadarChart radar={radar} sliders={sliders} />
              </div>
              
              <div className="flex justify-center gap-5 mt-1 border-t border-slate-50 pt-2 shrink-0">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6E68E7]"></span> Target
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]"></span> Current
                </span>
              </div>
            </div>

            {/* Chart 3: Ordered Impact Drivers */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div className="shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Primary Impact Drivers
                </span>
                <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">
                  Shows whether a variable is driving the bank toward Stability (+) or Fragility (-).
                </p>
              </div>
              
              {/* Dynamic scroll list */}
              <div className="h-44 overflow-y-auto space-y-3 mt-3 pr-1">
                {impact_drivers.map((d, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-500 uppercase truncate max-w-[75%]" title={d.name}>{d.name}</span>
                      <span className={`shrink-0 ${d.safe ? 'text-[#6E68E7]' : 'text-[#FF6B6B]'}`}>
                        {d.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-[4px] bg-slate-100 rounded-full overflow-hidden w-full">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        d.safe ? 'bg-[#6E68E7]' : i === impact_drivers.length - 1 ? 'bg-slate-700' : 'bg-[#FF6B6B]'
                      }`} style={{ width: `${d.value * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── ROW 3: INTELLIGENCE GRID (Spacious Table Card) ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col p-6 hover:shadow-md transition-shadow shrink-0">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-black text-[#6E68E7] uppercase tracking-widest">
                Variable Intelligence Grid
              </span>
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-wider transition-colors border-0 bg-transparent cursor-pointer py-0.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Variables
              </button>
            </div>
            
            <div className="overflow-x-auto w-full mt-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[9px] font-black text-slate-450 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-3 font-black">Variable</th>
                    <th className="px-5 py-3 font-black">Category</th>
                    <th className="px-5 py-3 font-black">Current Value</th>
                    <th className="px-5 py-3 font-black">Actionable Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/65 text-[11px] font-bold text-slate-600">
                  {grid.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-black text-slate-800 truncate max-w-[200px]" title={row.variable}>
                        {row.variable}
                      </td>
                      <td className="px-5 py-3.5 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider inline-block ${
                          row.category === 'INTERNAL'
                            ? 'bg-[#EEEEFF] text-[#6E68E7] border border-indigo-150/40'
                            : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                        }`}>
                          {row.category}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 font-black ${row.safe ? 'text-[#6E68E7]' : 'text-[#FF6B6B]'}`}>
                        Current: {row.variable.includes('Capital Adequacy') ? sliders.car.toFixed(2) : row.value}
                      </td>
                      <td className="px-5 py-3.5 text-[10.5px] font-bold text-slate-400 leading-relaxed max-w-[400px] truncate" title={row.rec}>
                        {row.critical && <span className="text-[#FF6B6B] font-black uppercase">CRITICAL: </span>}
                        {row.rec}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          </main>
        </div>
      </div>
    </div>
  );
}
