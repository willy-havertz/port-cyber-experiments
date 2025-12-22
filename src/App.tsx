import { useState } from "react";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import NetworkSecurityTab from "./components/tabs/NetworkSecurityTab";
import IncidentResponseTab from "./components/tabs/IncidentResponseTab";
import ThreatIntelTab from "./components/tabs/ThreatIntelTab";
import CodeReviewTab from "./components/tabs/CodeReviewTab";
import PhishingDetectionTab from "./components/tabs/PhishingDetectionTab";
import Footer from "./components/Footer";

export type TabType = "network" | "incident" | "threat" | "code" | "phishing";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("network");

  const renderTab = () => {
    switch (activeTab) {
      case "network":
        return <NetworkSecurityTab />;
      case "incident":
        return <IncidentResponseTab />;
      case "threat":
        return <ThreatIntelTab />;
      case "code":
        return <CodeReviewTab />;
      case "phishing":
        return <PhishingDetectionTab />;
      default:
        return <NetworkSecurityTab />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-darker flex flex-col">
      <Header />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="tab-enter">{renderTab()}</div>
      </main>

      <Footer />
    </div>
  );
}
