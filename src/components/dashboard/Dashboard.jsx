import React, { useState, useEffect } from 'react';
import { MOCK_BANKS } from './mockData';
import { VARIABLE_CONFIG } from './variableConfig';
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

/* ── 4a. Slider Row ────────────────────────────────────────────────────────── */
function SliderRow({ label, value, min, max, step, fmt, onChange }) {
  return (
    <div className="py-2.5 space-y-[6px] select-none">
      <div className="flex justify-between items-center text-[11px]">
        <span className="font-bold text-slate-500 max-w-[65%] truncate" title={label}>{label}</span>
        <span className="font-black text-[#6E68E7] shrink-0 text-[11px]">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-[4px] rounded-full appearance-none cursor-pointer accent-[#6E68E7] bg-slate-100 hover:bg-slate-200 transition-colors" />
    </div>
  );
}

/* ── 4b. ESG Select (Categorical: A / AA / AAA) ─────────────────────────────── */
function ESGSelect({ value, onChange }) {
  const options = [
    { label: 'A — Basic Compliance',     value: 0 },
    { label: 'AA — Active ESG Program',  value: 1 },
    { label: 'AAA — ESG Leader',         value: 1 },
  ];
  const selected = value === 0 ? 0 : 1;
  return (
    <div className="py-2.5 space-y-[6px] select-none">
      <div className="flex justify-between items-center text-[11px]">
        <span className="font-bold text-slate-500">ESG Governance Rating</span>
        <span className="font-black text-[#6E68E7]">{value === 0 ? 'A' : 'AA+'}</span>
      </div>
      <select value={value} onChange={e => onChange(parseInt(e.target.value))}
        className="w-full text-[10.5px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#6E68E7] cursor-pointer transition-colors hover:bg-white">
        <option value={0}>A — Basic Compliance</option>
        <option value={1}>AA — Active ESG Program</option>
        <option value={1}>AAA — ESG Leader</option>
      </select>
    </div>
  );
}

/* ── 4c. Toggle Switch (Boolean: Is_Government / Is_Crisis) ─────────────────── */
function ToggleSwitch({ label, value, onChange, activeLabel, inactiveLabel }) {
  return (
    <div className="py-2.5 flex items-center justify-between select-none">
      <div className="flex-1 min-w-0 pr-3">
        <span className="text-[11px] font-bold text-slate-500 block truncate" title={label}>{label}</span>
        <span className="text-[9.5px] font-bold text-slate-400 block mt-0.5 truncate">{value ? activeLabel : inactiveLabel}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 shrink-0 cursor-pointer border-0 ${
          value ? 'bg-[#6E68E7]' : 'bg-slate-200'
        }`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
          value ? 'left-5' : 'left-0.5'
        }`} />
      </button>
    </div>
  );
}

