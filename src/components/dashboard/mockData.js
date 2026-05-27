// mockData.js — Ground-truth mock data for the 9-variable interactive bank stress testing dashboard
// Calibrated exactly to user ranges:
//   roa          → ratio        (0% - 5%, e.g. 0.0093 = 0.93%)
//   ltd          → ratio        (30% - 250%, e.g. 2.085 = 208.5%)
//   liquidAssets → ratio        (10% - 70%, e.g. 0.53 = 53%)
//   npl          → whole %      (0% - 15%, e.g. 3.24 = 3.24%)
//   car          → ratio        (8% - 30%, e.g. 0.1004 = 10.04%)
//   bankSize     → Billion EGP  (10B - 2000B EGP, e.g. 23.6)
//   egx30        → index points (5000 - 40000 pts, e.g. 7006)
//   inflation    → whole %      (5% - 40%, e.g. 11.1 = 11.1%)
//   esg          → categorical  (1 = A, 2 = AA, 3 = AAA)
// Government Ownership (isGovernment) and Systemic Crisis Mode (isCrisis) are stored as top-level
// static properties for each bank (not modified by sliders, as they are part of onboarding setup).

export const MOCK_BANKS = {
  BANK1: {
    id: 'BANK1',
    label: 'BANK 1',
    isGovernment: false,
    isCrisis: false,
    sliders: {
      roa:          0.009,    // 0.9%  — low profitability
      ltd:          2.08,     // 208%  — high credit risk (above 200%)
      liquidAssets: 0.34,     // 34%   — moderate liquidity
      npl:          3.24,     // 3.24% — moderate NPL
      car:          0.100,    // 10.0% — barely at regulatory minimum
      bankSize:     25,       // 25B EGP
      egx30:        7000,     // 7,006 pts — low market index
      inflation:    11.0,     // 11.0%
      esg:          1,        // A rating (1=A, 2=AA, 3=AAA)
    },
    prediction_summary: {
      fragility_score: 0.74,
      status: 'FRAGILE',
      confidence_interval: '±2.4%',
      recommendation: 'CAR at regulatory minimum — immediate Tier 2 bond issuance required. High LTD ratio signals severe funding pressure.',
    },
    top_driver: {
      name: 'LTD RATIO',
      description: 'Loan-to-deposit at 208% creates extreme liquidity concentration risk.',
      sector_gap: '+58%',
    },
    trend: [
      { year: 2016, score: 0.18, forecast: false },
      { year: 2019, score: 0.35, forecast: false },
      { year: 2022, score: 0.55, forecast: false },
      { year: 2026, score: 0.74, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.42, npl: 0.54, roa: 0.58, esg: 0.60 },
    },
  },

  BANK2: {
    id: 'BANK2',
    label: 'BANK 2',
    isGovernment: false,
    isCrisis: false,
    sliders: {
      roa:          0.031,    // 3.1%  — healthy profitability
      ltd:          0.52,     // 52%   — highly conservative LTD
      liquidAssets: 0.49,     // 49%   — strong liquidity buffer
      npl:          0.3,      // 0.3%  — excellent asset quality
      car:          0.210,    // 21.0% — well-capitalised
      bankSize:     140,      // 140B EGP — systemically important bank
      egx30:        15000,    // 15,000 pts — strong market
      inflation:    14.5,     // 14.5%
      esg:          2,        // AA rating
    },
    prediction_summary: {
      fragility_score: 0.12,
      status: 'STABLE',
      confidence_interval: '±1.6%',
      recommendation: 'Capital buffers are healthy. Liquidity well above minimum. Continue ESG integration programme.',
    },
    top_driver: {
      name: 'LIQUID ASSETS',
      description: 'Liquid asset ratio at 49% provides strong short-term solvency coverage.',
      sector_gap: '-22%',
    },
    trend: [
      { year: 2016, score: 0.35, forecast: false },
      { year: 2019, score: 0.25, forecast: false },
      { year: 2022, score: 0.18, forecast: false },
      { year: 2026, score: 0.12, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.82, npl: 0.88, roa: 0.78, esg: 0.85 },
    },
  },

  BANK3: {
    id: 'BANK3',
    label: 'BANK 3',
    isGovernment: false,
    isCrisis: false,
    sliders: {
      roa:          0.017,    // 1.7%  — moderate profitability
      ltd:          1.91,     // 191%  — elevated exposure
      liquidAssets: 0.40,     // 40%   — adequate
      npl:          0.9,      // 0.9%  — moderate NPL
      car:          0.140,    // 14.0% — adequate
      bankSize:     60,       // 60B EGP — medium bank
      egx30:        14000,    // 14,000 pts — moderate market
      inflation:    9.0,      // 9.0%
      esg:          1,        // A rating
    },
    prediction_summary: {
      fragility_score: 0.42,
      status: 'VULNERABLE',
      confidence_interval: '±2.1%',
      recommendation: 'LTD ratio near stress zone. NPL provisioning should be increased. Monitor macroeconomic sensitivity.',
    },
    top_driver: {
      name: 'LTD RATIO',
      description: 'LTD at 191% creates moderate funding concentration risk near stress threshold.',
      sector_gap: '+9%',
    },
    trend: [
      { year: 2016, score: 0.32, forecast: false },
      { year: 2019, score: 0.38, forecast: false },
      { year: 2022, score: 0.40, forecast: false },
      { year: 2026, score: 0.42, forecast: true },
    ],
    radar: {
      target: { ltd: 0.80, npl: 0.75, roa: 0.80, esg: 0.75 },
      current: { ltd: 0.50, npl: 0.65, roa: 0.62, esg: 0.62 },
    },
  },
};
