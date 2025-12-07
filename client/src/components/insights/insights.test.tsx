import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Insights } from "./insights.tsx";
import type { Insight } from "../../schemas/insight.ts";

const TEST_INSIGHTS: Insight[] = [
  {
    id: 1,
    brand: 2,
    text: "First insight",
    createdAt: new Date(),
  },
  {
    id: 2,
    brand: 3,
    text: "Second insight",
    createdAt: new Date(),
  },
];

describe("insights", () => {
  it("renders", () => {
    const { getByText } = render(
      <Insights insights={TEST_INSIGHTS} onDelete={() => {}} />,
    );
    expect(getByText(TEST_INSIGHTS[0].text)).toBeTruthy();
  });
});
