// mockData.js — Mock data matching backend UnifiedDashboardResponse schema

export const MOCK_BANKS = {
  BANK1: {
    id: 'BANK1',
    label: 'BANK 1',
    sliders: { roa: 0.012, ltd: 0.824, liquidAssets: 0.42, npl: 0.042, bankSize: 0.824, car: 0.824, egx30: 0.824, inflation: 0.824, esg: 0.75 },
    prediction_summary: {
      fragility_score: 0.75,
      status: 'FRAGILE',
      confidence_interval: '±2.4%',
      recommendation: 'Increase Capital Adequacy Ratio (CAR) to 15% via Tier 2 bond issuance before Q3 close.',
    },
    top_driver: { name: 'NPL RATIO', description: 'Critical threshold breach in commercial real estate lending sector.', sector_gap: '+12.4%' },
    trend: [
      { year: 2016, score: 0.18, forecast: false },
      { year: 2019, score: 0.27, forecast: false },
      { year: 2022, score: 0.48, forecast: false },
      { year: 2026, score: 0.75, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.52, npl: 0.44, roa: 0.62, esg: 0.68 },
    },
    impact_drivers: [
      { name: 'ROA', value: 0.84, safe: true },
      { name: 'LTD', value: 0.72, safe: false },
      { name: 'NPL', value: 0.59, safe: false },
      { name: 'INFLATION RATE', value: 0.41, safe: false },
    ],
    grid: [
      { variable: 'Capital Adequacy Ratio', category: 'INTERNAL', value: '0.11', safe: false, rec: 'Increase CAR to 0.15 within Q3 via asset rebalancing', critical: true },
      { variable: 'Retail Deposit Growth', category: 'INTERNAL', value: '0.05', safe: true, rec: 'Maintain current marketing allocation; index slightly above inflation', critical: false },
      { variable: 'Central Bank Rate Shift', category: 'EXTERNAL', value: '+0.75%', safe: true, rec: 'Hedge interest exposure via swaps; adjust mortgage pricing models', critical: false },
      { variable: 'Sector NPL Average', category: 'EXTERNAL', value: '0.28', safe: false, rec: 'Accelerate provisioning buffering by 15% against CRE exposure', critical: true },
    ],
  },

  BANK2: {
    id: 'BANK2',
    label: 'BANK 2',
    sliders: { roa: 0.025, ltd: 0.65, liquidAssets: 0.52, npl: 0.018, bankSize: 0.55, car: 0.60, egx30: 0.70, inflation: 0.45, esg: 0.88 },
    prediction_summary: {
      fragility_score: 0.28,
      status: 'STABLE',
      confidence_interval: '±1.6%',
      recommendation: 'Maintain current capital adequacy levels. Liquidity buffers are strong. Minor LTD improvement advised.',
    },
    top_driver: { name: 'LIQUID ASSETS', description: 'High liquidity ratio maintains strong short-term solvency coverage.', sector_gap: '-4.2%' },
    trend: [
      { year: 2016, score: 0.38, forecast: false },
      { year: 2019, score: 0.34, forecast: false },
      { year: 2022, score: 0.30, forecast: false },
      { year: 2026, score: 0.28, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.78, npl: 0.82, roa: 0.76, esg: 0.85 },
    },
    impact_drivers: [
      { name: 'LIQUID ASSETS', value: 0.91, safe: true },
      { name: 'CAR', value: 0.78, safe: true },
      { name: 'ROA', value: 0.64, safe: true },
      { name: 'NPL', value: 0.22, safe: true },
    ],
    grid: [
      { variable: 'Capital Adequacy Ratio', category: 'INTERNAL', value: '0.18', safe: true, rec: 'Keep CAR above 15%. Buffer is excellent for current credit exposure.', critical: false },
      { variable: 'Retail Deposit Growth', category: 'INTERNAL', value: '0.09', safe: true, rec: 'Strong deposit base. Continue tiered rate offers to retain large savers.', critical: false },
      { variable: 'Central Bank Rate Shift', category: 'EXTERNAL', value: '+0.25%', safe: true, rec: 'Minimal rate impact. No immediate hedging strategy change required.', critical: false },
      { variable: 'Sector NPL Average', category: 'EXTERNAL', value: '0.03', safe: true, rec: 'Sector credit quality is healthy. Underwriting standards are effective.', critical: false },
    ],
  },

  BANK3: {
    id: 'BANK3',
    label: 'BANK 3',
    sliders: { roa: 0.014, ltd: 0.95, liquidAssets: 0.31, npl: 0.058, bankSize: 0.70, car: 0.50, egx30: 0.55, inflation: 0.70, esg: 0.62 },
    prediction_summary: {
      fragility_score: 0.51,
      status: 'VULNERABLE',
      confidence_interval: '±2.1%',
      recommendation: 'LTD ratio exceeds safe thresholds. Immediate deposit base expansion and NPL restructuring advised.',
    },
    top_driver: { name: 'LTD RATIO', description: 'Loan-to-deposit ratio exceeds prudential limit, pressuring short-term liquidity.', sector_gap: '+8.7%' },
    trend: [
      { year: 2016, score: 0.35, forecast: false },
      { year: 2019, score: 0.41, forecast: false },
      { year: 2022, score: 0.47, forecast: false },
      { year: 2026, score: 0.51, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.40, npl: 0.52, roa: 0.58, esg: 0.65 },
    },
    impact_drivers: [
      { name: 'LTD RATIO', value: 0.88, safe: false },
      { name: 'NPL', value: 0.67, safe: false },
      { name: 'ROA', value: 0.51, safe: true },
      { name: 'INFLATION RATE', value: 0.38, safe: false },
    ],
    grid: [
      { variable: 'Capital Adequacy Ratio', category: 'INTERNAL', value: '0.13', safe: false, rec: 'Retain all Q3 earnings. Delay dividend payout to rebuild capital buffers.', critical: true },
      { variable: 'Retail Deposit Growth', category: 'INTERNAL', value: '0.03', safe: false, rec: 'Offer premium savings certificates to accelerate deposit accumulation.', critical: true },
      { variable: 'Central Bank Rate Shift', category: 'EXTERNAL', value: '+0.50%', safe: true, rec: 'Hedge floating-rate loan book. Consider fixed-rate swap on 30% of portfolio.', critical: false },
      { variable: 'Sector NPL Average', category: 'EXTERNAL', value: '0.12', safe: false, rec: 'Accelerate workout procedures on top 20 distressed corporate accounts.', critical: true },
    ],
  },
};
