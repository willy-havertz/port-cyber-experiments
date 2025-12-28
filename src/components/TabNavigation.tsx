import { TabType } from "../App";
import {
  Network,
  AlertTriangle,
  Radar,
  Code2,
  Mail,
  Shield,
  Lock,
  Award,
  Zap,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  { id: "api-audit" as TabType, label: "API Audit", icon: Zap },
  { id: "password" as TabType, label: "Password Analyzer", icon: Lock },
  { id: "certificate" as TabType, label: "Certificate Checker", icon: Award },
];

export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);

  // Responsive: show dropdown on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsDropdown(window.innerWidth < 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll fade effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkFade = () => {
      setShowLeftFade(el.scrollLeft > 0);
      setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    checkFade();
    el.addEventListener("scroll", checkFade);
    return () => el.removeEventListener("scroll", checkFade);
  }, []);

  // Animated tab transition
  // (handled by tailwind transition and a custom class)

  return (
    <div className="bg-cyber-dark py-4 relative">
      <div className="container mx-auto px-2">
        {isDropdown ? (
          <select
            className="w-full rounded-2xl px-7 py-4 bg-cyber-dark text-lg text-cyber-accent border-2 border-cyber-accent focus:outline-none focus:ring-4 focus:ring-cyber-accent/40 shadow-lg transition-all duration-200"
            style={{ minHeight: 56, minWidth: 200 }}
            value={activeTab?.toString() ?? ""}
            onChange={(e) => setActiveTab(e.target.value as TabType)}
            aria-label="Select tab"
          >
            {tabs.map((tab) => (
              <option
                key={tab.id ?? tab.label}
                value={tab.id ? tab.id.toString() : ""}
                className="bg-cyber-dark text-cyber-accent text-base py-3 px-4"
              >
                {tab.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="relative">
            <button
              className={`tab-fade tab-fade-left flex items-center justify-center bg-white/10 border border-cyber-accent rounded-full transition-all duration-200 hover:bg-cyber-accent/20 hover:scale-110 hover:border-cyber-accent/80 hover:shadow-lg hover:shadow-cyber-accent/30 hover:-translate-y-1 ${
                !showLeftFade ? "opacity-40" : ""
              }`}
              style={{ pointerEvents: "auto" }}
              aria-label="Scroll left"
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({
                    left: -150,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <ChevronLeft className="w-6 h-6 text-cyber-accent transition-colors duration-200 arrow-bounce" />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto hide-scrollbar relative z-10"
              style={{ scrollBehavior: "smooth" }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium whitespace-nowrap min-w-fit focus:outline-none border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-cyber-accent text-cyber-dark border-cyber-accent shadow-md tab-active-animate"
                        : "bg-cyber-dark text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-cyber-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button
              className={`tab-fade tab-fade-right flex items-center justify-center bg-white/10 border border-cyber-accent rounded-full transition-all duration-200 hover:bg-cyber-accent/20 hover:scale-110 hover:border-cyber-accent/80 hover:shadow-lg hover:shadow-cyber-accent/30 hover:-translate-y-1 ${
                !showRightFade ? "opacity-40" : ""
              }`}
              style={{ pointerEvents: "auto" }}
              aria-label="Scroll right"
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({
                    left: 150,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <ChevronRight className="w-6 h-6 text-cyber-accent transition-colors duration-200 arrow-bounce" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
