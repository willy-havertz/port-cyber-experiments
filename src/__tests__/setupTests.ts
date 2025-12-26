import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Polyfill ResizeObserver for components using recharts/ResponsiveContainer
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.ResizeObserver = global.ResizeObserver || (RO as any);
