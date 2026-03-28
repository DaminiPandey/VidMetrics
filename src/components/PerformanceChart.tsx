"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { formatNumber, engagementRate } from "@/lib/utils";
import type { VideoInfo } from "@/lib/youtube";

export default function PerformanceChart({ videos }: { videos: VideoInfo[] }) {
  // Top 10 by views for bar chart
  const topByViews = [...videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10)
    .map((v) => ({
      name: v.title.length > 25 ? v.title.slice(0, 25) + "..." : v.title,
      views: v.viewCount,
    }));

  // Chronological data for engagement trend
  const chronological = [...videos]
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
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

  const tooltipStyle = {
    backgroundColor: "#1a1a2e",
    border: "1px solid #2a2a4a",
    borderRadius: "12px",
    fontSize: "13px",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Top Videos Bar Chart */}
      <div className="rounded-xl border border-border bg-bg-surface p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Top Videos by Views
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topByViews} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => formatNumber(v)}
                stroke="#6b7280"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                stroke="#6b7280"
                fontSize={11}
                tick={{ fill: "#a1a1aa" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [formatNumber(Number(value)), "Views"]}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Bar dataKey="views" fill="#2dd4bf" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Trend Line Chart */}
      <div className="rounded-xl border border-border bg-bg-surface p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Engagement Over Time
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chronological} margin={{ left: 0, right: 20 }}>
              <defs>
                <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={11}
                tick={{ fill: "#a1a1aa" }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${Number(value).toFixed(2)}%`, "Engagement"]}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#2dd4bf"
                strokeWidth={2}
                fill="url(#engGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
