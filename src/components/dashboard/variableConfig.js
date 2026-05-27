// variableConfig.js — Ground-truth configuration for the 9 simulation slider variables
// Calibrated from: Book1 (1) (1) (2).xlsx + user-defined realistic bounds
// Is_Government and Is_Crisis are NOT here — they are uploaded via Excel/Manual Entry only.

export const VARIABLE_CONFIG = [
  {
    key: 'roa',
    label: 'ROA (%)',
    featureName: 'ROA',
    type: 'percentage',       // stored as ratio (0.015 = 1.5%)
    min: 0.000,
    max: 0.050,
    step: 0.001,
    defaultVal: 0.0093,
    safeMin: 0.010,
    dangerMax: 0.005,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(1)}%`,
    description: 'Net income / total assets. Dataset range: 0.26% – 7.4%.'
  },
  {
    key: 'ltd',
    label: 'LTD Ratio (%)',
    featureName: 'LDR (LTD)',
    type: 'percentage',       // stored as ratio (1.52 = 152%)
    min: 0.30,
    max: 2.50,
    step: 0.01,
    defaultVal: 2.085,
    safeMax: 1.50,
    dangerMin: 2.00,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(0)}%`,
    description: 'Loans / deposits. Dataset range: 34.7% – 250%. Over 200% = high risk.'
  },
  {
    key: 'liquidAssets',
    label: 'Liquid Assets (%)',
    featureName: 'Liquid Assets Ratio',
    type: 'percentage',       // stored as ratio (0.41 = 41%)
    min: 0.10,
    max: 0.70,
    step: 0.01,
    defaultVal: 0.53,
    safeMin: 0.30,
    dangerMax: 0.20,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(0)}%`,
    description: 'Liquid assets / total assets. Dataset range: 20.8% – 82.3%.'
  },
  {
    key: 'npl',
    label: 'NPL Ratio (%)',
    featureName: 'NPL Ratio',
    type: 'percentage_value', // stored as whole % (3.24 = 3.24%) — matches Excel column directly
    min: 0.0,
    max: 15.0,
    step: 0.1,
    defaultVal: 3.24,
    safeMax: 5.0,
    dangerMin: 10.0,
    category: 'INTERNAL',
    format: v => `${v.toFixed(1)}%`,
    description: 'Non-performing loans / total loans. Dataset range: 0% – 3.24%. Above 10% = red zone.'
  },
  {
    key: 'car',
    label: 'CAR (%)',
    featureName: 'CAR',
    type: 'percentage',       // stored as ratio (0.155 = 15.5%)
    min: 0.08,
    max: 0.30,
    step: 0.005,
    defaultVal: 0.1004,
    safeMin: 0.125,
    dangerMax: 0.10,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(1)}%`,
    description: 'Capital / risk-weighted assets. Regulatory minimum 10–12%. Dataset range: 0% – 31.4%.'
  },
  {
    key: 'bankSize',
    label: 'Bank Assets (B EGP)',
    featureName: 'Bank Size',
    type: 'absolute_bn',      // stored in Billion EGP directly (e.g. 23.6)
    min: 10,
    max: 2000,
    step: 10,
    defaultVal: 23.6,
    category: 'INTERNAL',
    format: v => `${v.toFixed(0)}B EGP`,
    description: 'Total assets in Billion EGP. Larger bank = greater systemic resilience.'
  },
  {
    key: 'egx30',
    label: 'EGX30 (pts)',
    featureName: 'Macro: EGX30',
    type: 'points',           // stored as index points (7006)
    min: 5000,
    max: 40000,
    step: 100,
    defaultVal: 7006,
    safeMin: 10000,
    dangerMax: 6000,
    category: 'EXTERNAL',
    format: v => `${v.toLocaleString()} pts`,
    description: 'Egyptian Exchange 30 index level. Dataset range: 0 – 47,786 pts.'
  },
  {
    key: 'inflation',
    label: 'Inflation (%)',
    featureName: 'Macro: Inflation Rate',
    type: 'percentage_value', // stored as whole % (11.1 = 11.1%) — matches Excel column
    min: 5.0,
    max: 40.0,
    step: 0.5,
    defaultVal: 11.1,
    safeMax: 15.0,
    dangerMin: 25.0,
    category: 'EXTERNAL',
    format: v => `${v.toFixed(1)}%`,
    description: 'Egyptian annual headline CPI inflation. Dataset range: 0% – 33.9%.'
  },
  {
    key: 'esg',
    label: 'ESG Rating',
    featureName: 'ESG Score',
    type: 'categorical_slider', // stored as 1/2/3 representing A/AA/AAA
    min: 1,
    max: 3,
    step: 1,
    defaultVal: 1,            // 1=A, 2=AA, 3=AAA (maps to binary 0/1 for backend)
    category: 'INTERNAL',
    format: v => v >= 3 ? 'AAA' : v >= 2 ? 'AA' : 'A',
    description: 'ESG governance tier. Maps to Excel binary: A=0 (non-ESG), AA/AAA=1 (ESG-committed).'
  },
];
