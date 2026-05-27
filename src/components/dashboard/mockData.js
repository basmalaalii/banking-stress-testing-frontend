// mockData.js — Mock data matching backend UnifiedDashboardResponse schema
// All slider values use REAL-WORLD units:
//   roa          → ratio  (e.g. 0.015 = 1.5%)
//   ltd          → ratio  (e.g. 0.72  = 72%)
//   liquidAssets → ratio  (e.g. 0.30  = 30%)
//   npl          → ratio  (e.g. 0.042 = 4.2%)
//   bankSize     → EGP Billion (e.g. 85 = 85B EGP)
//   car          → ratio  (e.g. 0.155 = 15.5%)
//   egx30        → annual return ratio (e.g. 0.12 = +12%)
//   inflation    → percent (e.g. 15.0 = 15%)
//   esg          → score 0-100

export const MOCK_BANKS = {
  BANK1: {
    id: 'BANK1',
    label: 'BANK 1',
    sliders: {
      roa:          0.008,   // 0.8%  — low profitability, stress zone
      ltd:          0.92,    // 92%   — high loan exposure
      liquidAssets: 0.22,   // 22%   — below safe threshold
      npl:          0.072,   // 7.2%  — elevated credit risk
      bankSize:     45,      // 45B EGP — medium-small bank
      car:          0.118,   // 11.8% — barely above regulatory min
      egx30:        0.06,    // +6%   — subdued market return
      inflation:    22.5,    // 22.5% — high inflationary pressure
      esg:          42,      // 42/100 — weak governance score
    },
    prediction_summary: {
      fragility_score: 0.74,
      status: 'FRAGILE',
      confidence_interval: '±2.4%',
      recommendation: 'Increase CAR to 15% immediately via Tier 2 bond issuance. Accelerate NPL provisioning by 20% before Q3 close.',
    },
    top_driver: {
      name: 'NPL RATIO',
      description: 'Critical threshold breach in commercial real estate lending sector.',
      sector_gap: '+3.7%',
    },
    trend: [
      { year: 2016, score: 0.18, forecast: false },
      { year: 2019, score: 0.27, forecast: false },
      { year: 2022, score: 0.48, forecast: false },
      { year: 2026, score: 0.74, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.52, npl: 0.44, roa: 0.62, esg: 0.68 },
    },
  },

  BANK2: {
    id: 'BANK2',
    label: 'BANK 2',
    sliders: {
      roa:          0.024,   // 2.4%  — strong profitability
      ltd:          0.63,    // 63%   — conservative lending
      liquidAssets: 0.45,   // 45%   — excellent liquidity buffer
      npl:          0.022,   // 2.2%  — healthy loan book
      bankSize:     185,     // 185B EGP — large systemically important bank
      car:          0.195,   // 19.5% — well-capitalized
      egx30:        0.18,    // +18%  — strong market tailwind
      inflation:    14.5,    // 14.5% — moderate macro pressure
      esg:          78,      // 78/100 — good governance
    },
    prediction_summary: {
      fragility_score: 0.10,
      status: 'STABLE',
      confidence_interval: '±1.6%',
      recommendation: 'Maintain current capital adequacy levels. Liquidity buffers are strong. Continue ESG integration for rating improvement.',
    },
    top_driver: {
      name: 'LIQUID ASSETS',
      description: 'High liquidity ratio maintains strong short-term solvency coverage.',
      sector_gap: '-4.2%',
    },
    trend: [
      { year: 2016, score: 0.38, forecast: false },
      { year: 2019, score: 0.28, forecast: false },
      { year: 2022, score: 0.18, forecast: false },
      { year: 2026, score: 0.10, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.78, npl: 0.82, roa: 0.76, esg: 0.85 },
    },
  },

  BANK3: {
    id: 'BANK3',
    label: 'BANK 3',
    sliders: {
      roa:          0.013,   // 1.3%  — below average
      ltd:          0.88,    // 88%   — elevated credit pressure
      liquidAssets: 0.27,   // 27%   — tight liquidity
      npl:          0.055,   // 5.5%  — above safe threshold
      bankSize:     68,      // 68B EGP — medium bank
      car:          0.135,   // 13.5% — moderate capital buffer
      egx30:        0.08,    // +8%   — weak market return
      inflation:    19.0,    // 19.0% — elevated inflation
      esg:          58,      // 58/100 — fair governance
    },
    prediction_summary: {
      fragility_score: 0.42,
      status: 'VULNERABLE',
      confidence_interval: '±2.1%',
      recommendation: 'LTD ratio exceeds safe thresholds. Immediate deposit base expansion and NPL restructuring advised.',
    },
    top_driver: {
      name: 'LTD RATIO',
      description: 'Loan-to-deposit ratio exceeds prudential limit, pressuring short-term liquidity.',
      sector_gap: '+8.7%',
    },
    trend: [
      { year: 2016, score: 0.35, forecast: false },
      { year: 2019, score: 0.41, forecast: false },
      { year: 2022, score: 0.38, forecast: false },
      { year: 2026, score: 0.42, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.40, npl: 0.52, roa: 0.58, esg: 0.65 },
    },
  },
};
