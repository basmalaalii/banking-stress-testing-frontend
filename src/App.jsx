import React, { useState } from 'react'
import OnboardingScreen from './components/onboarding/OnboardingScreen'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const [screen, setScreen] = useState('onboarding') // 'onboarding' or 'dashboard'
  const [initialData, setInitialData] = useState(null)

  const handleProceedToDashboard = (data) => {
    setInitialData(data)
    setScreen('dashboard')
  }

  const handleBackToOnboarding = () => {
    setScreen('onboarding')
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {screen === 'onboarding' ? (
        <OnboardingScreen onProceedToDashboard={handleProceedToDashboard} />
      ) : (
        <Dashboard initialData={initialData} onBackToOnboarding={handleBackToOnboarding} />
      )}
    </div>
  )
}

export default App
