import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import NetworkSecurityTab from "../components/tabs/NetworkSecurityTab";
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

describe("NetworkSecurityTab toasts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("invokes scan and triggers error toast on critical issues", async () => {
    vi.spyOn(api, "scanNetworkTarget").mockResolvedValue({
      critical_count: 2,
      high_count: 3,
      medium_count: 0,
      ports: [],
    } as any);

    render(<NetworkSecurityTab />);

    fireEvent.click(screen.getByText(/Run Scan/i));

    await waitFor(() => {
      expect(api.scanNetworkTarget).toHaveBeenCalled();
    });
  });
});
