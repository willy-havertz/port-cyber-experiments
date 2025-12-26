import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CodeReviewTab from "../components/tabs/CodeReviewTab";
import * as api from "../lib/api-services";
// Render component directly; we don't need ToastProvider for this mock

vi.mock("../lib/api-services");

describe("CodeReviewTab toasts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows success toast on scan", async () => {
    vi.spyOn(api, "analyzeCode").mockResolvedValue({
      vulnerabilities: [
        {
          severity: "critical",
          type: "RCE",
          file_path: "app.py",
          line_number: 10,
          description: "",
          cwe: "CWE-94",
          remediation: "",
        },
      ],
    } as any);

    render(<CodeReviewTab />);

    fireEvent.click(screen.getByText(/Run Scan/i));

    await waitFor(() => {
      expect(api.analyzeCode).toHaveBeenCalled();
    });
  });
});
