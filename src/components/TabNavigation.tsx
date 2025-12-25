import { TabType } from "../App";
import { Network, AlertTriangle, Radar, Code2, Mail, Shield } from "lucide-react";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs = [
  { id: "network" as TabType, label: "Network Security", icon: Network },
  {
    id: "incident" as TabType,
    label: "Incident Response",
    icon: AlertTriangle,
  },
  { id: "threat" as TabType, label: "Threat Intelligence", icon: Radar },
  { id: "code" as TabType, label: "Code Review", icon: Code2 },
  { id: "phishing" as TabType, label: "Phishing Detection", icon: Mail },
  { id: "scanner" as TabType, label: "Vulnerability Scanner", icon: Shield },
];

export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  return (
    <div className="border-b border-cyber-border bg-cyber-dark">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? "border-cyber-accent text-cyber-accent"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
