import React from 'react';
import { X, FileSpreadsheet, Info } from 'lucide-react';

export default function ExcelTemplateModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Realistic and dynamic financial numbers representing actual ratios
  const sampleData = [
    { bank: 'ADIB', year: 2023, type: 'Private', roa: '0.015', ldr: '0.78', liquidAsset: '29.4%', npl: '0.031', size: '11.8', car: '14.2%', egx30: '18,500', inflation: '23.5%', esg: '78', ltIndex: '11.2' },
    { bank: 'ADIB', year: 2024, type: 'Private', roa: '0.016', ldr: '0.80', liquidAsset: '30.1%', npl: '0.029', size: '11.9', car: '14.5%', egx30: '24,000', inflation: '29.2%', esg: '80', ltIndex: '11.5' },
    { bank: 'ADIB', year: 2025, type: 'Private', roa: '0.018', ldr: '0.82', liquidAsset: '31.5%', npl: '0.025', size: '12.1', car: '15.0%', egx30: '28,000', inflation: '32.1%', esg: '82', ltIndex: '12.1' },
    { bank: 'CIB', year: 2023, type: 'Private', roa: '0.021', ldr: '0.72', liquidAsset: '35.2%', npl: '0.019', size: '12.5', car: '16.5%', egx30: '18,500', inflation: '23.5%', esg: '85', ltIndex: '9.4' },
    { bank: 'CIB', year: 2024, type: 'Private', roa: '0.023', ldr: '0.75', liquidAsset: '36.0%', npl: '0.018', size: '12.6', car: '16.8%', egx30: '24,000', inflation: '29.2%', esg: '87', ltIndex: '9.8' },
    { bank: 'CIB', year: 2025, type: 'Private', roa: '0.025', ldr: '0.78', liquidAsset: '37.2%', npl: '0.015', size: '12.8', car: '17.2%', egx30: '28,000', inflation: '32.1%', esg: '89', ltIndex: '10.3' },
    { bank: 'NBE', year: 2023, type: 'Public', roa: '0.011', ldr: '0.85', liquidAsset: '25.5%', npl: '0.045', size: '13.1', car: '13.1%', egx30: '18,500', inflation: '23.5%', esg: '68', ltIndex: '12.8' },
    { bank: 'NBE', year: 2024, type: 'Public', roa: '0.012', ldr: '0.87', liquidAsset: '26.0%', npl: '0.048', size: '13.2', car: '13.3%', egx30: '24,000', inflation: '29.2%', esg: '70', ltIndex: '13.1' },
    { bank: 'NBE', year: 2025, type: 'Public', roa: '0.013', ldr: '0.89', liquidAsset: '27.2%', npl: '0.052', size: '13.4', car: '13.5%', egx30: '28,000', inflation: '32.1%', esg: '72', ltIndex: '13.6' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-x-hidden overflow-y-auto">
      {/* Blurred & Darkened Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card - Light Gray borders/background, with high shadow */}
      <div className="relative w-full max-w-6xl bg-[#F7F8FA] rounded-[25px] border border-slate-300 shadow-2xl overflow-hidden z-10 flex flex-col animate-slide-up max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FileSpreadsheet className="w-5 h-5 text-[#6E68E7]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Excel Template Guidance & Required Columns Schema
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify that your Excel spreadsheet sheets match these structural columns and realistic value mappings.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Info Banner */}
          <div className="mb-4 p-3 bg-indigo-50 border border-[#6E68E7]/10 rounded-xl flex items-start gap-3">
            <Info className="w-4 h-4 text-[#6E68E7] shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>Structure Requirement:</strong> Columns are case-insensitive, but their names and order must match standard financial indicators to run correct Ensemble Machine Learning forecasting and SHAP index scaling.
            </p>
          </div>

          {/* Table Container - Glassmorphic blurred white background */}
          <div className="w-full overflow-x-auto bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse bg-transparent">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200">
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">BANK</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">YEAR</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">Type</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">ROA</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">LDR(LTD)</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">LIQUID ASSET RATIO</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">NPL RATIO</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">BANK SIZE</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">CAR</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">MACRO EGX30</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">MACRO INFLATION RATE</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">ESG SCORE</th>
                  <th className="px-4 py-3.5 text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">LT INDEX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold text-[11px] bg-transparent">
                {sampleData.map((row, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-slate-900 font-bold whitespace-nowrap">{row.bank}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.year}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        row.type === 'Private' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.roa}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.ldr}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-500">{row.liquidAsset}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.npl}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono">{row.size}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-500">{row.car}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono">{row.egx30}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-500">{row.inflation}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono">{row.esg}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-indigo-600 font-bold font-mono">{row.ltIndex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-[#5C56D6] text-white rounded-xl font-bold transition-all duration-200 text-xs shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-95"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