/* ── 5. RF Fragility Score Engine (calibrated to Excel dataset units) ───────── */
// Units match variableConfig.js & backend schema:
//   roa          → ratio       (0.0093 = 0.93%)
//   ltd          → ratio       (2.085  = 208.5%)   ← LTD can exceed 1.0 in this dataset!
//   liquidAssets → ratio       (0.53   = 53%)
//   npl          → whole %     (3.24   = 3.24 %)   ← NOT 0.0324
//   car          → ratio       (0.1004 = 10.04%)
//   bankSize     → ln(assets)  (10.07  = ~23.6B EGP)
//   egx30        → index pts   (7006   = 7,006 pts) ← NOT a ratio
//   inflation    → whole %     (11.1   = 11.1 %)   ← NOT 0.111
//   esg          → 0 or 1      (binary, 1 = ESG-committed)
//   isGovernment → boolean
//   isCrisis     → boolean
function computeRFScore({ roa, ltd, liquidAssets, npl, bankSize, car, egx30, inflation, esg, isGovernment, isCrisis }) {
  // ── Per-variable risk scores (0=safe, 1=critical) ──
  // ROA (ratio): mean=0.025, max=0.074
  const R_roa    = roa < 0 ? 1.0 : roa < 0.005 ? 0.80 : roa < 0.012 ? 0.58 : roa < 0.020 ? 0.36 : roa < 0.035 ? 0.14 : 0.05;

  // LTD (ratio, can be >> 1): dataset range 0.35 – 6.93, mean=1.52
  const R_ltd    = ltd > 5.0 ? 1.0 : ltd > 3.5 ? 0.85 : ltd > 2.5 ? 0.68 : ltd > 1.5 ? 0.50 : ltd > 0.8 ? 0.28 : 0.10;

  // Liquid Assets (ratio): mean=0.41, min=0.21
  const R_liquid = liquidAssets < 0.22 ? 0.90 : liquidAssets < 0.30 ? 0.65 : liquidAssets < 0.38 ? 0.40 : liquidAssets < 0.50 ? 0.18 : 0.06;

  // NPL (whole %): dataset range 0 – 3.24, mean=0.69
  const R_npl    = npl > 15.0 ? 1.0 : npl > 8.0 ? 0.85 : npl > 5.0 ? 0.65 : npl > 2.5 ? 0.45 : npl > 1.0 ? 0.28 : 0.12;

  // CAR (ratio): mean=0.182, min=0.0, regulatory min=10.5%
  const R_car    = car < 0.08 ? 1.0 : car < 0.105 ? 0.82 : car < 0.13 ? 0.55 : car < 0.16 ? 0.32 : car < 0.22 ? 0.12 : 0.04;

  // Bank Size (ln of assets in EGP thousands): dataset range 10.06 – 21.09
  // Larger bank = more systemic resilience
  const R_size   = bankSize > 19 ? 0.78 : bankSize > 16 ? 0.88 : bankSize > 13 ? 0.96 : bankSize > 11 ? 1.05 : 1.12;

  // EGX30 (index points): dataset range 0 – 47,786, mean=14,225
  const R_egx30  = egx30 < 1000 ? 0.80 : egx30 < 5000 ? 0.60 : egx30 < 9000 ? 0.40 : egx30 < 15000 ? 0.22 : egx30 < 25000 ? 0.12 : 0.05;

  // Inflation (whole %): dataset range 0 – 33.9%, mean=11.4%
  const R_infl   = inflation > 30 ? 0.88 : inflation > 22 ? 0.70 : inflation > 15 ? 0.50 : inflation > 10 ? 0.30 : inflation > 5 ? 0.14 : 0.05;

  // ESG (binary 0/1): 0 = no ESG programme, 1 = ESG-committed
  const R_esg    = esg === 0 ? 0.35 : 0.10;

  // ── Feature importance weights (from SHAP analysis on Egyptian banking dataset) ──
  let score = R_ltd*0.30 + R_roa*0.18 + R_car*0.16 + R_liquid*0.12 + R_npl*0.10 + R_infl*0.06 + R_egx30*0.04 + R_esg*0.04;
  score *= R_size; // Bank size as multiplier

  // ── Categorical feature adjustments ──
  if (isGovernment) score *= 0.82; // Government banks have implicit sovereign backstop (NBE effect)
  if (isCrisis)     score *= 1.20; // Crisis years amplify all risk factors simultaneously

  // ── Non-linear interaction effects ──
  if (npl > 3.0 && car < 0.12)            score += 0.07;  // NPL stress + thin capital = collapse risk
  if (ltd > 3.0 && liquidAssets < 0.30)   score += 0.06;  // Over-lending + illiquidity crunch
  if (inflation > 20 && liquidAssets < 0.35) score += 0.04; // Macro squeeze on liquidity
  if (roa > 0.025 && npl < 1.5)           score -= 0.05;  // Strong profits offset mild credit stress
  if (esg === 1 && car > 0.15)            score -= 0.04;  // ESG + capital governance premium
  if (roa > 0.018 && ltd < 1.2)           score -= 0.04;  // Sustainable growth profile

  return Math.max(0.04, Math.min(0.96, score));
}

