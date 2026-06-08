import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ExcelUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [dragActive, setDragActive]     = useState(false);
  const [file, setFile]                 = useState(null);
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadError, setUploadError]   = useState(null);
  const fileInputRef                    = useRef(null);

  if (!isOpen) return null;

  /* ── drag/drop helpers ───────────────────────────────────────────────────── */
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };
  const validateAndSetFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (['xlsx', 'xls', 'csv'].includes(ext)) { setFile(f); setUploadError(null); }
    else { setUploadError('Invalid file type. Please upload a Microsoft Excel spreadsheet (.xlsx, .xls, or .csv).'); setFile(null); }
  };

  /* ── real upload ─────────────────────────────────────────────────────────── */
  const handleDone = async () => {
    if (!file) { setUploadError('Please select or drop a valid Excel file first.'); return; }
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use env variable or fallback to current origin for production
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      // POST /api/upload now returns List[UnifiedDashboardResponse]
      const banksData = await res.json();
      setIsUploading(false);
      onUploadSuccess(banksData);   // ← array of bank objects
      onClose();
    } catch (err) {
      setIsUploading(false);
      setUploadError(err.message || 'Upload failed. Please check the server and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-slide-up">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              Upload Financial Records
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Ingest banking sheets to forecast maturity fragility</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col justify-center items-stretch">
          <div className="w-full max-w-sm mx-auto">
            <form
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              onSubmit={(e) => e.preventDefault()}
              onClick={file ? undefined : () => fileInputRef.current.click()}
              className={`relative flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                dragActive ? 'border-indigo-600 bg-indigo-50/10 shadow-inner'
                  : file ? 'border-emerald-300 bg-white'
                  : 'border-indigo-600/30 bg-white hover:border-indigo-600/60'
              }`}
            >
              <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleChange} />

              {/* Exclamation tooltip */}
              <div className="absolute top-3.5 right-3.5 group/tooltip z-20" onClick={(e) => e.stopPropagation()}>
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center font-black text-xs cursor-help transition-all duration-200">!</div>
                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-52 p-3 bg-slate-900 text-white text-[10.5px] rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 transform translate-y-1 group-hover/tooltip:translate-y-0 pointer-events-none font-sans border border-slate-800">
                  <p className="font-semibold text-center leading-relaxed">Excel sheets must match structural indicators. Verify required headers like 'LDR' and 'CAR' before upload.</p>
                  <div className="absolute top-full right-1/2 translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>

              {isUploading ? (
                <div className="flex flex-col items-center py-4">
                  <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
                  <p className="text-sm font-semibold text-slate-700 mt-4">Running Machine Learning Inference...</p>
                  <p className="text-xs text-slate-400 mt-1">Scaling 11 interacting features & calculating SHAP indices</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 break-all px-4">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(2)} KB • Ready for analysis</p>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-4 px-3 py-1 text-xs text-rose-500 font-semibold hover:bg-rose-50 rounded-full transition-colors">
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    <span className="text-indigo-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-2 px-6">Supports Microsoft Excel sheets (.xlsx, .xls) and CSV datasets</p>
                </div>
              )}
            </form>
          </div>

          {uploadError && (
            <div className="mt-4 p-3 bg-rose-50 rounded-xl text-rose-600 text-xs flex items-start gap-2.5 border border-rose-100 animate-fade-in w-full max-w-sm mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-center text-center font-sans px-4">
            <div className="flex items-center gap-2 justify-center mb-1">
              <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">INFO</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-sans">
              Review Excel Template Guidelines first. Ensure that your table columns match basic indicator variables.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button onClick={onClose} disabled={isUploading}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-colors text-sm">
            Cancel
          </button>
          <button onClick={handleDone} disabled={isUploading || !file}
            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:pointer-events-none">
            {isUploading ? 'Processing...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
