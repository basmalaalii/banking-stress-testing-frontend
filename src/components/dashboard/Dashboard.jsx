import React, { useState, useEffect } from 'react';
import { MOCK_BANKS } from './mockData';
import { FileText, BookOpen, RefreshCw, ChevronRight, SlidersHorizontal } from 'lucide-react';

/* ── Gauge Chart ────────────────────────────────────────── */
function GaugeChart({ score, status }) {
  const R = 72, cx = 100, cy = 88;
  const circumference = Math.PI * R;
  const filled = score * circumference;
  const path = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;
  const color = status === 'FRAGILE' ? '#FF6B6B' : status === 'VULNERABLE' ? '#F59E0B' : '#6E68E7';
  return (
    <svg viewBox="0 0 200 110" className="w-full">
      <defs>
        <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6E68E7" />
          <stop offset="70%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="#1E293B" strokeWidth="18" strokeLinecap="round" />
      <path d={path} fill="none" stroke="url(#gg)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`} className="transition-all duration-700" />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="28" fontWeight="900" fill={color} fontFamily="sans-serif">
        {Math.round(score * 100)}%
      </text>
      <rect x={cx - 22} y={cy - 2} width="44" height="14" rx="4" fill={color} />
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="white" fontFamily="sans-serif">
        {status}
      </text>
    </svg>
  );
}

/* ── Line Chart ─────────────────────────────────────────── */
function LineChart({ trend }) {
  const W = 260, H = 90, pad = { l: 10, r: 10, t: 10, b: 22 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const xs = trend.map((_, i) => pad.l + (i / (trend.length - 1)) * iW);
  const ys = trend.map(p => pad.t + iH - p.score * iH);
  const histPts = trend.filter(p => !p.forecast);
  const solidPath = histPts.map((p, i) => {
    const idx = trend.indexOf(p);
    return `${i === 0 ? 'M' : 'L'} ${xs[idx]} ${ys[idx]}`;
  }).join(' ');
  const lastHistIdx = trend.findLastIndex(p => !p.forecast);
  const firstForeIdx = trend.findIndex(p => p.forecast);
  const dashPath = firstForeIdx >= 0
    ? `M ${xs[lastHistIdx]} ${ys[lastHistIdx]} L ${xs[firstForeIdx]} ${ys[firstForeIdx]}`
    : '';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0.25, 0.5, 0.75].map(v => (
        <line key={v} x1={pad.l} y1={pad.t + iH - v * iH} x2={W - pad.r} y2={pad.t + iH - v * iH}
          stroke="#F1F5F9" strokeWidth="1" />
      ))}
      <path d={solidPath} fill="none" stroke="#6E68E7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {dashPath && <path d={dashPath} fill="none" stroke="#6E68E7" strokeWidth="2.5" strokeDasharray="5,4" strokeLinecap="round" />}
      {trend.map((p, i) => (
        <circle key={i} cx={xs[i]} cy={ys[i]} r="3.5" fill={p.forecast ? '#FF6B6B' : '#6E68E7'} stroke="white" strokeWidth="1.5" />
      ))}
      {trend.map((p, i) => (
        <text key={i} x={xs[i]} y={H - 4} textAnchor="middle" fontSize="7.5" fontWeight="700"
          fill={p.forecast ? '#6E68E7' : '#94A3B8'} fontFamily="sans-serif">
          {p.forecast ? `${p.year}(P)` : p.year}
        </text>
      ))}
    </svg>
  );
}

/* ── Diamond Radar Chart ────────────────────────────────── */
function RadarChart({ radar }) {
  const cx = 110, cy = 100, R = 62;
  const angles = { ltd: -Math.PI / 2, npl: 0, roa: Math.PI / 2, esg: Math.PI };
  const pt = (key, val) => {
    const a = angles[key];
    return `${cx + R * val * Math.cos(a)},${cy + R * val * Math.sin(a)}`;
  };
  const grid = [0.25, 0.5, 0.75, 1].map(v => {
    const keys = Object.keys(angles);
    return keys.map(k => pt(k, v)).join(' ');
  });
  const tgtPts = Object.keys(angles).map(k => pt(k, radar.target[k])).join(' ');
  const curPts = Object.keys(angles).map(k => pt(k, radar.current[k])).join(' ');
  const labels = [
    { key: 'ltd', x: cx, y: cy - R - 10, label: 'LTD' },
    { key: 'npl', x: cx + R + 12, y: cy + 3, label: 'NPL' },
    { key: 'roa', x: cx, y: cy + R + 12, label: 'ROA' },
    { key: 'esg', x: cx - R - 14, y: cy + 3, label: 'ESG' },
  ];
  return (
    <svg viewBox="0 0 220 200" className="w-full h-full">
      {grid.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
      ))}
      {Object.keys(angles).map(k => {
        const [x, y] = pt(k, 1).split(',');
        return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke="#E2E8F0" strokeWidth="0.75" />;
      })}
      <polygon points={tgtPts} fill="rgba(110,104,231,0.25)" stroke="#6E68E7" strokeWidth="1.5" />
      <polygon points={curPts} fill="rgba(251,113,133,0.4)" stroke="#FB7185" strokeWidth="2" className="transition-all duration-500" />
      {labels.map(l => (
        <text key={l.key} x={l.x} y={l.y} textAnchor="middle" alignmentBaseline="middle"
          fontSize="9" fontWeight="800" fill="#64748B" fontFamily="sans-serif">{l.label}</text>
      ))}
    </svg>
  );
}

