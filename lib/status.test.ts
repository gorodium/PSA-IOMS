import { describe, expect, it } from "vitest";
import { calculateTaskStatus } from "./status";

const today = new Date(2026, 4, 18);

describe("calculateTaskStatus", () => {
  it("returns COMPLETED when dateSubmitted exists", () => {
    expect(
      calculateTaskStatus(
        {
          dateSubmitted: new Date(2026, 4, 17),
          progress: 20,
          deadline: new Date(2026, 4, 10),
          isActive: true
        },
        today
      )
    ).toBe("COMPLETED");
  });

  it("returns COMPLETED when progress is 100", () => {
    expect(
      calculateTaskStatus(
        {
          progress: 100,
          deadline: new Date(2026, 4, 10),
          isActive: true
        },
        today
      )
    ).toBe("COMPLETED");
  });

  it("returns OVERDUE when deadline is before today", () => {
    expect(
      calculateTaskStatus(
        {
          progress: 50,
          deadline: new Date(2026, 4, 17),
          isActive: true
        },
        today
      )
    ).toBe("OVERDUE");
  });

  it("returns DUE_TODAY when deadline is today", () => {
    expect(
      calculateTaskStatus(
        {
          progress: 50,
          deadline: new Date(2026, 4, 18),
          isActive: true
        },
        today
      )
    ).toBe("DUE_TODAY");
  });

  it("returns DUE_SOON when deadline is within the next seven days", () => {
    expect(
      calculateTaskStatus(
        {
          progress: 50,
          deadline: new Date(2026, 4, 25),
          isActive: true
        },
        today
      )
    ).toBe("DUE_SOON");
  });

  it("returns ON_TRACK when deadline is more than seven days away", () => {
    expect(
      calculateTaskStatus(
        {
          progress: 50,
          deadline: new Date(2026, 4, 26),
          isActive: true
        },
        today
      )
    ).toBe("ON_TRACK");
  });

  it("returns NO_DEADLINE when deadline is not set", () => {
    expect(
      calculateTaskStatus(
        {
          progress: 50,
          deadline: null,
          isActive: true
        },
        today
      )
    ).toBe("NO_DEADLINE");
  });

  it("returns INACTIVE for inactive tasks", () => {
    expect(
      calculateTaskStatus(
        {
          progress: 100,
          deadline: new Date(2026, 4, 18),
          isActive: false
        },
        today
      )
    ).toBe("INACTIVE");
  });
});