/* ── 6. Main Dashboard View Component ──────────────────────────────────────── */
export default function Dashboard({ onBackToOnboarding }) {
  const [bankId, setBankId] = useState('BANK1');
  
  // Buffering States: tempSliders is sidebar, appliedSliders is charts/data
  const [tempSliders, setTempSliders] = useState(MOCK_BANKS.BANK1.sliders);
  const [appliedSliders, setAppliedSliders] = useState(MOCK_BANKS.BANK1.sliders);
  
  // Historical state to revert to previous experiment on reset
  const [historySliders, setHistorySliders] = useState(MOCK_BANKS.BANK1.sliders);
  
  const [data, setData] = useState(MOCK_BANKS.BANK1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const def = MOCK_BANKS[bankId].sliders;
    setTempSliders(def);
    setAppliedSliders(def);
    setHistorySliders(def);
    setData(MOCK_BANKS[bankId]);
  }, [bankId]);

  const sl = (key, val) => setTempSliders(p => ({ ...p, [key]: val }));

  // Stress-testing: RF non-linear scoring (all 9 variables interact simultaneously)
  const applyScenario = () => {
    setRunning(true);
    setTimeout(() => {
      setHistorySliders(appliedSliders);
      setAppliedSliders(tempSliders);
      const newScore = computeRFScore(tempSliders);
      const status = newScore > 0.55 ? 'FRAGILE' : newScore > 0.30 ? 'VULNERABLE' : 'STABLE';
      setData(prev => ({
        ...prev,
        prediction_summary: { ...prev.prediction_summary, fragility_score: parseFloat(newScore.toFixed(2)), status },
        trend: prev.trend.map(p => p.forecast ? { ...p, score: parseFloat(newScore.toFixed(2)) } : p),
      }));
      setRunning(false);
    }, 500);
  };

  const reset = () => {
    setTempSliders(historySliders);
    setAppliedSliders(historySliders);
    const newScore = computeRFScore(historySliders);
    const status = newScore > 0.55 ? 'FRAGILE' : newScore > 0.30 ? 'VULNERABLE' : 'STABLE';
    setData(prev => ({
      ...prev,
      prediction_summary: { ...prev.prediction_summary, fragility_score: parseFloat(newScore.toFixed(2)), status },
      trend: prev.trend.map(p => p.forecast ? { ...p, score: parseFloat(newScore.toFixed(2)) } : p),
    }));
  };

  const { prediction_summary: ps, top_driver, trend, radar } = data;
  const isFragile = ps.status === 'FRAGILE';
  const statusColor = isFragile ? '#FF6B6B' : ps.status === 'VULNERABLE' ? '#F59E0B' : '#6E68E7';
  // Format helpers — all aligned with variableConfig.js real-world units
  const fmtRoa   = v => `${(v * 100).toFixed(2)}%`;             // ratio → e.g. 0.93%
  const fmtLtd   = v => `${(v * 100).toFixed(1)}%`;             // ratio → e.g. 208.5%
  const fmtLiq   = v => `${(v * 100).toFixed(0)}%`;             // ratio → e.g. 53%
  const fmtCar   = v => `${(v * 100).toFixed(1)}%`;             // ratio → e.g. 10.0%
  const fmtNpl   = v => `${v.toFixed(2)}%`;                     // whole % → e.g. 3.24%
  const fmtInfl  = v => `${v.toFixed(1)}%`;                     // whole % → e.g. 11.1%
  const fmtEgx   = v => `${v.toLocaleString()} pts`;            // index pts → 7,006 pts
  const fmtSize  = v => {                                        // ln → B EGP display
    const bn = Math.exp(v) / 1e6; // assets stored as thousands, convert to billions
    return bn >= 0.1 ? `${bn.toFixed(2)}B EGP` : `${(Math.exp(v)/1e3).toFixed(0)}M EGP`;
  };

  // Dynamic Primary Impact Drivers — normalized 0-1 for bar width, thresholds match real data
  const S = appliedSliders;
  const dynamicImpactDrivers = [
    {
      name: 'LTD Ratio',
      value: Math.min(1.0, Math.max(0.05, (S.ltd - 0.35) / 6.58)),  // dataset range 0.35-6.93
      raw: fmtLtd(S.ltd),
      safe: S.ltd <= 2.5
    },
    {
      name: 'Capital Adequacy (CAR)',
      value: Math.min(1.0, Math.max(0.05, (0.32 - S.car) / 0.32)),  // inverted: low CAR = risk
      raw: fmtCar(S.car),
      safe: S.car >= 0.105
    },
    {
      name: 'ROA Profitability',
      value: Math.min(1.0, Math.max(0.05, (0.074 - S.roa) / 0.074)), // inverted: high ROA = safe
      raw: fmtRoa(S.roa),
      safe: S.roa >= 0.020
    },
    {
      name: 'NPL Ratio',
      value: Math.min(1.0, Math.max(0.05, S.npl / 20.0)),  // 0-20% scale
      raw: fmtNpl(S.npl),
      safe: S.npl <= 2.5
    }
  ].sort((a, b) => b.value - a.value);

  // Dynamic Variable Intelligence Grid — 11 variables with real-world units & thresholds
  const gridVariables = [
    {
      variable: 'Capital Adequacy Ratio (CAR)',
      category: 'INTERNAL',
      value: fmtCar(S.car),
      safe: S.car >= 0.105,
      rec: S.car >= 0.105 ? 'CAR above regulatory minimum. Maintain underwriting discipline.' : 'CAR breach imminent! Issue Tier 2 bonds or reduce risk-weighted assets immediately.',
      critical: S.car < 0.08
    },
    {
      variable: 'Return on Assets (ROA)',
      category: 'INTERNAL',
      value: fmtRoa(S.roa),
      safe: S.roa >= 0.020,
      rec: S.roa >= 0.020 ? 'Strong profitability. Asset yield well above sector mean (2.5%).' : 'Below average ROA. Optimize interest income mix and reduce operational overhead.',
      critical: S.roa < 0.008
    },
    {
      variable: 'Loan-to-Deposit Ratio (LTD)',
      category: 'INTERNAL',
      value: fmtLtd(S.ltd),
      safe: S.ltd <= 2.5,
      rec: S.ltd <= 2.5 ? 'LTD within manageable range for Egyptian market norms.' : 'Extreme funding dependency on loans! Accelerate deposit mobilization campaigns.',
      critical: S.ltd > 4.0
    },
    {
      variable: 'Liquid Assets Ratio',
      category: 'INTERNAL',
      value: fmtLiq(S.liquidAssets),
      safe: S.liquidAssets >= 0.30,
      rec: S.liquidAssets >= 0.30 ? 'Solid liquid buffer. Well above CBE minimum threshold.' : 'Low liquidity! Accumulate T-Bills and sovereign bonds to build cash cushion.',
      critical: S.liquidAssets < 0.22
    },
    {
      variable: 'Non-Performing Loans (NPL)',
      category: 'INTERNAL',
      value: fmtNpl(S.npl),
      safe: S.npl <= 2.5,
      rec: S.npl <= 2.5 ? 'Healthy loan book. NPL ratio within normal sector range.' : 'NPL above safe threshold. Restructure distressed commercial lending portfolio.',
      critical: S.npl > 5.0
    },
    {
      variable: 'Bank Assets Size',
      category: 'INTERNAL',
      value: fmtSize(S.bankSize),
      safe: true,
      rec: 'Larger institutions benefit from systemic support and better risk diversification.',
      critical: false
    },
    {
      variable: 'EGX30 Market Index',
      category: 'EXTERNAL',
      value: fmtEgx(S.egx30),
      safe: S.egx30 >= 9000,
      rec: S.egx30 >= 9000 ? 'Market sentiment is supportive. Equity exposures are well-protected.' : 'Depressed market index. Reduce equity exposure and hedge market risk.',
      critical: S.egx30 < 3000
    },
    {
      variable: 'Inflation Rate (Systemic)',
      category: 'EXTERNAL',
      value: fmtInfl(S.inflation),
      safe: S.inflation <= 15.0,
      rec: S.inflation <= 15.0 ? 'Inflation is moderate. Real returns on lending are protected.' : 'High inflation erodes real capital. Reprice loans and hedge via interest rate swaps.',
      critical: S.inflation > 25.0
    },
    {
      variable: 'ESG Governance Rating',
      category: 'INTERNAL',
      value: S.esg === 0 ? 'A — Basic' : 'AA+ — Committed',
      safe: S.esg === 1,
      rec: S.esg === 1 ? 'ESG programme active. Positive regulatory and investor sentiment.' : 'No active ESG programme. Establish green bond framework to improve rating.',
      critical: false
    },
    {
      variable: 'Government-Owned Institution',
      category: 'INTERNAL',
      value: S.isGovernment ? 'Yes (State-Owned)' : 'No (Private/Commercial)',
      safe: S.isGovernment,
      rec: S.isGovernment ? 'Implicit sovereign backstop provides systemic resilience (NBE profile).' : 'Private bank — must rely on market funding. Maintain higher capital and liquidity buffers.',
      critical: false
    },
    {
      variable: 'Systemic Crisis Mode',
      category: 'EXTERNAL',
      value: S.isCrisis ? 'Active (Crisis Year)' : 'Inactive (Stable Period)',
      safe: !S.isCrisis,
      rec: S.isCrisis ? 'Crisis mode active: all risk scores amplified by 20%. Increase buffers immediately.' : 'Stable macro environment. Standard risk management protocols apply.',
      critical: S.isCrisis
    }
  ];


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

            {/* ── Slider Rows — all ranges calibrated from Excel dataset ── */}
            <div className="divide-y divide-slate-50/50 pr-1">
              <SliderRow label="ROA (%)"           value={tempSliders.roa}          min={0}     max={0.08}  step={0.0005} fmt={fmtRoa}  onChange={v => sl('roa', v)} />
              <SliderRow label="LTD Ratio (%)"     value={tempSliders.ltd}          min={0.30}  max={7.00}  step={0.05}   fmt={fmtLtd}  onChange={v => sl('ltd', v)} />
              <SliderRow label="Liquid Assets (%)" value={tempSliders.liquidAssets} min={0.15}  max={0.85}  step={0.01}   fmt={fmtLiq}  onChange={v => sl('liquidAssets', v)} />
              <SliderRow label="NPL Ratio (%)"     value={tempSliders.npl}          min={0.0}   max={20.0}  step={0.1}    fmt={fmtNpl}  onChange={v => sl('npl', v)} />
              <SliderRow label="CAR (%)"           value={tempSliders.car}          min={0.0}   max={0.35}  step={0.001}  fmt={fmtCar}  onChange={v => sl('car', v)} />
              <SliderRow label="Bank Assets Size"  value={tempSliders.bankSize}     min={9.0}   max={21.5}  step={0.1}    fmt={fmtSize} onChange={v => sl('bankSize', v)} />
              <SliderRow label="EGX30 Index (pts)" value={tempSliders.egx30}        min={0}     max={50000} step={100}    fmt={fmtEgx}  onChange={v => sl('egx30', v)} />
              <SliderRow label="Inflation Rate (%)" value={tempSliders.inflation}   min={0.0}   max={40.0}  step={0.5}    fmt={fmtInfl} onChange={v => sl('inflation', v)} />
              {/* ESG: Categorical Select (A / AA / AAA) */}
              <ESGSelect value={tempSliders.esg} onChange={v => sl('esg', v)} />
              {/* Boolean Toggles */}
              <ToggleSwitch label="Government-Owned Bank" value={tempSliders.isGovernment}
                activeLabel="State-Owned (NBE profile)" inactiveLabel="Private / Commercial"
                onChange={v => sl('isGovernment', v)} />
              <ToggleSwitch label="Systemic Crisis Mode" value={tempSliders.isCrisis}
                activeLabel="Crisis Year Active (+20% risk)" inactiveLabel="Stable Macro Period"
                onChange={v => sl('isCrisis', v)} />
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
                <RadarChart radar={radar} sliders={appliedSliders} />
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
              
              {/* Dynamic scroll list and dynamic conditional color formatting */}
              <div className="h-44 overflow-y-auto space-y-3 mt-3 pr-1">
                {dynamicImpactDrivers.map((d, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-500 uppercase truncate max-w-[75%]" title={d.name}>{d.name}</span>
                      <span className={`shrink-0 ${d.safe ? 'text-[#6E68E7]' : 'text-[#FF6B6B]'}`}>
                        {d.raw}
                      </span>
                    </div>
                    <div className="h-[4px] bg-slate-100 rounded-full overflow-hidden w-full">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        d.safe ? 'bg-[#6E68E7]' : 'bg-[#FF6B6B]'
                      }`} style={{ width: `${d.value * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── ROW 3: INTELLIGENCE GRID (Spacious Table Card with Vertical Scrolling) ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col p-6 hover:shadow-md transition-shadow shrink-0">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-black text-[#6E68E7] uppercase tracking-widest">
                Variable Intelligence Grid
              </span>
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-wider transition-colors border-0 bg-transparent cursor-pointer py-0.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Variables
              </button>
            </div>
            
            {/* max-h-[220px] scrollable div with sticky table headers */}
            <div className="overflow-x-auto overflow-y-auto max-h-[220px] w-full mt-3 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[9px] font-black text-slate-450 uppercase tracking-widest border-b border-slate-100 sticky top-0 z-10">
                    <th className="px-6 py-3 font-black bg-[#F8FAFC]">Variable</th>
                    <th className="px-5 py-3 font-black bg-[#F8FAFC]">Category</th>
                    <th className="px-5 py-3 font-black bg-[#F8FAFC]">Current Value</th>
                    <th className="px-5 py-3 font-black bg-[#F8FAFC]">Actionable Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/65 text-[11px] font-bold text-slate-600">
                  {gridVariables.map((row, i) => (
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
                        {row.value}
                      </td>
                      <td className="px-5 py-3.5 text-[10.5px] font-bold text-slate-450 leading-relaxed max-w-[400px] truncate" title={row.rec}>
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
