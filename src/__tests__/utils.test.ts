import { formatNumber, formatDuration, timeAgo, engagementRate } from "@/lib/utils";

describe("formatNumber", () => {
  it("formats numbers below 1000 as-is", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(1)).toBe("1");
  });

  it("formats thousands with K suffix", () => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(1200)).toBe("1.2K");
    expect(formatNumber(15600)).toBe("15.6K");
    expect(formatNumber(999999)).toBe("1000K");
  });

  it("formats millions with M suffix", () => {
    expect(formatNumber(1000000)).toBe("1M");
    expect(formatNumber(1500000)).toBe("1.5M");
    expect(formatNumber(23400000)).toBe("23.4M");
  });

  it("formats billions with B suffix", () => {
    expect(formatNumber(1000000000)).toBe("1B");
    expect(formatNumber(2500000000)).toBe("2.5B");
  });

  it("removes trailing .0", () => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(1000000)).toBe("1M");
    expect(formatNumber(1000000000)).toBe("1B");
  });
});

describe("formatDuration", () => {
  it("formats seconds only", () => {
    expect(formatDuration("PT30S")).toBe("0:30");
    expect(formatDuration("PT5S")).toBe("0:05");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration("PT3M45S")).toBe("3:45");
    expect(formatDuration("PT10M0S")).toBe("10:00");
    expect(formatDuration("PT1M5S")).toBe("1:05");
  });

  it("formats hours, minutes and seconds", () => {
    expect(formatDuration("PT1H2M3S")).toBe("1:02:03");
    expect(formatDuration("PT2H0M0S")).toBe("2:00:00");
    expect(formatDuration("PT1H30M0S")).toBe("1:30:00");
  });

  it("handles missing parts", () => {
    expect(formatDuration("PT5M")).toBe("5:00");
    expect(formatDuration("PT1H")).toBe("1:00:00");
    expect(formatDuration("")).toBe("0:00");
  });
});

describe("timeAgo", () => {
  it("returns minutes ago for recent times", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
    expect(timeAgo(fiveMinAgo)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe("3h ago");
  });

  it("returns days ago", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
    expect(timeAgo(twoDaysAgo)).toBe("2d ago");
  });

  it("returns weeks ago", () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString();
    expect(timeAgo(twoWeeksAgo)).toBe("2w ago");
  });

  it("returns months ago", () => {
    const threeMonthsAgo = new Date(Date.now() - 90 * 86400000).toISOString();
    expect(timeAgo(threeMonthsAgo)).toBe("3mo ago");
  });
});

describe("engagementRate", () => {
  it("calculates engagement rate as (likes + comments) / views * 100", () => {
    expect(engagementRate(1000, 50, 10)).toBe(6);
    expect(engagementRate(10000, 100, 50)).toBe(1.5);
  });

  it("returns 0 when views is 0", () => {
    expect(engagementRate(0, 10, 5)).toBe(0);
  });

  it("handles zero likes and comments", () => {
    expect(engagementRate(1000, 0, 0)).toBe(0);
  });
});
