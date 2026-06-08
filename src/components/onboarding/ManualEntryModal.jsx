import React, { useState } from 'react';
import { Sliders, X, Calculator, RefreshCw, PlusCircle, Building2, ChevronDown } from 'lucide-react';

// ─── Default slider values ────────────────────────────────────────────────────
const DEFAULT_SLIDERS = {
  roa:          0.015,
  ldr:          0.85,
  liquidAssets: 0.38,
  npl:          0.035,
  bankSize:     12.4,
  car:          0.155,
  egx30:        18500,
  inflation:    14.5,
  esg:          72,
};

// ─── Preset banks ─────────────────────────────────────────────────────────────
const PRESET_BANKS = [
  { value: 'ADIB', label: 'ADIB (Islamic Private)' },
  { value: 'NBE',  label: 'NBE (National Bank)'    },
  { value: 'CIB',  label: 'CIB (Commercial Private)'},
  { value: 'QNB',  label: 'QNB (Private Invest)'   },
];
const CUSTOM_VALUE = '__custom__';

function ManualSliderRow({ label, value, min, max, step, onChange, inputMult = 1, suffix = '' }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600">{label}</span>
        <div className="flex items-center gap-1">
          <input 
            type="number" min={min * inputMult} max={max * inputMult} step={step * inputMult} value={Number((value * inputMult).toFixed(3))}
            onChange={e => { const val = parseFloat(e.target.value); if (!isNaN(val)) onChange(val / inputMult); }}
            className="w-16 px-1.5 py-0.5 text-right font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="font-bold text-indigo-600 text-xs w-6">{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
    </div>
  );
}

