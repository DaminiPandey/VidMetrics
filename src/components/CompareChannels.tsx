"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Plus, X, GitCompareArrows, Eye, TrendingUp, Crown } from "lucide-react";
import { formatNumber, engagementRate } from "@/lib/utils";
import type { ChannelInfo, VideoInfo } from "@/lib/youtube";

interface ChannelData {
  channel: ChannelInfo;
  videos: VideoInfo[];
}

const CHANNEL_COLORS = [
  { bg: "bg-accent/15", border: "border-accent", text: "text-accent", hex: "#2dd4bf", label: "A" },
  { bg: "bg-amber-500/15", border: "border-amber-500", text: "text-amber-400", hex: "#f59e0b", label: "B" },
  { bg: "bg-rose-500/15", border: "border-rose-500", text: "text-rose-400", hex: "#f472b6", label: "C" },
];

export default function CompareChannels({
  primaryChannel,
  primaryVideos,
}: {
  primaryChannel: ChannelInfo;
  primaryVideos: VideoInfo[];
}) {
  const [compareInput, setCompareInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [channels, setChannels] = useState<ChannelData[]>([
    { channel: primaryChannel, videos: primaryVideos },
  ]);

  const addChannel = async () => {
    if (!compareInput.trim() || channels.length >= 3) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/channel?q=${encodeURIComponent(compareInput.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Channel not found.");
        return;
      }

      // Check for duplicate
      if (channels.some((c) => c.channel.id === data.channel.id)) {
        setError("This channel is already added.");
        return;
      }

      setChannels((prev) => [...prev, { channel: data.channel, videos: data.videos }]);
      setCompareInput("");
    } catch {
      setError("Failed to fetch channel.");
    } finally {
      setLoading(false);
    }
  };

  const removeChannel = (index: number) => {
    if (index === 0) return; // Can't remove primary
    setChannels((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate comparison metrics
  const comparisonData = channels.map((ch, i) => {
    const avgViews =
      ch.videos.length > 0
        ? ch.videos.reduce((sum, v) => sum + v.viewCount, 0) / ch.videos.length
        : 0;
    const avgEng =
      ch.videos.length > 0
        ? ch.videos.reduce(
            (sum, v) => sum + engagementRate(v.viewCount, v.likeCount, v.commentCount),
            0
          ) / ch.videos.length
        : 0;
    const avgLikes =
      ch.videos.length > 0
        ? ch.videos.reduce((sum, v) => sum + v.likeCount, 0) / ch.videos.length
        : 0;

    return {
      name: ch.channel.title,
      color: CHANNEL_COLORS[i],
      subscribers: parseInt(ch.channel.subscriberCount),
      totalViews: parseInt(ch.channel.viewCount),
      videoCount: parseInt(ch.channel.videoCount),
      avgViews: Math.round(avgViews),
      avgEngagement: parseFloat(avgEng.toFixed(2)),
      avgLikes: Math.round(avgLikes),
      thumbnail: ch.channel.thumbnail,
      customUrl: ch.channel.customUrl,
    };
  });

  // Calculate overall winner (most metric wins)
  const winnerIndex = (() => {
    if (channels.length < 2) return -1;
    const metrics: (keyof typeof comparisonData[0])[] = [
      "subscribers", "totalViews", "avgViews", "avgEngagement", "avgLikes",
    ];
    const scores = comparisonData.map(() => 0);
    metrics.forEach((key) => {
      const values = comparisonData.map((c) => c[key] as number);
      const maxVal = Math.max(...values);
      values.forEach((v, i) => {
        if (v === maxVal) scores[i]++;
      });
    });
    const maxScore = Math.max(...scores);
    return scores.indexOf(maxScore);
  })();

  const chartData = [
    {
      metric: "Avg Views",
      ...Object.fromEntries(comparisonData.map((c) => [c.name, c.avgViews])),
    },
    {
      metric: "Avg Likes",
      ...Object.fromEntries(comparisonData.map((c) => [c.name, c.avgLikes])),
    },
    {
      metric: "Subscribers",
      ...Object.fromEntries(comparisonData.map((c) => [c.name, c.subscribers])),
    },
  ];

  const tooltipStyle = {
    backgroundColor: "#1a1a2e",
    border: "1px solid #2a2a4a",
    borderRadius: "12px",
    fontSize: "13px",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <GitCompareArrows className="h-5 w-5 text-accent" />
          Channel Comparison
        </h2>
      </div>

      {/* Channel Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((ch, i) => (
          <div
            key={ch.channel.id}
            className={`relative rounded-xl border border-border bg-bg-surface p-4`}
          >
            {/* Winner badge */}
            {winnerIndex === i && channels.length >= 2 && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black shadow-lg">
                <Crown className="h-3 w-3" />
                Winner
              </div>
            )}
            {i > 0 && (
              <button
                onClick={() => removeChannel(i)}
                className="absolute top-3 right-3 rounded-full p-1 text-text-muted transition-colors hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <Image
                src={ch.channel.thumbnail}
                alt={ch.channel.title}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${CHANNEL_COLORS[i].bg} ${CHANNEL_COLORS[i].text}`}
                  >
                    {CHANNEL_COLORS[i].label}
                  </span>
                  <p className="truncate font-semibold text-text-primary">
                    {ch.channel.title}
                  </p>
                </div>
                {ch.channel.customUrl && (
                  <p className="text-xs text-text-muted">{ch.channel.customUrl}</p>
                )}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-mono text-sm font-bold text-text-primary">
                  {formatNumber(parseInt(ch.channel.subscriberCount))}
                </p>
                <p className="text-[10px] text-text-muted">Subs</p>
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-text-primary">
                  {formatNumber(parseInt(ch.channel.videoCount))}
                </p>
                <p className="text-[10px] text-text-muted">Videos</p>
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-text-primary">
                  {formatNumber(parseInt(ch.channel.viewCount))}
                </p>
                <p className="text-[10px] text-text-muted">Views</p>
              </div>
            </div>
          </div>
        ))}

        {/* Add Channel Card */}
        {channels.length < 3 && (
          <div className="rounded-xl border border-dashed border-border p-4">
            <p className="mb-3 text-sm font-medium text-text-secondary">
              Add channel to compare
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={compareInput}
                onChange={(e) => setCompareInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChannel()}
                placeholder="@handle or URL..."
                className="flex-1 w-full rounded-lg border border-border bg-bg-base px-3 py-2 text-sm text-text-primary placeholder-text-muted transition-colors focus:border-accent focus:outline-none"
              />
              <button
                onClick={addChannel}
                disabled={loading}
                className="shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-hover disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding
                  </span>
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
          </div>
        )}
      </div>

      {/* Comparison Chart — only show when 2+ channels */}
      {channels.length >= 2 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grouped Bar Chart */}
          <div className="rounded-xl border border-border bg-bg-surface p-4 sm:p-6 overflow-x-auto">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <Eye className="h-5 w-5 text-accent" />
              Views & Likes Comparison
            </h3>
            <div className="h-72 min-w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                  <XAxis dataKey="metric" stroke="#6b7280" fontSize={12} tick={{ fill: "#a1a1aa" }} />
                  <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip
                    cursor={{ fill: "rgba(45, 212, 191, 0.06)" }}
                    contentStyle={tooltipStyle}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => formatNumber(Number(value))}
                    labelStyle={{ color: "#e5e7eb" }}
                  />
                  <Legend />
                  {comparisonData.map((c) => (
                    <Bar
                      key={c.name}
                      dataKey={c.name}
                      fill={c.color.hex}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-side Metrics Table */}
          <div className="rounded-xl border border-border bg-bg-surface p-4 sm:p-6 overflow-x-auto">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <TrendingUp className="h-5 w-5 text-accent" />
              Head-to-Head
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                      Metric
                    </th>
                    {comparisonData.map((c) => (
                      <th key={c.name} className="pb-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${c.color.bg} ${c.color.text}`}
                          >
                            {c.color.label}
                          </span>
                          <span className="text-xs font-medium text-text-primary truncate max-w-[120px]">
                            {c.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Subscribers", key: "subscribers" as const, format: (v: number) => formatNumber(v) },
                    { label: "Total Views", key: "totalViews" as const, format: (v: number) => formatNumber(v) },
                    { label: "Videos", key: "videoCount" as const, format: (v: number) => formatNumber(v) },
                    { label: "Avg Views / Video", key: "avgViews" as const, format: (v: number) => formatNumber(v) },
                    { label: "Avg Likes / Video", key: "avgLikes" as const, format: (v: number) => formatNumber(v) },
                    { label: "Avg Engagement", key: "avgEngagement" as const, format: (v: number) => `${v}%` },
                  ].map((row) => {
                    const values = comparisonData.map((c) => c[row.key]);
                    const maxVal = Math.max(...values);
                    return (
                      <tr key={row.label} className="border-b border-border/50">
                        <td className="py-3 pr-4 text-text-secondary">{row.label}</td>
                        {comparisonData.map((c, i) => {
                          const val = c[row.key];
                          const isMax = val === maxVal && channels.length > 1;
                          return (
                            <td key={c.name} className="py-3 px-4 text-center">
                              <span
                                className={`font-mono font-semibold ${
                                  isMax ? c.color.text : "text-text-primary"
                                }`}
                              >
                                {row.format(val)}
                              </span>
                              {isMax && channels.length > 1 && (
                                <span className="ml-1.5 text-[10px] text-text-muted">
                                  ★
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
