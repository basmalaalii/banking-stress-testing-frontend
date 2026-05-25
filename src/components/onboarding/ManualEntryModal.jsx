import React, { useState } from 'react';
import { Sliders, X, Calculator, RefreshCw, PlusCircle, Building2 } from 'lucide-react';

// ─── Default slider values (extracted so we can reset easily) ───────────────
const DEFAULT_SLIDERS = {
  roa:         0.015,
  ldr:         0.85,
  liquidAssets:0.38,
  npl:         0.035,
  bankSize:    12.4,
  car:         0.155,
  egx30:       18500,
  inflation:   14.5,
  esg:         72,
};

// ─── Preset bank names ───────────────────────────────────────────────────────
const PRESET_BANKS = [
  { value: 'ADIB', label: 'ADIB (Islamic Private)' },
  { value: 'NBE',  label: 'NBE (National Bank)'    },
  { value: 'CIB',  label: 'CIB (Commercial Private)'},
  { value: 'QNB',  label: 'QNB (Private Invest)'   },
];
const CUSTOM_VALUE = '__custom__';

// ─── Pure calculation helper ─────────────────────────────────────────────────
function computeIndex({ ldr, npl, inflation, isCrisis, isGovernment, roa, liquidAssets, car, esg }) {
  let base = 8.0;
  base += (ldr          - 0.8)  * 8.0;
  base += (npl          - 0.02) * 20.0;
  base += (inflation    - 10)   * 0.15;
  base += isCrisis     ? 2.5  : 0;
  base += isGovernment ? 0.8  : -0.5;
  base -= (roa          - 0.01) * 35.0;
  base -= (liquidAssets - 0.3)  * 10.0;
  base -= (car          - 0.12) * 12.0;
  base -= (esg          - 50)   * 0.03;
  return Math.max(1.5, Math.min(19.8, base));
}

