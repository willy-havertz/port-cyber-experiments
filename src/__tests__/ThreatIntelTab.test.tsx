import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ThreatIntelTab from "../components/tabs/ThreatIntelTab";
import * as api from "../lib/api-services";

vi.mock("../lib/api-services");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe("ThreatIntelTab toasts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches CVEs and triggers severity toast", async () => {
    vi.spyOn(api, "fetchRecentCVEs").mockResolvedValue([
      {
        id: "CVE-2025-0001",
        severity: "high",
        description: "",
        published_date: "2025-12-01",
        cvss_score: 7.5,
      } as any,
    ]);

    render(<ThreatIntelTab />);

    fireEvent.click(screen.getByText(/Fetch CVEs/i));

    await waitFor(() => {
      expect(api.fetchRecentCVEs).toHaveBeenCalled();
    });
  });
});