export default function ManualEntryModal({ isOpen, onClose, onSubmitSuccess }) {
  // ── Meta fields ───────────────────────────────────────────────────────────
  const [bankSelect,     setBankSelect]     = useState('ADIB');
  const [customBankName, setCustomBankName] = useState('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [year,           setYear]           = useState(2025);
  const [isGovernment,   setIsGovernment]   = useState(false);
  const [isCrisis,       setIsCrisis]       = useState(false);
  const [isCalculating,  setIsCalculating]  = useState(false);
  const [apiError,       setApiError]       = useState(null);

  // ── Sliders ───────────────────────────────────────────────────────────────
  const [roa,          setRoa]          = useState(DEFAULT_SLIDERS.roa);
  const [ldr,          setLdr]          = useState(DEFAULT_SLIDERS.ldr);
  const [liquidAssets, setLiquidAssets] = useState(DEFAULT_SLIDERS.liquidAssets);
  const [npl,          setNpl]          = useState(DEFAULT_SLIDERS.npl);
  const [bankSize,     setBankSize]     = useState(DEFAULT_SLIDERS.bankSize);
  const [car,          setCar]          = useState(DEFAULT_SLIDERS.car);
  const [egx30,        setEgx30]        = useState(DEFAULT_SLIDERS.egx30);
  const [inflation,    setInflation]    = useState(DEFAULT_SLIDERS.inflation);
  const [esg,          setEsg]          = useState(2); // Fix: ESG is 1-3, not 0-100

  // ── Multi-bank accumulation ───────────────────────────────────────────────
  const [simulatedBanksList, setSimulatedBanksList] = useState([]);

  // ── Early exit AFTER all hooks ────────────────────────────────────────────
  if (!isOpen) return null;

  const effectiveBankName =
    bankSelect === CUSTOM_VALUE ? (customBankName.trim() || 'CUSTOM BANK') : bankSelect;

  const handleBankSelectChange = (e) => {
    const val = e.target.value;
    setBankSelect(val);
    setIsGovernment(val === 'NBE');
  };

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

  const buildRecord = () => ({
    bank_name:          effectiveBankName,
    year,
    roa,
    ldr,
    liquid_assets_ratio: liquidAssets,
    npl_ratio:           npl,
    bank_size:           bankSize,
    car,
    macro_egx30:         egx30,
    macro_inflation:     inflation / 100,   // backend expects decimal fraction
    esg_score:           Math.round(esg),
    is_government:       isGovernment ? 1 : 0,
  });

  const handleAddBank = () => {
    setSimulatedBanksList(prev => [...prev, buildRecord()]);
    resetSliders();
    setBankSelect('ADIB');
    setCustomBankName('');
    setIsGovernment(false);
    setIsCrisis(false);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setApiError(null);

    // Include current configured bank too
    const allRecords = [...simulatedBanksList, buildRecord()];

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          records: allRecords,
          forecast_year: year + 1,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      // POST /api/predict now returns List[UnifiedDashboardResponse]
      const banksData = await res.json();
      setIsCalculating(false);
      onSubmitSuccess(banksData);   // ← array of bank objects
      onClose();
    } catch (err) {
      setIsCalculating(false);
      setApiError(err.message || 'Prediction failed. Please check the server and try again.');
    }
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

        {/* ── Header ──────────────────────────────────────────────────────────── */}
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
          <button onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scroll Body ──────────────────────────────────────────────────────── */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="text-base font-semibold text-slate-700 mt-4">Running Live Predictive Simulation...</p>
              <p className="text-xs text-slate-400 mt-1">Executing Random Forest + XGBoost Ensemble Math</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* ── Meta Parameters Grid ──────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-5 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">

                {/* Target Bank Dropdown */}
                <div className="col-span-1 relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Target Bank</label>
                  <div 
                    onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="truncate pr-2">
                      {bankSelect === CUSTOM_VALUE 
                        ? 'Other / Custom' 
                        : PRESET_BANKS.find(b => b.value === bankSelect)?.label}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isBankDropdownOpen && (
                    <>
                      {/* Invisible overlay to catch clicks outside */}
                      <div className="fixed inset-0 z-10" onClick={() => setIsBankDropdownOpen(false)} />
                      <div className="absolute top-[68px] left-0 w-[110%] bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-2 animate-fade-in">
                        {PRESET_BANKS.map(b => (
                          <div 
                            key={b.value} 
                            onClick={() => { setBankSelect(b.value); setIsGovernment(b.value === 'NBE'); setIsBankDropdownOpen(false); }}
                            className={`px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${bankSelect === b.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                          >
                            {b.label}
                          </div>
                        ))}
                        <div className="my-1 border-t border-slate-100" />
                        <div 
                          onClick={() => { setBankSelect(CUSTOM_VALUE); setIsGovernment(false); setIsBankDropdownOpen(false); }}
                          className={`px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${bankSelect === CUSTOM_VALUE ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                        >
                          Other / Custom
                        </div>
                      </div>
                    </>
                  )}
                  
                  {bankSelect === CUSTOM_VALUE && (
                    <input type="text" value={customBankName} onChange={(e) => setCustomBankName(e.target.value)}
                      placeholder="Enter bank name…" maxLength={40}
                      className="mt-3 w-full bg-indigo-50/50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-900 placeholder:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                  )}
                </div>

                {/* Simulated Year */}
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Forecast Year</label>
                  <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} min={2015} max={2030}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>

                {/* Toggles Container */}
                <div className="col-span-1 md:col-span-2 flex flex-col justify-center gap-3 pl-2">
                  
                  {/* Sovereign Toggle */}
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsGovernment(!isGovernment)}>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer group-hover:text-indigo-600 transition-colors select-none">
                      Sovereign / Gov Bank
                    </label>
                    <button type="button" role="switch" aria-checked={isGovernment}
                      className={`${isGovernment ? 'bg-indigo-600' : 'bg-slate-200'} relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}>
                      <span className={`${isGovernment ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                    </button>
                  </div>

                  {/* Crisis Toggle */}
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsCrisis(!isCrisis)}>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer group-hover:text-rose-500 transition-colors select-none">
                      Crisis / Stress Year
                    </label>
                    <button type="button" role="switch" aria-checked={isCrisis}
                      className={`${isCrisis ? 'bg-rose-500' : 'bg-slate-200'} relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}>
                      <span className={`${isCrisis ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                    </button>
                  </div>

                </div>
              </div>

              {/* ── Added Banks Pills ───────────────────────────────────────────── */}
              {simulatedBanksList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {simulatedBanksList.map((b, i) => (
                    <span key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold">
                      <Building2 className="w-3 h-3" />
                      {b.bank_name}
                      <span className="text-indigo-400 font-normal">{b.year}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* ── API Error ────────────────────────────────────────────────────── */}
              {apiError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
                  {apiError}
                </div>
              )}

              {/* ── Sliders Area ───────────────────────────────────────────────── */}
              <div>
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Financial & Economic Sliders</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <ManualSliderRow label="Return on Assets (ROA)" value={roa} min={0} max={0.05} step={0.001} onChange={setRoa} inputMult={100} suffix="%" />
                  <ManualSliderRow label="Loan-to-Deposit Ratio (LDR)" value={ldr} min={0.5} max={1.5} step={0.01} onChange={setLdr} inputMult={100} suffix="%" />
                  <ManualSliderRow label="Liquid Assets Ratio" value={liquidAssets} min={0.1} max={0.8} step={0.01} onChange={setLiquidAssets} inputMult={100} suffix="%" />
                  <ManualSliderRow label="Non-Performing Loans (NPL)" value={npl} min={0} max={0.2} step={0.001} onChange={setNpl} inputMult={100} suffix="%" />
                  <ManualSliderRow label="Bank Size (Log Assets)" value={bankSize} min={8.0} max={15.0} step={0.1} onChange={setBankSize} inputMult={1} suffix="" />
                  <ManualSliderRow label="Capital Adequacy Ratio (CAR)" value={car} min={0.05} max={0.3} step={0.005} onChange={setCar} inputMult={100} suffix="%" />
                  <ManualSliderRow label="EGX 30 Index" value={egx30} min={5000} max={30000} step={100} onChange={setEgx30} inputMult={1} suffix="pts" />
                  <ManualSliderRow label="Macro Inflation Rate" value={inflation} min={0} max={40} step={0.1} onChange={setInflation} inputMult={1} suffix="%" />
                  <ManualSliderRow label="Sustainability ESG Score" value={esg} min={0} max={100} step={1} onChange={setEsg} inputMult={1} suffix="/100" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] font-light text-slate-400 mb-3 tracking-wide select-none">
            Total banks added to scenario:{' '}
            <span className="font-semibold text-slate-500">{totalBanks}</span>
            {totalBanks > 0 && (
              <span className="ml-1 text-slate-400">
                ({simulatedBanksList.map(b => b.bank_name).join(', ')})
              </span>
            )}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} disabled={isCalculating}
              className="px-5 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-200 transition-colors text-sm disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleAddBank} disabled={isCalculating}
              className="px-5 py-2.5 bg-white border border-indigo-300 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 active:scale-95 transition-all text-sm flex items-center gap-2 disabled:opacity-50">
              <PlusCircle className="w-4 h-4" />
              + Add Bank to Simulation
            </button>
            <button onClick={handleCalculate} disabled={isCalculating}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all text-sm flex items-center gap-2 disabled:opacity-50">
              <Calculator className="w-4 h-4" />
              {isCalculating ? 'Calculating…' : 'Run Simulation'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
