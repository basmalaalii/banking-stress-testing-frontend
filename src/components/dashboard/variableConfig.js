// variableConfig.js — Unified ground-truth config for all 11 banking simulation variables
// Calibrated from: Book1 (1) (1) (2).xlsx  (Model input sheet, 110 rows, 2015-2025)
// 
// Column types:
//   'percentage'       → stored as ratio (e.g. 0.093), displayed as %
//   'percentage_value' → stored as whole-number % (e.g. 3.24), displayed as %
//   'points'           → stored & displayed as raw index points (e.g. 7006)
//   'categorical'      → ESG: options = ['A','AA','AAA'], stored as 0/1
//   'boolean'          → stored as true/false, sent to backend as 0/1

export const VARIABLE_CONFIG = [
  {
    key: 'roa',
    label: 'Return on Assets (ROA)',
    featureName: 'ROA',
    type: 'percentage',
    min: 0.0,
    max: 0.08,
    step: 0.0005,
    defaultVal: 0.0093,
    safeMin: 0.012,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(2)}%`,
    description: 'Net income / total assets. Core profitability measure.',
  },
  {
    key: 'ltd',
    label: 'Loan-to-Deposit (LTD)',
    featureName: 'LDR (LTD)',
    type: 'percentage',
    min: 0.30,
    max: 7.00,
    step: 0.05,
    defaultVal: 2.085,
    safeMax: 3.00,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(0)}%`,
    description: 'Total loans / total deposits. High values indicate funding pressure.',
  },
  {
    key: 'liquidAssets',
    label: 'Liquid Assets Ratio',
    featureName: 'Liquid Assets Ratio',
    type: 'percentage',
    min: 0.15,
    max: 0.85,
    step: 0.01,
    defaultVal: 0.53,
    safeMin: 0.25,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(0)}%`,
    description: 'Liquid assets / total assets. Coverage buffer against cash runs.',
  },
  {
    key: 'npl',
    label: 'Non-Performing Loans (NPL)',
    featureName: 'NPL Ratio',
    type: 'percentage_value',    // stored as e.g. 3.24, NOT 0.0324
    min: 0.0,
    max: 20.0,
    step: 0.1,
    defaultVal: 3.24,
    safeMax: 5.0,
    category: 'INTERNAL',
    format: v => `${v.toFixed(2)}%`,
    description: 'Percentage of non-performing loans in total loan portfolio.',
  },
  {
    key: 'car',
    label: 'Capital Adequacy (CAR)',
    featureName: 'CAR',
    type: 'percentage',
    min: 0.0,
    max: 0.35,
    step: 0.001,
    defaultVal: 0.1004,
    safeMin: 0.125,
    category: 'INTERNAL',
    format: v => `${(v * 100).toFixed(1)}%`,
    description: 'Tier 1+2 capital / risk-weighted assets. Regulatory minimum = 10.5%.',
  },
  {
    key: 'bankSize',
    label: 'Bank Assets Size',
    featureName: 'Bank Size',
    type: 'log_absolute',        // stored as ln(Total Assets in thousands)
    min: 9.0,                    // ln(~8,000 M EGP) ≈ min in dataset (10.06)
    max: 21.5,                   // ln(~2,000,000 M EGP) ≈ max in dataset (21.09)
    step: 0.1,
    defaultVal: 10.07,
    category: 'INTERNAL',
    format: v => {
      const assetsBillions = Math.exp(v) / 1000; // convert from thousands to billions
      return assetsBillions >= 1 ? `${assetsBillions.toFixed(1)}B EGP` : `${(Math.exp(v)).toFixed(0)}M EGP`;
    },
    description: 'Natural log of total assets (in EGP thousands). Dataset range: 10.06 – 21.09.',
  },
  {
    key: 'egx30',
    label: 'EGX30 Index',
    featureName: 'Macro: EGX30',
    type: 'points',
    min: 0,
    max: 50000,
    step: 100,
    defaultVal: 7006,
    safeMin: 5000,
    category: 'EXTERNAL',
    format: v => `${v.toLocaleString()} pts`,
    description: 'Egyptian Exchange 30 main index value in points.',
  },
  {
    key: 'inflation',
    label: 'Inflation Rate',
    featureName: 'Macro: Inflation Rate',
    type: 'percentage_value',    // stored as 11.1 not 0.111
    min: 0.0,
    max: 40.0,
    step: 0.5,
    defaultVal: 11.1,
    safeMax: 20.0,
    category: 'EXTERNAL',
    format: v => `${v.toFixed(1)}%`,
    description: 'Egyptian annual headline CPI inflation rate (%).',
  },
  {
    key: 'esg',
    label: 'ESG Governance Rating',
    featureName: 'ESG Score',
    type: 'categorical',
    options: [
      { label: 'A  — Basic Compliance',  value: 0 },
      { label: 'AA — Active ESG Program', value: 1 },
      { label: 'AAA — ESG Leader',        value: 1 },
    ],
    defaultVal: 0,               // 0 = non-ESG, 1 = ESG-committed (matches Excel: 0 or 1)
    category: 'INTERNAL',
    format: v => v === 0 ? 'A' : 'AA+',
    description: 'Environmental, Social & Governance compliance tier (binary in dataset: 0/1).',
  },
  {
    key: 'isGovernment',
    label: 'Government-Owned Bank',
    featureName: 'Is_Government',
    type: 'boolean',
    defaultVal: false,
    category: 'INTERNAL',
    format: v => v ? 'Yes (State-Owned)' : 'No (Private)',
    description: 'State-owned institution flag (1 = NBE type, 0 = private/commercial).',
  },
  {
    key: 'isCrisis',
    label: 'Systemic Crisis Mode',
    featureName: 'Is_Crisis',
    type: 'boolean',
    defaultVal: false,
    category: 'EXTERNAL',
    format: v => v ? 'Crisis Year Active' : 'Stable Macro Period',
    description: 'Marks known crisis/shock years [2016, 2020, 2022, 2023] per dataset encoding.',
  },
];
