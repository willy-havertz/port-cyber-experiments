import { useState, useEffect } from "react";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import LandingPage from "./components/LandingPage";
import NetworkSecurityTab from "./components/tabs/NetworkSecurityTab";
import IncidentResponseTab from "./components/tabs/IncidentResponseTab";
import ThreatIntelTab from "./components/tabs/ThreatIntelTab";
import CodeReviewTab from "./components/tabs/CodeReviewTab";
import PhishingDetectionTab from "./components/tabs/PhishingDetectionTab";
import ScannerTab from "./components/tabs/ScannerTab";
import Footer from "./components/Footer";

export type TabType =
  | "network"
  | "incident"
  | "threat"
  | "code"
  | "phishing"
  | "scanner"
  | null;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (
      tabParam &&
      ["network", "incident", "threat", "code", "phishing", "scanner"].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam as TabType);
    }
  }, []);

  // Keep the URL query parameter in sync with the active tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTab) {
      params.set("tab", activeTab);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    } else {
      // remove tab param when no active tab
      params.delete("tab");
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [activeTab]);

  // Respond to browser navigation (back/forward) by syncing state from URL
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        [
          "network",
          "incident",
          "threat",
          "code",
          "phishing",
          "scanner",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam as TabType);
      } else {
        setActiveTab(null);
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleSelectProject = (tabId: string) => {
    setActiveTab(tabId as TabType);
  };

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
      case "scanner":
        return <ScannerTab />;
      default:
        return <LandingPage onSelectProject={handleSelectProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-darker flex flex-col">
      {activeTab && <Header onBack={() => setActiveTab(null)} />}
      {activeTab && (
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      <main className="flex-1">
        <div className="tab-enter">{renderTab()}</div>
      </main>

      {activeTab && <Footer />}
    </div>
  );
}