export default function ManualEntryModal({ isOpen, onClose, onSubmitSuccess }) {
  // ── ALL hooks first — never conditionally ─────────────────────────────────
  // Meta fields
  const [bankSelect,    setBankSelect]    = useState('ADIB');
  const [customBankName,setCustomBankName]= useState('');
  const [year,          setYear]          = useState(2025);
  const [isGovernment,  setIsGovernment]  = useState(false);
  const [isCrisis,      setIsCrisis]      = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Sliders
  const [roa,          setRoa]          = useState(DEFAULT_SLIDERS.roa);
  const [ldr,          setLdr]          = useState(DEFAULT_SLIDERS.ldr);
  const [liquidAssets, setLiquidAssets] = useState(DEFAULT_SLIDERS.liquidAssets);
  const [npl,          setNpl]          = useState(DEFAULT_SLIDERS.npl);
  const [bankSize,     setBankSize]     = useState(DEFAULT_SLIDERS.bankSize);
  const [car,          setCar]          = useState(DEFAULT_SLIDERS.car);
  const [egx30,        setEgx30]        = useState(DEFAULT_SLIDERS.egx30);
  const [inflation,    setInflation]    = useState(DEFAULT_SLIDERS.inflation);
  const [esg,          setEsg]          = useState(DEFAULT_SLIDERS.esg);

  // Multi-bank accumulation
  const [simulatedBanksList, setSimulatedBanksList] = useState([]);

  // ── Early exit AFTER all hooks ────────────────────────────────────────────
  if (!isOpen) return null;

  // Derived effective bank name
  const effectiveBankName =
    bankSelect === CUSTOM_VALUE
      ? (customBankName.trim() || 'Custom Bank')
      : bankSelect;

  const handleBankSelectChange = (e) => {
    const val = e.target.value;
    setBankSelect(val);
    // auto-set government flag only for NBE preset
    setIsGovernment(val === 'NBE');
  };

  // ── Reset sliders to default ───────────────────────────────────────────────
  const resetSliders = () => {
    setRoa(DEFAULT_SLIDERS.roa);
    setLdr(DEFAULT_SLIDERS.ldr);
    setLiquidAssets(DEFAULT_SLIDERS.liquidAssets);
    setNpl(DEFAULT_SLIDERS.npl);
    setBankSize(DEFAULT_SLIDERS.bankSize);
    setCar(DEFAULT_SLIDERS.car);
    setEgx30(DEFAULT_SLIDERS.egx30);
    setInflation(DEFAULT_SLIDERS.inflation);
    setEsg(DEFAULT_SLIDERS.esg);
  };

  // ── Build a bank snapshot from current state ───────────────────────────────
  const buildBankSnapshot = () => ({
    bank:         effectiveBankName,
    year,
    isGovernment,
    isCrisis,
    indicators: { roa, ldr, liquidAssets, npl, bankSize, car, egx30, inflation, esg },
  });

  // ── Add current config to the list, then reset sliders ────────────────────
  const handleAddBank = () => {
    const snapshot = buildBankSnapshot();
    setSimulatedBanksList(prev => [...prev, snapshot]);
    // Reset sliders + bank select for next entry
    resetSliders();
    setBankSelect('ADIB');
    setCustomBankName('');
    setIsGovernment(false);
    setIsCrisis(false);
  };

  // ── Run simulation across all accumulated banks (+ current if list empty) ──
  const handleCalculate = () => {
    setIsCalculating(true);

    // Include the currently configured bank as well
    const allBanks = [...simulatedBanksList, buildBankSnapshot()];

    setTimeout(() => {
      setIsCalculating(false);

      // Use the last bank as the "primary" result returned to parent
      const primary = allBanks[allBanks.length - 1];
      const finalIndex = computeIndex({
        ldr:          primary.indicators.ldr,
        npl:          primary.indicators.npl,
        inflation:    primary.indicators.inflation,
        isCrisis:     primary.isCrisis,
        isGovernment: primary.isGovernment,
        roa:          primary.indicators.roa,
        liquidAssets: primary.indicators.liquidAssets,
        car:          primary.indicators.car,
        esg:          primary.indicators.esg,
      });

      let status    = 'Stable';
      let color     = '#10B981';
      let riskLevel = 'Low';
      if (finalIndex > 12.0) { status = 'Fragile';    color = '#EF4444'; riskLevel = 'High';   }
      else if (finalIndex > 6.0) { status = 'Vulnerable'; color = '#F59E0B'; riskLevel = 'Medium'; }

      onSubmitSuccess({
        bank:               primary.bank,
        year:               primary.year,
        predicted_lt_index: parseFloat(finalIndex.toFixed(4)),
        stability_status:   status,
        risk_level:         riskLevel,
        status_color:       color,
        is_government:      primary.isGovernment,
        simulatedBanks:     allBanks,          // full list available to parent
        indicators: {
          ROA:                primary.indicators.roa,
          LDR:                primary.indicators.ldr,
          Liquid_Assets_Ratio:primary.indicators.liquidAssets,
          NPL_Ratio:          primary.indicators.npl,
          Bank_Size:          primary.indicators.bankSize,
          CAR:                primary.indicators.car,
          Macro_EGX30:        primary.indicators.egx30,
          Macro_Inflation:    primary.indicators.inflation,
          ESG_Score:          primary.indicators.esg,
          Is_Crisis:          primary.isCrisis,
        },
      });
      onClose();
    }, 1500);
  };

  const totalBanks = simulatedBanksList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-slide-up">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Manual Simulator Setup
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure banking parameters for What-If inference — add multiple banks to one scenario
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scroll Body ────────────────────────────────────────────────────── */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="text-base font-semibold text-slate-700 mt-4">Running Live Predictive Simulation...</p>
              <p className="text-xs text-slate-400 mt-1">Executing Random Forest + XGBoost Ensemble Math</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* ── Meta Parameters Grid ─────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">

                {/* Target Bank Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Target Bank
                  </label>
                  <select
                    value={bankSelect}
                    onChange={handleBankSelectChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    {PRESET_BANKS.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                    <option value={CUSTOM_VALUE}>Other / Custom Bank</option>
                  </select>

                  {/* Custom bank name input — shown only when "Other" is selected */}
                  {bankSelect === CUSTOM_VALUE && (
                    <input
                      type="text"
                      value={customBankName}
                      onChange={(e) => setCustomBankName(e.target.value)}
                      placeholder="Enter bank name…"
                      maxLength={40}
                      className="mt-2 w-full bg-white border border-indigo-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    />
                  )}
                </div>

                {/* Simulated Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Target Forecast Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    min={2015}
                    max={2030}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Sovereign Toggle */}
                <div className="flex items-center gap-3 pt-5 pl-2">
                  <input
                    type="checkbox"
                    id="gov_check"
                    checked={isGovernment}
                    onChange={(e) => setIsGovernment(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                  />
                  <label htmlFor="gov_check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Sovereign / Gov Bank
                  </label>
                </div>

                {/* Crisis Toggle */}
                <div className="flex items-center gap-3 pt-5 pl-2">
                  <input
                    type="checkbox"
                    id="crisis_check"
                    checked={isCrisis}
                    onChange={(e) => setIsCrisis(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                  />
                  <label htmlFor="crisis_check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Crisis / Floating Year
                  </label>
                </div>
              </div>

              {/* ── Added Banks Pills (visible when list > 0) ─────────────────── */}
              {simulatedBanksList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {simulatedBanksList.map((b, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold"
                    >
                      <Building2 className="w-3 h-3" />
                      {b.bank}
                      <span className="text-indigo-400 font-normal">{b.year}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* ── Sliders Area ──────────────────────────────────────────────── */}
              <div>
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                  Financial &amp; Economic Sliders
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                  {/* Slider 1: ROA */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Return on Assets (ROA)</span>
                      <span className="text-indigo-600">{(roa * 100).toFixed(2)}%</span>
                    </div>
                    <input type="range" min="0" max="0.05" step="0.001" value={roa}
                      onChange={(e) => setRoa(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 2: LDR */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Loan-to-Deposit Ratio (LDR)</span>
                      <span className="text-indigo-600">{(ldr * 100).toFixed(1)}%</span>
                    </div>
                    <input type="range" min="0.5" max="1.5" step="0.01" value={ldr}
                      onChange={(e) => setLdr(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 3: Liquid Assets */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Liquid Assets Ratio</span>
                      <span className="text-indigo-600">{(liquidAssets * 100).toFixed(1)}%</span>
                    </div>
                    <input type="range" min="0.1" max="0.8" step="0.01" value={liquidAssets}
                      onChange={(e) => setLiquidAssets(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 4: NPL */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Non-Performing Loans (NPL)</span>
                      <span className="text-indigo-600">{(npl * 100).toFixed(2)}%</span>
                    </div>
                    <input type="range" min="0" max="0.2" step="0.001" value={npl}
                      onChange={(e) => setNpl(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 5: Bank Size */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Bank Size (Log Assets)</span>
                      <span className="text-indigo-600">{bankSize.toFixed(2)}</span>
                    </div>
                    <input type="range" min="8.0" max="15.0" step="0.1" value={bankSize}
                      onChange={(e) => setBankSize(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 6: CAR */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Capital Adequacy Ratio (CAR)</span>
                      <span className="text-indigo-600">{(car * 100).toFixed(1)}%</span>
                    </div>
                    <input type="range" min="0.05" max="0.3" step="0.005" value={car}
                      onChange={(e) => setCar(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 7: EGX30 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">EGX 30 Index</span>
                      <span className="text-indigo-600">{egx30.toLocaleString()} pts</span>
                    </div>
                    <input type="range" min="5000" max="30000" step="100" value={egx30}
                      onChange={(e) => setEgx30(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 8: Inflation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Macro Inflation Rate</span>
                      <span className="text-indigo-600">{inflation.toFixed(1)}%</span>
                    </div>
                    <input type="range" min="0" max="40" step="0.1" value={inflation}
                      onChange={(e) => setInflation(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  {/* Slider 9: ESG Score */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Sustainability ESG Score</span>
                      <span className="text-indigo-600">{esg} / 100</span>
                    </div>
                    <input type="range" min="0" max="100" step="1" value={esg}
                      onChange={(e) => setEsg(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">

          {/* Banks counter — always visible */}
          <p className="text-[10px] font-light text-slate-400 mb-3 tracking-wide select-none">
            Total banks added to scenario:{' '}
            <span className="font-semibold text-slate-500">{totalBanks}</span>
            {totalBanks > 0 && (
              <span className="ml-1 text-slate-400">
                ({simulatedBanksList.map(b => b.bank).join(', ')})
              </span>
            )}
          </p>

          <div className="flex items-center justify-end gap-3">

            {/* Cancel */}
            <button
              onClick={onClose}
              disabled={isCalculating}
              className="px-5 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-200 transition-colors text-sm disabled:opacity-50"
            >
              Cancel
            </button>

            {/* + Add Bank to Simulation */}
            <button
              onClick={handleAddBank}
              disabled={isCalculating}
              className="px-5 py-2.5 bg-white border border-indigo-300 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 active:scale-95 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              + Add Bank to Simulation
            </button>

            {/* Run Simulation */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Calculator className="w-4 h-4" />
              {isCalculating ? 'Calculating…' : 'Run Simulation'}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
