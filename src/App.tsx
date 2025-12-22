import { useState, useEffect } from 'react'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'
import LandingPage from './components/LandingPage'
import NetworkSecurityTab from './components/tabs/NetworkSecurityTab'
import IncidentResponseTab from './components/tabs/IncidentResponseTab'
import ThreatIntelTab from './components/tabs/ThreatIntelTab'
import CodeReviewTab from './components/tabs/CodeReviewTab'
import PhishingDetectionTab from './components/tabs/PhishingDetectionTab'
import Footer from './components/Footer'

export type TabType = 'network' | 'incident' | 'threat' | 'code' | 'phishing' | null

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    if (tabParam && ['network', 'incident', 'threat', 'code', 'phishing'].includes(tabParam)) {
      setActiveTab(tabParam as TabType)
    }
  }, [])

  const handleSelectProject = (tabId: string) => {
    setActiveTab(tabId as TabType)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'network':
        return <NetworkSecurityTab />
      case 'incident':
        return <IncidentResponseTab />
      case 'threat':
        return <ThreatIntelTab />
      case 'code':
        return <CodeReviewTab />
      case 'phishing':
        return <PhishingDetectionTab />
      default:
        return <LandingPage onSelectProject={handleSelectProject} />
    }
  }

  return (
    <div className="min-h-screen bg-cyber-darker flex flex-col">
      {activeTab && <Header onBack={() => setActiveTab(null)} />}
      {activeTab && <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />}
      <main className="flex-1">
        <div className="tab-enter">
          {renderTab()}
        </div>
      </main>

      {activeTab && <Footer />}
    </div>
  )
}