/* ── Slider Row ─────────────────────────────────────────── */
function SliderRow({ label, value, min, max, step, fmt, onChange }) {
  return (
    <div className="space-y-[3px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold text-slate-500">{label}</span>
        <span className="text-[10px] font-bold text-[#6E68E7]">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#6E68E7] bg-slate-200" />
    </div>
  );
}

/* ── Dashboard ──────────────────────────────────────────── */
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

  const applyScenario = () => {
    setRunning(true);
    setTimeout(() => {
      const base = MOCK_BANKS[bankId];
      const def = base.sliders;
      let delta = 0;
      delta += (sliders.ltd - def.ltd) * 0.6;
      delta += (sliders.npl - def.npl) * 1.2;
      delta -= (sliders.liquidAssets - def.liquidAssets) * 0.5;
      delta -= (sliders.car - def.car) * 0.7;
      delta -= (sliders.roa - def.roa) * 2.0;
      const newScore = Math.max(0.05, Math.min(0.95, base.prediction_summary.fragility_score + delta));
      const status = newScore > 0.65 ? 'FRAGILE' : newScore > 0.38 ? 'VULNERABLE' : 'STABLE';
      setData(prev => ({
        ...prev,
        sliders,
        prediction_summary: { ...prev.prediction_summary, fragility_score: parseFloat(newScore.toFixed(2)), status },
        trend: prev.trend.map(p => p.forecast ? { ...p, score: parseFloat(newScore.toFixed(2)) } : p),
      }));
      setRunning(false);
    }, 600);
  };

  const reset = () => { setSliders(MOCK_BANKS[bankId].sliders); setData(MOCK_BANKS[bankId]); };

  const { prediction_summary: ps, top_driver, trend, radar, impact_drivers, grid } = data;
  const isFragile = ps.status === 'FRAGILE';
  const statusColor = isFragile ? '#FF6B6B' : ps.status === 'VULNERABLE' ? '#F59E0B' : '#6E68E7';

  const pct = v => `${(v * 100).toFixed(1)}%`;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-white font-sans select-none">

      {/* ── HEADER ── */}
      <header className="h-[58px] shrink-0 flex items-center border-b border-slate-100 px-5 gap-4">
        {/* Logo block */}
        <div className="flex items-center gap-2.5 w-[210px] shrink-0">
          <button onClick={onBackToOnboarding}
            className="w-8 h-8 rounded-full bg-[#6E68E7]/10 hover:bg-[#6E68E7]/20 flex items-center justify-center text-[#6E68E7] transition-all shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="leading-none">
            <div className="text-[11px] font-black text-slate-800 tracking-widest uppercase">Random</div>
            <div className="text-[13px] font-black text-[#6E68E7] tracking-widest uppercase -mt-0.5">Forest</div>
          </div>
        </div>

        {/* Title */}
        <div className="flex-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Liquidity Fragility AI Monitor</h1>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Strategic Portfolio Risk Assessment & Fragility Forecasting</p>
        </div>

        {/* Bank Pills */}
        <div className="flex items-center gap-2">
          {Object.values(MOCK_BANKS).map(b => (
            <button key={b.id} onClick={() => setBankId(b.id)}
              className={`px-5 py-1.5 rounded-full text-xs font-extrabold border transition-all duration-200 ${
                bankId === b.id
                  ? 'bg-[#6E68E7] text-white border-[#6E68E7] shadow-md shadow-[#6E68E7]/20'
                  : 'bg-white text-[#6E68E7] border-[#6E68E7]/60 hover:border-[#6E68E7]'
              }`}>
              {b.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className="w-[210px] shrink-0 border-r border-slate-100 bg-white flex flex-col overflow-y-auto">
          <div className="p-4 flex-1 space-y-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Simulate Results</p>

            <div className="space-y-3">
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

          {/* Sidebar Actions */}
          <div className="p-4 space-y-2 border-t border-slate-100">
            <button onClick={applyScenario} disabled={running}
              className="w-full py-2.5 bg-[#6E68E7] hover:bg-[#5A54D4] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#6E68E7]/25 flex items-center justify-center gap-1.5 disabled:opacity-60">
              {running ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
              Apply Scenario
            </button>
            <button onClick={reset}
              className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors">
              <RefreshCw className="w-3 h-3" /> Reset to Default
            </button>

            <div className="pt-2 space-y-1.5">
              <button className="w-full py-2 bg-[#6E68E7]/8 hover:bg-[#6E68E7]/15 border border-[#6E68E7]/20 text-[#6E68E7] text-[9px] font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all">
                <FileText className="w-3 h-3" /> Export Report
              </button>
              <button className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors">
                <BookOpen className="w-3 h-3" /> Knowledge Base
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 bg-[#F7F8FA] overflow-y-auto p-4 flex flex-col gap-3">

          {/* ROW 1 — 3 cards */}
          <div className="grid grid-cols-3 gap-3 shrink-0">

            {/* Card: TOP IMPACT DRIVER */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 flex flex-col justify-between min-h-[170px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Top Impact Driver</p>
              <div>
                <h2 className="text-[26px] font-black text-slate-900 leading-none mt-2">{top_driver.name}</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-snug">{top_driver.description}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">Sector Cap</span>
                <span className="text-[22px] font-black" style={{ color: statusColor }}>{top_driver.sector_gap}</span>
              </div>
            </div>

            {/* Card: FRAGILITY SCORE */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 flex flex-col items-center justify-between min-h-[170px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-full">Fragility Score</p>
              <div className="w-full px-2">
                <GaugeChart score={ps.fragility_score} status={ps.status} />
              </div>
              <p className="text-[9px] text-slate-400 font-semibold">Confidence Interval: {ps.confidence_interval}</p>
            </div>

            {/* Card: SMART RECOMMENDATION */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 flex flex-col justify-between min-h-[170px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Smart Recommendation</p>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[18px] font-black text-slate-900 leading-tight">STABILITY<br />ACTION</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-2 leading-snug">{ps.recommendation}</p>
              </div>
              <button className="flex items-center gap-1 text-[#6E68E7] text-[10px] font-black uppercase tracking-wider hover:gap-2 transition-all">
                View Action Plan <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ROW 2 — 3 cards */}
          <div className="grid grid-cols-3 gap-3 shrink-0">

            {/* Card: LINE CHART */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-snug max-w-[140px]">Liquidity Fragility Trend & Forecasting</p>
                <div className="flex gap-2 text-[8px] font-bold text-slate-400 shrink-0">
                  <span className="flex items-center gap-1"><span className="inline-block w-4 border-t border-slate-400"></span> Actual</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-4 border-t border-dashed border-slate-400"></span> Forecast</span>
                </div>
              </div>
              <LineChart trend={trend} />
            </div>

            {/* Card: RADAR */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 flex flex-col">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current State vs Target</p>
              <div className="flex-1">
                <RadarChart radar={radar} />
              </div>
              <div className="flex justify-center gap-4 mt-1">
                <span className="flex items-center gap-1 text-[8.5px] font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#6E68E7]"></span> Target
                </span>
                <span className="flex items-center gap-1 text-[8.5px] font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#FB7185]"></span> Current
                </span>
              </div>
            </div>

            {/* Card: PRIMARY IMPACT DRIVERS */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 flex flex-col">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Impact Drivers</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-1 mb-3 leading-snug">
                Shows whether a variable is driving the bank toward Stability (+) or Fragility (-).
              </p>
              <div className="space-y-3 overflow-y-auto">
                {impact_drivers.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase">{d.name}</span>
                      <span className={`text-[9px] font-black ${d.safe ? 'text-[#6E68E7]' : 'text-[#FF6B6B]'}`}>
                        {d.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        d.safe ? 'bg-[#6E68E7]' : i === impact_drivers.length - 1 ? 'bg-slate-800' : 'bg-[#FF6B6B]'
                      }`} style={{ width: `${d.value * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3 — Intelligence Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 shrink-0">
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
              <span className="text-[11px] font-black text-[#6E68E7] uppercase tracking-wider">Variable Intelligence Grid</span>
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-[9px] font-black uppercase tracking-wider transition-colors">
                <SlidersHorizontal className="w-3 h-3" /> Filter Variables
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F7F8FA] text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-2.5">Variable</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Current Value / Status</th>
                    <th className="px-4 py-2.5">Actionable Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {grid.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-[11px] font-black text-slate-800">{row.variable}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                          row.category === 'INTERNAL'
                            ? 'bg-[#EEEEFF] text-[#6E68E7]'
                            : 'bg-slate-100 text-slate-500'
                        }`}>{row.category}</span>
                      </td>
                      <td className={`px-4 py-3 text-[10.5px] font-black ${row.safe ? 'text-[#6E68E7]' : 'text-[#FF6B6B]'}`}>
                        Current: {row.value}
                      </td>
                      <td className="px-4 py-3 text-[10px] font-semibold text-slate-500">
                        {row.critical && <span className="text-[#FF6B6B] font-black">CRITICAL: </span>}
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
  );
}
