import React, { useState } from 'react'
import OnboardingScreen from './components/onboarding/OnboardingScreen'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const [view, setView] = useState('onboarding') // 'onboarding' | 'dashboard'

  if (view === 'dashboard') {
    return <Dashboard onBack={() => setView('onboarding')} />
  }

  return (
    <OnboardingScreen onNavigateToDashboard={() => setView('dashboard')} />
  )
}

export default App
