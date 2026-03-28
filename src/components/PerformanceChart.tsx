"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { formatNumber, engagementRate } from "@/lib/utils";
import { useTheme } from "@/lib/useTheme";
import type { VideoInfo } from "@/lib/youtube";

type ChartDateFilter = "7d" | "14d" | "30d" | "all";

const CHART_DATE_FILTERS: { value: ChartDateFilter; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "14d", label: "14D" },
  { value: "30d", label: "30D" },
  { value: "all", label: "All" },
];

type TopCount = 5 | 10 | 20;

const TOP_COUNTS: { value: TopCount; label: string }[] = [
  { value: 5, label: "Top 5" },
  { value: 10, label: "Top 10" },
  { value: 20, label: "Top 20" },
];

export default function PerformanceChart({ videos }: { videos: VideoInfo[] }) {
  const [engDateFilter, setEngDateFilter] = useState<ChartDateFilter>("all");
  const [topCount, setTopCount] = useState<TopCount>(10);
  const [logScale, setLogScale] = useState(false);
  const { colors: tc } = useTheme();

  const topByViews = useMemo(() => {
    return [...videos]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, topCount)
      .map((v) => ({
        name: v.title.length > 25 ? v.title.slice(0, 25) + "..." : v.title,
        fullTitle: v.title,
        views: v.viewCount,
      }));
  }, [videos, topCount]);

  // Chronological data for engagement trend (filtered)
  const chronological = useMemo(() => {
    let filtered = [...videos];

    if (engDateFilter !== "all") {
      const now = Date.now();
      const cutoffs: Record<string, number> = {
        "7d": 7 * 86400000,
        "14d": 14 * 86400000,
        "30d": 30 * 86400000,
      };
      const cutoff = now - cutoffs[engDateFilter];
      filtered = filtered.filter(
        (v) => new Date(v.publishedAt).getTime() >= cutoff
      );
    }

    return filtered
      .sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      )
      .map((v) => ({
        date: new Date(v.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        views: v.viewCount,
        engagement: parseFloat(
          engagementRate(v.viewCount, v.likeCount, v.commentCount).toFixed(2)
        ),
      }));
  }, [videos, engDateFilter]);

  const tooltipStyle = {
    backgroundColor: tc.tooltipBg,
    border: `1px solid ${tc.tooltipBorder}`,
    borderRadius: "12px",
    fontSize: "13px",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Top Videos Bar Chart */}
      <div className="rounded-xl border border-border bg-bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <BarChart3 className="h-5 w-5 text-accent" />
            Top Videos by Views
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLogScale(!logScale)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                logScale
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-muted hover:border-border-hover hover:text-text-primary"
              }`}
              title="Toggle logarithmic scale"
            >
              Log
            </button>
            <span className="mx-1 h-4 w-px bg-border" />
            {TOP_COUNTS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTopCount(t.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  topCount === t.value
                    ? "bg-accent text-text-inverse"
                    : "border border-border text-text-muted hover:border-border-hover hover:text-text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topByViews} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tc.grid} horizontal={false} />
              <XAxis
                type="number"
                scale={logScale ? "log" : "auto"}
                domain={logScale ? [1, "auto"] : [0, "auto"]}
                tickFormatter={(v) => formatNumber(v)}
                stroke={tc.axis}
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                stroke={tc.axis}
                fontSize={11}
                tick={{ fill: tc.axisLabel }}
              />
              <Tooltip
                cursor={{ fill: tc.cursor }}
                contentStyle={tooltipStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                labelFormatter={(_: any, payload: readonly any[]) => payload?.[0]?.payload?.fullTitle || _}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [formatNumber(Number(value)), "Views"]}
                labelStyle={{ color: "#e5e7eb", fontWeight: 600, maxWidth: 300, whiteSpace: "normal" as const }}
              />
              <Bar dataKey="views" fill={tc.accent} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Trend Line Chart */}
      <div className="rounded-xl border border-border bg-bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <TrendingUp className="h-5 w-5 text-accent" />
            Engagement Over Time
          </h3>
          <div className="flex gap-1.5">
            {CHART_DATE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setEngDateFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  engDateFilter === f.value
                    ? "bg-accent text-text-inverse"
                    : "border border-border text-text-muted hover:border-border-hover hover:text-text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          {chronological.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chronological} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tc.accent} stopOpacity={0.3} />
                    <stop offset="50%" stopColor={tc.accent} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={tc.accent} stopOpacity={0} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={tc.grid} />
                <XAxis
                  dataKey="date"
                  stroke={tc.axis}
                  fontSize={11}
                  tick={{ fill: tc.axisLabel }}
                />
                <YAxis
                  stroke={tc.axis}
                  fontSize={11}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${Number(value).toFixed(2)}%`, "Engagement"]}
                  labelStyle={{ color: tc.tooltipText }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke={tc.accent}
                  strokeWidth={2.5}
                  fill="url(#engGradient)"
                  filter="url(#glow)"
                  dot={{ r: 4, fill: tc.dotFill, stroke: tc.accent, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: tc.accent, stroke: tc.dotFill, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted">
              No videos found in this time range.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
