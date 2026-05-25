import React, { useState } from 'react';
import { Cloud, Sliders, Play, Sparkles } from 'lucide-react';
import ExcelUploadModal from './ExcelUploadModal';
import ManualEntryModal from './ManualEntryModal';
import ExcelTemplateModal from './ExcelTemplateModal';

export default function OnboardingScreen() {
  const [isExcelOpen, setIsExcelOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(null);

  const handleUploadSuccess = (data) => {
    setActiveResult({
      type: 'Excel Ingestion',
      title: `Dataset Uploaded: ${data.fileName}`,
      subtitle: `Target bank: ${data.bankName} • Size: ${data.fileSize}`,
      index: data.bankName === 'NBE' ? 12.3616 : 5.1751,
      status: data.bankName === 'NBE' ? 'Fragile' : 'Stable',
      risk: data.bankName === 'NBE' ? 'High' : 'Low',
      color: data.bankName === 'NBE' ? '#EF4444' : '#10B981',
      bgLight: data.bankName === 'NBE' ? 'bg-rose-50' : 'bg-emerald-50',
      textDark: data.bankName === 'NBE' ? 'text-rose-700' : 'text-emerald-700',
    });
  };

  const handleManualSuccess = (data) => {
    setActiveResult({
      type: 'What-If Simulation',
      title: `Interactive Bank Simulation (${data.year})`,
      subtitle: `Simulated Bank: ${data.bank} • Ownership: ${data.is_government ? 'Government' : 'Private'}`,
      index: data.predicted_lt_index,
      status: data.stability_status,
      risk: data.risk_level,
      color: data.status_color,
      bgLight: data.predicted_lt_index > 12.0 ? 'bg-rose-50' : data.predicted_lt_index > 6.0 ? 'bg-amber-50' : 'bg-emerald-50',
      textDark: data.predicted_lt_index > 12.0 ? 'text-rose-700' : data.predicted_lt_index > 6.0 ? 'text-amber-700' : 'text-emerald-700',
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#F8FAFC] font-sans select-none">

      {/* 1. Left branding panel (40% width) - Project Gray Background with elegant left-side purple circular glow */}
      <div 
        className="w-full md:w-[40%] h-full border-r border-slate-100/60 flex flex-col justify-between p-10 md:p-12 relative overflow-hidden shrink-0"
        style={{ backgroundColor: '#F7F8FA' }}
      >

        {/* Soft Blurry Lavender/Purple Glow centered in middle - existing center glow */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none opacity-80"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0) 70%)',
            filter: 'blur(45px)'
          }}
        />

        {/* Purple Circular Glow (#6E68E7 at 50% opacity) on the LEFT edge of the column - matching center glow style */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(110, 104, 231, 0.5) 0%, rgba(110, 104, 231, 0) 70%)',
            filter: 'blur(50px)',
            transform: 'translate(-40%, -50%)'
          }}
        />

        {/* Fixed Logo: Random Forest (No icons, Random in bold black, Forest in brandPurple) */}
        <div className="relative z-10">
          <div className="flex items-center gap-1 animate-fade-in">
            <span className="font-extrabold text-slate-900 tracking-tight text-xl">Random</span>
            <span className="font-extrabold text-indigo-600 tracking-tight text-xl">Forest</span>
          </div>
        </div>

        {/* Centered Content block (Vertically and Horizontally centered in remaining height) */}
        <div className="my-auto relative z-10 flex flex-col justify-center items-start space-y-4 max-w-sm md:max-w-md animate-fade-in">
          {/* Main Title: Banking Liquidity AI Monitor in Strong Slate-900 Solid Color */}
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-black leading-[1.1] tracking-tight text-slate-900">
            Banking Liquidity AI <br />
            Monitor
          </h1>

          {/* Subtitle: Foresight, Stability, and Insight in Vivid brandPurple (#6E68E7) */}
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-indigo-600 -mt-2">
            Foresight, Stability, and Insight
          </h2>

          <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
            A sophisticated AI-driven financial analysis platform, leveraging advanced Ensemble Machine Learning models to predict and manage banking liquidity fragility. Gain actionable insights for proactive financial stability.
          </p>

          {/* Model Research link */}
          <div className="pt-1">
            <a
              href="#research"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-indigo-600 hover:opacity-85 transition-colors group"
            >
              <span>Model Research</span>
              <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform font-medium">↗</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-[10px] text-slate-400 relative z-10">
          © 2026 Random Forest Systems. All rights reserved.
        </div>
      </div>

      {/* 2. Right main viewport (60% width) - Pure White background & glassmorphism floating cards */}
      <div className="w-full md:w-[60%] h-full p-4 md:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto bg-white">

        {/* Welcome Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 shrink-0">
          <div>
            <h2 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Onboarding Wizard</h2>
            <p className="text-lg md:text-xl font-extrabold text-slate-800 mt-0.5">Select Analysis Mode</p>
          </div>
          <div className="bg-indigo-50/50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm border border-indigo-100/30">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Ensemble RF + XGBoost Active
          </div>
        </div>

        {/* Compact, balanced Choice cards container with Custom Soft Balanced Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 shrink-0 relative mt-1 lg:mt-2">

          {/* Card 1: Excel Ingestion */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 lg:p-5 shadow-[0_15px_40px_rgba(99,102,241,0.06),0_5px_15px_rgba(0,0,0,0.04)] border border-white/80 flex flex-col items-center justify-center text-center min-h-[145px] md:min-h-[165px] lg:min-h-[175px] hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] hover:border-indigo-600/30 hover:bg-white/90 transition-all duration-300 group">

            {/* Excel Guideline Message & Exclamation Button on top-right */}
            <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end">
              {/* Permanently Popped-Up Guideline Bubble */}
              <div className="mb-2 bg-[#EEEFFD] text-[#6E68E7] px-3 py-1 rounded-full text-[8.5px] font-bold border border-[#6E68E7]/20 shadow-md flex items-center gap-1.5 whitespace-nowrap animate-pulse-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6E68E7] animate-ping"></span>
                <span>GUIDELINE: View Excel Template, Check Structure</span>
                <span className="text-[9px] ml-0.5">➔</span>
                
                {/* Small indicator arrow pointing down to the exclamation mark */}
                <div className="absolute top-full right-3 w-1.5 h-1.5 bg-[#EEEFFD] border-r border-b border-[#6E68E7]/20 transform rotate-45 -translate-y-[4px]"></div>
              </div>

              {/* Clickable Exclamation Mark (!) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTemplateOpen(true);
                }}
                className="w-5 h-5 rounded-full bg-[#6E68E7] text-white hover:bg-[#5C56D6] flex items-center justify-center font-black text-xs cursor-pointer transition-all duration-200 shadow-md hover:scale-110 active:scale-95 border border-white"
                title="View Excel Template Guidelines"
              >
                !
              </button>
            </div>

            {/* Card Contents (Fully Centered Vertically and Horizontally) */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform border border-indigo-100/50">
                <Cloud className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Excel Upload</h3>
              <p className="text-slate-400 text-[8.5px] lg:text-[9px] mt-1 leading-relaxed max-w-[190px]">
                Drag & drop your Excel (.xlsx, .csv) financial files here for bulk analysis and trend forecasting.
              </p>
            </div>

            {/* Chic Button with brandPurple */}
            <button
              onClick={() => setIsExcelOpen(true)}
              className="mt-2.5 px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[9px] font-bold rounded-xl shadow-sm transition-all uppercase tracking-wider font-sans"
            >
              Start Upload
            </button>
          </div>

          {/* Card 2: Manual Simulator - Clean glassmorphism card */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 lg:p-5 shadow-[0_15px_40px_rgba(99,102,241,0.06),0_5px_15px_rgba(0,0,0,0.04)] border border-white/80 flex flex-col items-center justify-center text-center min-h-[145px] md:min-h-[165px] lg:min-h-[175px] hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] hover:border-indigo-600/30 hover:bg-white/90 transition-all duration-300 group">

            {/* Card Contents (Fully Centered Vertically and Horizontally) */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform border border-indigo-100/50">
                <Sliders className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Manual Entry</h3>
              <p className="text-slate-400 text-[8.5px] lg:text-[9px] mt-1 leading-relaxed max-w-[190px]">
                Manually adjust key financial metrics to run instant predictive simulations for specific banks.
              </p>
            </div>

            {/* Chic Button with brandPurple */}
            <button
              onClick={() => setIsManualOpen(true)}
              className="mt-2.5 px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[9px] font-bold rounded-xl shadow-sm transition-all uppercase tracking-wider font-sans"
            >
              Begin Entry
            </button>
          </div>
        </div>

        {/* Dynamic Ingestion Output section */}
        {activeResult ? (
          <div className="p-3 bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl shadow-[0_10px_35px_rgba(110,104,231,0.06)] relative overflow-hidden shrink-0 mt-2 animate-slide-up">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: activeResult.color }} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                  <Play className="w-2.5 h-2.5 text-indigo-600 fill-indigo-600" />
                  {activeResult.type} Output
                </span>
                <h4 className="text-[11px] font-bold text-slate-800 mt-1">{activeResult.title}</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">{activeResult.subtitle}</p>
              </div>

              {/* Fragility Index Badge */}
              <div className="flex items-center gap-3 shrink-0 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
                <div className="text-center">
                  <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">AFI Score</span>
                  <span className="text-base font-black text-slate-800 leading-none">{activeResult.index}</span>
                </div>
                <div className={`px-2 py-1 rounded-lg ${activeResult.bgLight} ${activeResult.textDark} text-center font-bold text-[9px]`}>
                  {activeResult.status} ({activeResult.risk})
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* 3. Balanced Model Accuracy Card with custom, perfectly sized ROC Curve SVG to prevent laptop screen cutoff */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3.5 lg:p-4 shadow-[0_15px_40px_rgba(99,102,241,0.06),0_5px_15px_rgba(0,0,0,0.04)] border border-white/80 flex flex-col sm:flex-row items-stretch justify-between gap-4 lg:gap-5 mt-1.5 lg:mt-2 shrink-0">

          {/* SVG ROC Curve container */}
          <div className="flex-1 min-w-[200px] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Model Accuracy</h3>
              <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">ROC AUC curve</span>
            </div>

            {/* Custom Compact SVG ROC Plot using brandPurple */}
            <div className="relative border border-slate-100 rounded-xl bg-[#F8FAFC] p-2 mt-1.5">
              <svg viewBox="0 0 200 110" className="w-full h-auto overflow-visible">
                {/* Horizontal & Vertical Gridlines */}
                <line x1="20" y1="90" x2="190" y2="90" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="20" y1="10" x2="20" y2="90" stroke="#e2e8f0" strokeWidth="1" />

                <line x1="20" y1="10" x2="190" y2="10" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="190" y1="10" x2="190" y2="90" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />

                {/* Grid guidelines */}
                <line x1="20" y1="50" x2="190" y2="50" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="105" y1="10" x2="105" y2="90" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />

                {/* Diagonal baseline */}
                <line x1="20" y1="90" x2="190" y2="10" stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="4" />

                {/* Curve path representation (AUC = 0.92) using brandPurple #6E68E7 */}
                <path
                  d="M 20 90 Q 30 30, 70 20 T 190 10"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-pulse-subtle"
                />

                {/* Dot */}
                <circle cx="70" cy="20" r="2" fill="#6366f1" />

                {/* Labels */}
                <text x="105" y="103" fontSize="5.5" fontWeight="bold" textAnchor="middle" fill="#94a3b8">False Positive Rate</text>
                <text x="8" y="50" fontSize="5.5" fontWeight="bold" textAnchor="middle" transform="rotate(-90 8 50)" fill="#94a3b8">True Positive Rate</text>

                {/* Ticks */}
                <text x="16" y="92" fontSize="5" textAnchor="end" fill="#64748b">0</text>
                <text x="16" y="14" fontSize="5" textAnchor="end" fill="#64748b">1.0</text>
                <text x="20" y="97" fontSize="5" textAnchor="middle" fill="#64748b">0</text>
                <text x="190" y="97" fontSize="5" textAnchor="middle" fill="#64748b">1.0</text>
              </svg>
            </div>

            <span className="block text-[8.5px] font-bold text-indigo-600 hover:opacity-80 transition-colors uppercase tracking-wider mt-2.5 cursor-pointer">
              Model Performance
            </span>
          </div>

          {/* Right Text / AUC Section */}
          <div className="w-full sm:w-[150px] flex flex-col justify-between pt-1 shrink-0">
            <div>
              {/* Massive 92% accuracy text */}
              <h2 className="text-5xl font-black text-indigo-600 leading-none tracking-tighter">
                92%
              </h2>
              <span className="block text-slate-800 font-extrabold text-[11px] mt-2">Accuracy</span>
              <p className="text-slate-400 text-[9.5px] mt-1 leading-relaxed">
                Prediction Reliability based on Random Forest Model Analysis
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] mt-4 sm:mt-0">
              <span className="text-slate-400 font-semibold">Area Under Curve</span>
              <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">0.92</span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Modals mounting */}
      <ExcelUploadModal
        isOpen={isExcelOpen}
        onClose={() => setIsExcelOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      <ManualEntryModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onSubmitSuccess={handleManualSuccess}
      />
      <ExcelTemplateModal
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
      />

    </div>
  );
}
