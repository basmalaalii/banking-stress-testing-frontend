// mockData.js — Mock data for Dashboard static shell
// All slider values use REAL-WORLD units matching variableConfig.js & backend schema:
//   roa          → ratio        (e.g. 0.0093 = 0.93%)
//   ltd          → ratio        (e.g. 2.085  = 208.5%)
//   liquidAssets → ratio        (e.g. 0.53   = 53%)
//   npl          → whole %      (e.g. 3.24   = 3.24%)
//   car          → ratio        (e.g. 0.1004 = 10.04%)
//   bankSize     → ln(Assets in EGP thousands)  (e.g. 10.07)
//   egx30        → index points (e.g. 7006)
//   inflation    → whole %      (e.g. 11.1   = 11.1%)
//   esg          → 0 or 1       (0=A, 1=AA/AAA)
//   isGovernment → boolean
//   isCrisis     → boolean

export const MOCK_BANKS = {
  BANK1: {
    id: 'BANK1',
    label: 'BANK 1',
    sliders: {
      roa:          0.009,    // 0.9%  — low profitability
      ltd:          2.40,     // 240%  — very high credit exposure
      liquidAssets: 0.34,     // 34%   — moderate liquidity
      npl:          3.24,     // 3.24% — moderate NPL
      car:          0.100,    // 10.0% — barely at regulatory minimum
      bankSize:     10.07,    // ln(~23.6B EGP)
      egx30:        7006,     // 7,006 pts — low market index
      inflation:    11.1,     // 11.1%
      esg:          0,        // A rating (non-ESG)
      isGovernment: false,
      isCrisis:     false,
    },
    prediction_summary: {
      fragility_score: 0.74,
      status: 'FRAGILE',
      confidence_interval: '±2.4%',
      recommendation: 'CAR at regulatory minimum — immediate Tier 2 bond issuance required. High LTD ratio signals severe funding pressure.',
    },
    top_driver: {
      name: 'LTD RATIO',
      description: 'Loan-to-deposit at 240% creates extreme liquidity concentration risk.',
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
    sliders: {
      roa:          0.031,    // 3.1%  — healthy profitability (75th pct)
      ltd:          0.526,    // 52.6% — conservative LTD (25th pct)
      liquidAssets: 0.49,     // 49%   — strong liquidity buffer
      npl:          0.31,     // 0.31% — excellent asset quality (25th pct)
      car:          0.209,    // 20.9% — well-capitalised (75th pct)
      bankSize:     18.77,    // ln(~140B EGP) — large systemically important bank
      egx30:        15019,    // 15,019 pts — strong market
      inflation:    14.4,     // 14.4%
      esg:          1,        // AA rating
      isGovernment: false,
      isCrisis:     false,
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
    sliders: {
      roa:          0.017,    // 1.7%  — below sector mean (2.5%)
      ltd:          1.916,    // 191.6% — elevated exposure (median)
      liquidAssets: 0.40,     // 40%   — adequate (near median)
      npl:          0.92,     // 0.92% — moderate NPL
      car:          0.141,    // 14.1% — adequate but not strong
      bankSize:     11.01,    // ln(~60B EGP) — medium bank
      egx30:        13962,    // 13,962 pts — moderate market
      inflation:    9.2,      // 9.2%
      esg:          0,        // A rating
      isGovernment: false,
      isCrisis:     false,
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
