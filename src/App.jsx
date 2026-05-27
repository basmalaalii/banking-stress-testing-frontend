import React, { useState } from 'react'
import OnboardingScreen from './components/onboarding/OnboardingScreen'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  // 'onboarding' | 'dashboard'
  const [screen, setScreen]     = useState('onboarding')
  // banksData is List[UnifiedDashboardResponse] from the backend
  const [banksData, setBanksData] = useState([])

  const handleBanksReady = (data) => {
    if (!data || data.length === 0) return
    setBanksData(data)
    setScreen('dashboard')
  }

  const handleBackToOnboarding = () => {
    setScreen('onboarding')
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {screen === 'onboarding' ? (
        <OnboardingScreen onBanksReady={handleBanksReady} />
      ) : (
        <Dashboard banksData={banksData} onBackToOnboarding={handleBackToOnboarding} />
      )}
    </div>
  )
}

export default App
